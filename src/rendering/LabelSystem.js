/**
 * LabelSystem - Creates floating text labels for game objects
 */

import * as THREE from 'three'

export class LabelSystem {
  constructor(scene) {
    this.scene = scene
    this.labels = []
  }

  /**
   * Create a text label above an object
   */
  createLabel(text, position, color = '#ffffff', size = 32) {
    // Create canvas for text
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 512
    canvas.height = 128

    // Draw text
    context.fillStyle = color
    context.font = `bold ${size}px Arial`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(text, 256, 64)

    // Add black outline for visibility
    context.strokeStyle = '#000000'
    context.lineWidth = 4
    context.strokeText(text, 256, 64)
    context.fillStyle = color
    context.fillText(text, 256, 64)

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    })

    const sprite = new THREE.Sprite(material)
    sprite.scale.set(4, 1, 1)
    sprite.position.copy(position)
    sprite.position.z = 3 // High z to be above everything
    sprite.renderOrder = 999 // Render on top

    this.scene.add(sprite)
    this.labels.push(sprite)

    return sprite
  }

  /**
   * Update label position to follow an object
   */
  updateLabelPosition(label, targetPosition, yOffset = 2) {
    label.position.x = targetPosition.x
    label.position.y = targetPosition.y + yOffset
  }

  /**
   * Remove a label
   */
  removeLabel(label) {
    this.scene.remove(label)
    label.material.map.dispose()
    label.material.dispose()

    const index = this.labels.indexOf(label)
    if (index > -1) {
      this.labels.splice(index, 1)
    }
  }

  /**
   * Remove all labels
   */
  removeAllLabels() {
    this.labels.forEach(label => {
      this.scene.remove(label)
      label.material.map.dispose()
      label.material.dispose()
    })
    this.labels = []
  }

  /**
   * Cleanup
   */
  dispose() {
    this.removeAllLabels()
  }
}
