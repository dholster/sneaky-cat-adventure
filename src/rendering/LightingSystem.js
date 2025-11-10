/**
 * LightingSystem - Handles atmospheric lighting and visual effects
 */

import * as THREE from 'three'

export class LightingSystem {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera

    // State
    this.dangerLevel = 0 // 0 = safe, 1 = detected
    this.targetDangerLevel = 0
    this.dangerTransitionSpeed = 2.0

    // Lighting components
    this.spotlights = []
    this.vignette = null
    this.ambientLight = null

    this.init()
  }

  init() {
    // Add subtle ambient light to scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    this.scene.add(this.ambientLight)

    // Create vignette overlay
    this.createVignette()

    console.log('💡 Lighting system initialized')
  }

  createVignette() {
    // Create a screen-space vignette effect
    const vignetteSize = 30
    const geometry = new THREE.PlaneGeometry(vignetteSize, vignetteSize)

    // Create canvas for vignette texture
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Create radial gradient (dark at edges, transparent in center)
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.3)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)

    const texture = new THREE.CanvasTexture(canvas)

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.5,
      depthTest: false,
      depthWrite: false
    })

    this.vignette = new THREE.Mesh(geometry, material)
    this.vignette.position.z = 15 // In front of everything
    this.scene.add(this.vignette)
  }

  /**
   * Create a spotlight effect for a camera or light source
   */
  createSpotlight(x, y, direction, angle = 45, distance = 8, color = 0xffffaa) {
    const spotlight = {
      position: new THREE.Vector3(x, y, 0),
      direction: direction, // 1 = right, -1 = left, 2 = down, -2 = up
      angle: angle,
      distance: distance,
      color: color,
      mesh: null,
      cone: null
    }

    // Create cone-shaped light mesh
    const coneGeometry = this.createSpotlightGeometry(direction, angle, distance)

    // Create canvas for light gradient
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')

    // Create gradient from bright center to transparent edges
    const gradient = ctx.createRadialGradient(128, 0, 0, 128, 0, 256)
    const r = (color >> 16) & 255
    const g = (color >> 8) & 255
    const b = color & 255

    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.4)`)
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.2)`)
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)

    const texture = new THREE.CanvasTexture(canvas)

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthTest: false
    })

    spotlight.mesh = new THREE.Mesh(coneGeometry, material)
    spotlight.mesh.position.set(x, y, 2) // In front of background, behind UI

    // Rotate based on direction
    if (direction === -1) { // Left
      spotlight.mesh.rotation.z = Math.PI
    } else if (direction === 2) { // Down
      spotlight.mesh.rotation.z = -Math.PI / 2
    } else if (direction === -2) { // Up
      spotlight.mesh.rotation.z = Math.PI / 2
    }

    this.scene.add(spotlight.mesh)
    this.spotlights.push(spotlight)

    return spotlight
  }

  createSpotlightGeometry(direction, angle, distance) {
    // Create a triangle/cone shape for the light
    const angleRad = (angle * Math.PI) / 180
    const width = Math.tan(angleRad / 2) * distance * 2

    const shape = new THREE.Shape()
    shape.moveTo(0, 0) // Origin point (light source)
    shape.lineTo(distance, width / 2) // Right edge
    shape.lineTo(distance, -width / 2) // Left edge
    shape.lineTo(0, 0) // Back to origin

    const geometry = new THREE.ShapeGeometry(shape)
    return geometry
  }

  /**
   * Remove a spotlight
   */
  removeSpotlight(spotlight) {
    const index = this.spotlights.indexOf(spotlight)
    if (index > -1) {
      this.spotlights.splice(index, 1)
      if (spotlight.mesh) {
        this.scene.remove(spotlight.mesh)
        spotlight.mesh.geometry.dispose()
        spotlight.mesh.material.dispose()
      }
    }
  }

  /**
   * Set danger level (0 = safe, 1 = detected)
   */
  setDanger(level) {
    this.targetDangerLevel = Math.max(0, Math.min(1, level))
  }

  update(deltaTime) {
    // Smoothly transition danger level
    if (this.dangerLevel !== this.targetDangerLevel) {
      const diff = this.targetDangerLevel - this.dangerLevel
      const step = Math.sign(diff) * this.dangerTransitionSpeed * deltaTime

      if (Math.abs(diff) < Math.abs(step)) {
        this.dangerLevel = this.targetDangerLevel
      } else {
        this.dangerLevel += step
      }
    }

    // Update vignette based on danger level
    if (this.vignette) {
      // Intensify vignette when in danger
      const baseOpacity = 0.5
      const dangerOpacity = 0.9
      this.vignette.material.opacity = baseOpacity + (dangerOpacity - baseOpacity) * this.dangerLevel

      // Add red tint when in danger
      if (this.dangerLevel > 0) {
        const redAmount = this.dangerLevel * 0.3
        this.vignette.material.color.setRGB(1, 1 - redAmount, 1 - redAmount)
      } else {
        this.vignette.material.color.setRGB(1, 1, 1)
      }

      // Position vignette relative to camera
      this.vignette.position.x = this.camera.position.x
      this.vignette.position.y = this.camera.position.y
    }

    // Update ambient light based on danger
    if (this.ambientLight) {
      const baseIntensity = 0.3
      const dangerIntensity = 0.2
      this.ambientLight.intensity = baseIntensity + (dangerIntensity - baseIntensity) * this.dangerLevel
    }
  }

  destroy() {
    // Remove all spotlights
    for (const spotlight of this.spotlights) {
      if (spotlight.mesh) {
        this.scene.remove(spotlight.mesh)
        spotlight.mesh.geometry.dispose()
        spotlight.mesh.material.dispose()
      }
    }
    this.spotlights = []

    // Remove vignette
    if (this.vignette) {
      this.scene.remove(this.vignette)
      this.vignette.geometry.dispose()
      this.vignette.material.dispose()
      this.vignette = null
    }

    // Remove ambient light
    if (this.ambientLight) {
      this.scene.remove(this.ambientLight)
      this.ambientLight = null
    }
  }
}
