/**
 * Shadow - Creates realistic cast shadows for entities
 * Shadows appear as if cast by a nearby overhead light source
 */

import * as THREE from 'three'

export class Shadow {
  constructor(scene) {
    this.scene = scene
    this.mesh = null
    this.lightAngle = 0.4 // Light direction angle (radian offset from vertical)
    this.lightDistance = 0.8 // How far the shadow stretches
  }

  /**
   * Create a realistic cast shadow for an entity
   * @param {number} width - Entity width
   * @param {number} height - Entity height
   * @param {number} intensity - Shadow darkness (0-1, default 0.3)
   */
  create(width, height, intensity = 0.3) {
    // Shadow is an ellipse stretched in the light direction
    const shadowWidth = width * 1.2 // Slightly wider than entity
    const shadowHeight = height * 0.4 // Flattened ellipse

    const geometry = new THREE.PlaneGeometry(shadowWidth, shadowHeight, 16, 16)

    // Create canvas for gradient shadow texture
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')

    // Enable smooth rendering
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Clear canvas
    ctx.clearRect(0, 0, 128, 128)

    // Create radial gradient for soft shadow
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, `rgba(0, 0, 0, ${intensity})`)
    gradient.addColorStop(0.5, `rgba(0, 0, 0, ${intensity * 0.5})`)
    gradient.addColorStop(0.8, `rgba(0, 0, 0, ${intensity * 0.2})`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
      depthTest: true,
      depthWrite: false,
      blending: THREE.MultiplyBlending // Blend shadows realistically
    })

    this.mesh = new THREE.Mesh(geometry, material)
    // Rotate to lay flat on ground, then tilt back for 3D perspective
    this.mesh.rotation.x = -Math.PI / 2 + Math.PI / 12 // Flat + 3D tilt
    this.mesh.position.z = 0.01 // Just above floor to avoid z-fighting
    this.mesh.renderOrder = -1 // Render before other objects

    this.scene.add(this.mesh)

    return this.mesh
  }

  /**
   * Update shadow position based on entity position and light direction
   * @param {Vector3} entityPos - Entity position
   * @param {number} entityHeight - Entity height for calculating shadow offset
   */
  update(entityPos, entityHeight = 1) {
    if (!this.mesh) return

    // Calculate shadow offset based on light angle
    // Light comes from upper-right (typical lighting direction)
    const shadowOffsetX = Math.sin(this.lightAngle) * this.lightDistance
    const shadowOffsetY = -Math.cos(this.lightAngle) * this.lightDistance * 0.5 // Less vertical offset

    // Position shadow below and offset from entity
    this.mesh.position.x = entityPos.x + shadowOffsetX
    this.mesh.position.y = entityPos.y + shadowOffsetY - (entityHeight * 0.5) // Below entity feet
    this.mesh.position.z = 0.01
  }

  /**
   * Set shadow intensity (useful for height/jumping effects)
   * @param {number} intensity - Shadow opacity (0-1)
   */
  setIntensity(intensity) {
    if (!this.mesh) return
    this.mesh.material.opacity = intensity
  }

  /**
   * Set light direction
   * @param {number} angle - Light angle in radians
   */
  setLightAngle(angle) {
    this.lightAngle = angle
  }

  /**
   * Destroy shadow
   */
  destroy() {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.material.map?.dispose()
      this.mesh.material.dispose()
      this.mesh = null
    }
  }
}
