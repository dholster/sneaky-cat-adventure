/**
 * Platform - Simple static platform for testing
 */

import { Entity } from './Entity.js'

export class Platform extends Entity {
  constructor(scene, x, y, width, height, color = 0x415a77) {
    super(scene)

    this.position.set(x, y, 0)
    this.size = { width, height }

    // Set collider to match platform size
    this.collider.size.x = width
    this.collider.size.y = height

    // Create visual representation with MUCH brighter color
    // Triple the brightness for visibility
    const brightColor = this.brightenColor(color, 3.0)
    this.createColorSprite(brightColor, width, height)

    // Make platforms very visible
    if (this.sprite) {
      this.sprite.position.copy(this.position) // Sync position immediately
      this.sprite.position.z = 0.5 // Behind entities but visible
    }

    // Platforms don't move
    this.isStatic = true
  }

  brightenColor(color, factor) {
    const r = ((color >> 16) & 0xFF) / 255
    const g = ((color >> 8) & 0xFF) / 255
    const b = (color & 0xFF) / 255

    const newR = Math.min(1, r * factor)
    const newG = Math.min(1, g * factor)
    const newB = Math.min(1, b * factor)

    return (Math.floor(newR * 255) << 16) | (Math.floor(newG * 255) << 8) | Math.floor(newB * 255)
  }

  update(deltaTime) {
    // Sync sprite position
    if (this.sprite) {
      this.sprite.position.copy(this.position)
    }
  }
}
