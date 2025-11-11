/**
 * DynamicShadowSystem - Creates realistic shadows cast by overhead lighting
 * Shadows are cast based on object positions and light direction
 */

import * as THREE from 'three'

export class DynamicShadowSystem {
  constructor(scene) {
    this.scene = scene
    this.shadows = [] // Array of shadow objects {entity, shadowMesh}
    this.lightDirection = new THREE.Vector3(0.3, -1, 0.2).normalize() // Overhead light angle
    this.shadowFloorY = 0 // Y position of the floor/ground
    this.raycastObstacles = [] // Objects that can block light
  }

  /**
   * Register an entity to cast a shadow
   */
  addShadowCaster(entity) {
    if (!entity) return

    // Create shadow mesh for this entity
    const shadowGeometry = new THREE.PlaneGeometry(entity.size.width * 1.3, entity.size.height * 0.5)

    // Create gradient shadow texture
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 128, 128)

    // Radial gradient for soft shadow
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)')
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)')
    gradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.1)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      blending: THREE.MultiplyBlending
    })

    const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial)
    shadowMesh.rotation.x = Math.PI / 12 // Match 3D perspective
    shadowMesh.position.z = 0.02 // Just above floor
    shadowMesh.renderOrder = -1

    this.scene.add(shadowMesh)

    this.shadows.push({
      entity: entity,
      shadowMesh: shadowMesh,
      baseOpacity: 0.8
    })

    return shadowMesh
  }

  /**
   * Register obstacles that can block light and create hiding shadows
   */
  registerObstacle(obstacle) {
    if (obstacle && obstacle.sprite) {
      this.raycastObstacles.push(obstacle)
    }
  }

  /**
   * Update all shadow positions and opacity based on lighting
   */
  update(deltaTime) {
    this.shadows.forEach(shadowData => {
      const { entity, shadowMesh, baseOpacity } = shadowData
      if (!entity.active) {
        shadowMesh.visible = false
        return
      }

      shadowMesh.visible = true

      // Calculate shadow offset based on light direction
      const heightAboveGround = entity.position.y - this.shadowFloorY
      const shadowOffset = new THREE.Vector3(
        this.lightDirection.x * heightAboveGround * 3,
        0,
        this.lightDirection.z * heightAboveGround * 2
      )

      // Position shadow on ground, offset from entity
      shadowMesh.position.x = entity.position.x + shadowOffset.x
      shadowMesh.position.y = this.shadowFloorY + shadowOffset.y
      shadowMesh.position.z = 0.02

      // Scale shadow based on height (higher = larger, softer shadow)
      const scale = 1 + heightAboveGround * 0.2
      shadowMesh.scale.set(scale, scale, 1)

      // Fade shadow based on height above ground
      let opacity = baseOpacity
      if (!entity.isGrounded) {
        const fadeAmount = Math.min(heightAboveGround * 0.15, 0.7)
        opacity = Math.max(0.2, baseOpacity - fadeAmount)
      }

      // Check if entity is in shadow (under an obstacle)
      const isInShadow = this.checkIfInShadow(entity.position)
      if (isInShadow) {
        // Darken shadow when entity is already in a shadowed area
        opacity *= 0.5
      }

      shadowMesh.material.opacity = opacity
    })
  }

  /**
   * Check if a position is in shadow (blocked from overhead light)
   */
  checkIfInShadow(position) {
    // Cast ray from position upward to check if light is blocked
    const raycaster = new THREE.Raycaster()
    const upDirection = new THREE.Vector3(-this.lightDirection.x, -this.lightDirection.y, -this.lightDirection.z).normalize()

    raycaster.set(
      new THREE.Vector3(position.x, position.y, 0.5),
      upDirection
    )
    raycaster.far = 20 // Maximum distance to check

    const obstacleMeshes = this.raycastObstacles
      .filter(obs => obs.sprite)
      .map(obs => obs.sprite)

    const intersects = raycaster.intersectObjects(obstacleMeshes, false)
    return intersects.length > 0
  }

  /**
   * Create shadow planes under obstacles for hiding spots
   * These create darker "hiding shadows" that the player can use
   */
  createHidingShadow(obstacle) {
    if (!obstacle || !obstacle.sprite) return null

    const shadowWidth = obstacle.size.width * 2
    const shadowHeight = obstacle.size.height * 1.5

    const geometry = new THREE.PlaneGeometry(shadowWidth, shadowHeight)

    // Create darker shadow texture for hiding spots
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 128, 128)

    // Directional gradient (shadow extends from object)
    const gradient = ctx.createLinearGradient(0, 0, 128, 128)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)')
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.5)')
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.MultiplyBlending
    })

    const shadowMesh = new THREE.Mesh(geometry, material)
    shadowMesh.rotation.x = Math.PI / 12 // Match 3D perspective
    shadowMesh.position.set(
      obstacle.position.x + this.lightDirection.x * 2,
      obstacle.position.y - obstacle.size.height * 0.5,
      0.01
    )
    shadowMesh.renderOrder = -2

    this.scene.add(shadowMesh)
    return shadowMesh
  }

  /**
   * Set the floor Y level for shadow projection
   */
  setFloorLevel(y) {
    this.shadowFloorY = y
  }

  /**
   * Set light direction
   */
  setLightDirection(x, y, z) {
    this.lightDirection.set(x, y, z).normalize()
  }

  /**
   * Remove a shadow
   */
  removeShadow(entity) {
    const index = this.shadows.findIndex(s => s.entity === entity)
    if (index !== -1) {
      const shadowData = this.shadows[index]
      this.scene.remove(shadowData.shadowMesh)
      shadowData.shadowMesh.geometry.dispose()
      shadowData.shadowMesh.material.map?.dispose()
      shadowData.shadowMesh.material.dispose()
      this.shadows.splice(index, 1)
    }
  }

  /**
   * Clean up all shadows
   */
  dispose() {
    this.shadows.forEach(shadowData => {
      this.scene.remove(shadowData.shadowMesh)
      shadowData.shadowMesh.geometry.dispose()
      shadowData.shadowMesh.material.map?.dispose()
      shadowData.shadowMesh.material.dispose()
    })
    this.shadows = []
    this.raycastObstacles = []
  }
}
