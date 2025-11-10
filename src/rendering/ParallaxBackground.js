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
   * Add a parallax layer
   * @param {number} depth - Depth value (0-1, where 0 is far, 1 is near)
   * @param {number} color - Hex color for this layer
   * @param {number} height - Height of the layer
   * @param {number} yOffset - Y position offset
   */
  addLayer(depth, color, height = 20, yOffset = 5) {
    // Create a large repeating background
    const width = 300 // Extra wide to support scrolling

    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3 + (depth * 0.4), // Farther layers are more transparent
      side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geometry, material)

    // Position based on depth (farther = more negative z)
    const zPosition = -10 - (10 * (1 - depth)) // -10 to -20
    mesh.position.set(0, yOffset, zPosition)

    this.scene.add(mesh)

    this.layers.push({
      mesh: mesh,
      depth: depth, // 0 = far (slow), 1 = near (fast)
      baseX: 0,
      yOffset: yOffset
    })

    console.log(`🎨 Added parallax layer (depth: ${depth}, z: ${zPosition.toFixed(1)})`)
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
