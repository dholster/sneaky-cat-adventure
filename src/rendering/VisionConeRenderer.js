/**
 * VisionConeRenderer - Renders vision cones for enemies using custom shaders
 */

import * as THREE from 'three'
import visionVertexShader from '../../shaders/visionCone/vertex.glsl'
import visionFragmentShader from '../../shaders/visionCone/fragment.glsl'
import { Config } from '../utils/Config.js'

export class VisionConeRenderer {
  constructor(scene, detectionSystem = null, player = null) {
    this.scene = scene
    this.cones = []
    this.detectionSystem = detectionSystem // For occlusion checks
    this.player = player // For tracking player position
    this.raycaster = new THREE.Raycaster() // For occlusion
  }

  /**
   * Create a vision cone for an enemy
   */
  createVisionCone(enemy) {
    const range = enemy.visionRange || Config.DETECTION.VISION_RANGE
    const angle = enemy.visionAngle || Config.DETECTION.VISION_ANGLE

    // Create cone geometry (using CircleGeometry with custom parameters)
    const segments = 32
    const geometry = new THREE.CircleGeometry(range, segments, -angle / 2, angle)

    // Store original positions for occlusion
    const originalPositions = geometry.attributes.position.array.slice()

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDetectionState: { value: 0 },
        uDetectionLevel: { value: 0 },
        uConeColor: { value: new THREE.Color(Config.COLORS.SAFE_GREEN) }
      },
      vertexShader: visionVertexShader,
      fragmentShader: visionFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })

    const cone = new THREE.Mesh(geometry, material)
    cone.position.z = 0.5 // In front of ground, behind entities
    cone.rotation.z = Math.PI / 2 // Rotate to face right initially

    // Make sure vision cones don't interact with raycasting or collision
    cone.userData.isVisionCone = true // Tag for exclusion
    cone.renderOrder = 1 // Render after ground but before entities

    this.scene.add(cone)

    this.cones.push({
      mesh: cone,
      enemy: enemy,
      originalPositions: originalPositions,
      targetRotation: Math.PI / 2 // Current target rotation
    })

    return cone
  }

  /**
   * Update all vision cones
   */
  update(time) {
    this.cones.forEach(coneData => {
      const { mesh, enemy, originalPositions } = coneData
      if (!enemy.active) return

      // Update position to follow enemy
      mesh.position.x = enemy.position.x
      mesh.position.y = enemy.position.y

      // Calculate target rotation
      let targetRotation

      if (enemy.getVisionAngle && typeof enemy.getVisionAngle === 'function') {
        // Camera - use custom rotation angle
        targetRotation = enemy.getVisionAngle() + Math.PI / 2
      } else {
        // Human/Dog - determine if tracking player or using facing direction
        const isDetecting = enemy.detectionLevel > 0 || enemy.detectionState === 'suspicious' || enemy.detectionState === 'alert'

        if (isDetecting && this.player) {
          // Aim toward player when detecting
          const dx = this.player.position.x - enemy.position.x
          const dy = this.player.position.y - enemy.position.y
          const angleToPlayer = Math.atan2(dy, dx)
          targetRotation = angleToPlayer + Math.PI / 2
        } else {
          // Use facing direction when not detecting
          targetRotation = enemy.facing === 1 ? Math.PI / 2 : -Math.PI / 2
        }
      }

      // Smooth rotation toward target
      const currentRotation = mesh.rotation.z
      let rotationDiff = targetRotation - currentRotation

      // Normalize to shortest path
      while (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI
      while (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI

      // Lerp rotation (faster when detecting)
      const rotationSpeed = enemy.detectionLevel > 0 ? 0.15 : 0.08
      mesh.rotation.z = currentRotation + rotationDiff * rotationSpeed

      // Apply occlusion (trim vision cone based on obstacles)
      if (this.detectionSystem && this.detectionSystem.obstacles.length > 0) {
        this.applyOcclusion(mesh, enemy, originalPositions)
      }

      // Update shader uniforms
      mesh.material.uniforms.uTime.value = time
      mesh.material.uniforms.uDetectionLevel.value = enemy.detectionLevel || 0

      // Update color based on detection state
      let color
      let detectionState = 0

      switch (enemy.detectionState) {
        case 'suspicious':
          color = new THREE.Color(Config.COLORS.ALERT_YELLOW)
          detectionState = 1
          break
        case 'alert':
          color = new THREE.Color(Config.COLORS.SECURITY_RED)
          detectionState = 2
          break
        case 'search':
          color = new THREE.Color(0xff8800) // Orange
          detectionState = 1.5
          break
        case 'scanning': // Camera scanning state
          color = new THREE.Color(0x00AAFF) // Blue for cameras
          detectionState = 0
          break
        case 'unaware':
        default:
          color = new THREE.Color(Config.COLORS.SAFE_GREEN)
          detectionState = 0
          break
      }

      mesh.material.uniforms.uConeColor.value = color
      mesh.material.uniforms.uDetectionState.value = detectionState
    })
  }

  /**
   * Apply occlusion to vision cone based on obstacles
   * Modifies geometry to create "shadow" areas where vision is blocked
   */
  applyOcclusion(mesh, enemy, originalPositions) {
    const geometry = mesh.geometry
    const positions = geometry.attributes.position
    const posArray = positions.array

    // Get obstacles that can block vision
    const obstacles = this.detectionSystem.obstacles
      .filter(obs => obs.sprite && !obs.sprite.userData.isVisionCone)
      .map(obs => obs.sprite)

    if (obstacles.length === 0) {
      // No obstacles, restore original geometry
      for (let i = 0; i < originalPositions.length; i++) {
        posArray[i] = originalPositions[i]
      }
      positions.needsUpdate = true
      return
    }

    // For each vertex in the cone, check if line of sight is blocked
    const vertexCount = positions.count
    const enemyPos = new THREE.Vector3(enemy.position.x, enemy.position.y, 1)

    for (let i = 1; i < vertexCount; i++) { // Skip center vertex (index 0)
      // Get world position of this vertex
      const localX = originalPositions[i * 3]
      const localY = originalPositions[i * 3 + 1]

      // Transform by cone rotation
      const angle = mesh.rotation.z - Math.PI / 2
      const worldX = localX * Math.cos(angle) - localY * Math.sin(angle)
      const worldY = localX * Math.sin(angle) + localY * Math.cos(angle)

      const vertexWorldPos = new THREE.Vector3(
        enemy.position.x + worldX,
        enemy.position.y + worldY,
        1
      )

      // Cast ray from enemy to this vertex
      const direction = vertexWorldPos.clone().sub(enemyPos).normalize()
      const distance = enemyPos.distanceTo(vertexWorldPos)

      this.raycaster.set(enemyPos, direction)
      this.raycaster.far = distance

      const intersects = this.raycaster.intersectObjects(obstacles, false)

      // If blocked, pull vertex closer (create shadow)
      if (intersects.length > 0 && intersects[0].distance < distance - 0.1) {
        const hitDistance = intersects[0].distance
        const ratio = hitDistance / distance

        // Scale vertex position toward center
        posArray[i * 3] = originalPositions[i * 3] * ratio
        posArray[i * 3 + 1] = originalPositions[i * 3 + 1] * ratio
      } else {
        // Not blocked, use original position
        posArray[i * 3] = originalPositions[i * 3]
        posArray[i * 3 + 1] = originalPositions[i * 3 + 1]
      }
    }

    positions.needsUpdate = true
  }

  /**
   * Remove a vision cone
   */
  removeCone(enemy) {
    const index = this.cones.findIndex(c => c.enemy === enemy)
    if (index > -1) {
      const cone = this.cones[index]
      this.scene.remove(cone.mesh)
      cone.mesh.geometry.dispose()
      cone.mesh.material.dispose()
      this.cones.splice(index, 1)
    }
  }

  /**
   * Clean up all cones
   */
  dispose() {
    this.cones.forEach(({ mesh }) => {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      mesh.material.dispose()
    })
    this.cones = []
  }
}
