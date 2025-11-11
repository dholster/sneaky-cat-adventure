/**
 * ParallaxBackground - Creates depth through layered backgrounds moving at different speeds
 */

import * as THREE from 'three'

export class ParallaxBackground {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.layers = []
    this.previousCameraX = 0
  }

  /**
   * Add a parallax layer with enhanced visuals and gradient textures
   * @param {number} depth - Depth value (0-1, where 0 is far, 1 is near)
   * @param {number} baseColor - Hex color for this layer
   * @param {number} height - Height of the layer
   * @param {number} yOffset - Y position offset
   */
  addLayer(depth, baseColor, height = 20, yOffset = 5) {
    // Create a large repeating background
    const width = 300 // Extra wide to support scrolling

    const geometry = new THREE.PlaneGeometry(width, height)

    // Create canvas for gradient texture
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Enable smooth rendering
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Extract RGB from hex color
    const r = (baseColor >> 16) & 255
    const g = (baseColor >> 8) & 255
    const b = baseColor & 255

    // Create sophisticated gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)

    // Lighter at top, darker at bottom for atmospheric depth
    gradient.addColorStop(0, `rgb(${Math.min(r + 40, 255)}, ${Math.min(g + 40, 255)}, ${Math.min(b + 40, 255)})`)
    gradient.addColorStop(0.3, `rgb(${Math.min(r + 20, 255)}, ${Math.min(g + 20, 255)}, ${Math.min(b + 20, 255)})`)
    gradient.addColorStop(0.6, `rgb(${r}, ${g}, ${b})`)
    gradient.addColorStop(1, `rgb(${Math.max(r - 30, 0)}, ${Math.max(g - 30, 0)}, ${Math.max(b - 30, 0)})`)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)

    // Add subtle noise texture for depth
    ctx.globalAlpha = 0.08
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const brightness = Math.random() > 0.5 ? 255 : 0
      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`
      ctx.fillRect(x, y, 1, 1)
    }
    ctx.globalAlpha = 1.0

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.4 + (depth * 0.5), // Farther layers are more transparent
      side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geometry, material)

    // Position based on depth (farther = more negative z)
    const zPosition = -10 - (10 * (1 - depth)) // -10 to -20
    mesh.position.set(0, yOffset, zPosition)
    mesh.rotation.x = Math.PI / 12 // Tilt back for 3D perspective

    this.scene.add(mesh)

    this.layers.push({
      mesh: mesh,
      depth: depth, // 0 = far (slow), 1 = near (fast)
      baseX: 0,
      yOffset: yOffset
    })

    console.log(`🎨 Added enhanced parallax layer (depth: ${depth}, z: ${zPosition.toFixed(1)})`)
  }

  /**
   * Add decorative shapes to a layer for visual interest
   */
  addShapesToLayer(layerIndex, shapeType = 'circles', count = 8) {
    if (layerIndex >= this.layers.length) return

    const layer = this.layers[layerIndex]
    const shapes = new THREE.Group()

    for (let i = 0; i < count; i++) {
      let shapeMesh

      if (shapeType === 'circles') {
        const geometry = new THREE.CircleGeometry(1 + Math.random() * 2, 16)
        const material = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          transparent: true,
          opacity: 0.1 + Math.random() * 0.15
        })
        shapeMesh = new THREE.Mesh(geometry, material)
      } else if (shapeType === 'rectangles') {
        const w = 2 + Math.random() * 4
        const h = 2 + Math.random() * 4
        const geometry = new THREE.PlaneGeometry(w, h)
        const material = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          transparent: true,
          opacity: 0.1 + Math.random() * 0.15
        })
        shapeMesh = new THREE.Mesh(geometry, material)
      }

      // Random position across the layer
      shapeMesh.position.x = (Math.random() - 0.5) * 280
      shapeMesh.position.y = layer.yOffset + (Math.random() - 0.5) * 15
      shapeMesh.position.z = 0.1 // Slightly in front of layer

      shapes.add(shapeMesh)
    }

    layer.mesh.add(shapes)
    layer.shapes = shapes
  }

  /**
   * Update parallax layers based on camera position
   */
  update(deltaTime) {
    const cameraX = this.camera.position.x
    const deltaX = cameraX - this.previousCameraX

    // Update each layer based on its depth
    this.layers.forEach(layer => {
      // Parallax factor: closer layers (depth closer to 1) move more
      // Farther layers (depth closer to 0) move less
      const parallaxFactor = 0.3 + (layer.depth * 0.5) // Range: 0.3 to 0.8

      // Move layer opposite to camera movement, scaled by parallax factor
      layer.baseX -= deltaX * (1 - parallaxFactor)

      // Keep layer centered on camera with parallax offset
      layer.mesh.position.x = cameraX + layer.baseX
      layer.mesh.position.y = layer.yOffset
    })

    this.previousCameraX = cameraX
  }

  /**
   * Create a default multi-layer parallax background
   */
  static createDefault(scene, camera) {
    const parallax = new ParallaxBackground(scene, camera)

    // Layer 1: Farthest back - darkest, slowest
    parallax.addLayer(0.1, 0x3A4A5A, 20, 5)
    parallax.addShapesToLayer(0, 'circles', 5)

    // Layer 2: Mid-far - lighter
    parallax.addLayer(0.3, 0x4A5A6A, 18, 5)
    parallax.addShapesToLayer(1, 'rectangles', 6)

    // Layer 3: Mid - even lighter
    parallax.addLayer(0.5, 0x5A6A7A, 16, 5)
    parallax.addShapesToLayer(2, 'circles', 7)

    // Layer 4: Near - lightest, fastest
    parallax.addLayer(0.7, 0x6A7A8A, 14, 5)
    parallax.addShapesToLayer(3, 'rectangles', 8)

    return parallax
  }

  destroy() {
    this.layers.forEach(layer => {
      if (layer.mesh) {
        this.scene.remove(layer.mesh)
        layer.mesh.geometry.dispose()
        layer.mesh.material.dispose()
      }
    })
    this.layers = []
  }
}
