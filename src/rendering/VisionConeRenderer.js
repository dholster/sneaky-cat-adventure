/**
 * VisionConeRenderer - Renders vision cones for enemies using custom shaders
 */

import * as THREE from 'three'
import visionVertexShader from '../../shaders/visionCone/vertex.glsl'
import visionFragmentShader from '../../shaders/visionCone/fragment.glsl'
import { Config } from '../utils/Config.js'

export class VisionConeRenderer {
  constructor(scene) {
    this.scene = scene
    this.cones = []
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
    cone.position.z = -0.5 // Behind everything - purely visual
    cone.rotation.z = Math.PI / 2 // Rotate to face right initially

    // Make sure vision cones don't interact with raycasting or collision
    cone.userData.isVisionCone = true // Tag for exclusion
    cone.layers.set(1) // Put on different layer

    this.scene.add(cone)

    this.cones.push({ mesh: cone, enemy: enemy })

    return cone
  }

  /**
   * Update all vision cones
   */
  update(time) {
    this.cones.forEach(({ mesh, enemy }) => {
      if (!enemy.active) return

      // Update position to follow enemy
      mesh.position.x = enemy.position.x
      mesh.position.y = enemy.position.y

      // Update rotation based on facing direction
      // facing = 1 (right), facing = -1 (left)
      mesh.rotation.z = enemy.facing === 1 ? Math.PI / 2 : -Math.PI / 2

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
