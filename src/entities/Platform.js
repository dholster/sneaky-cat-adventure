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

    // Create visual representation with brighter color
    this.createColorSprite(color, width, height)

    // Make platforms more visible
    if (this.sprite) {
      this.sprite.position.z = 0.5 // Behind entities but visible
      // Brighten the color by 50%
      const c = this.sprite.material.color
      c.r = Math.min(1, c.r * 1.5)
      c.g = Math.min(1, c.g * 1.5)
      c.b = Math.min(1, c.b * 1.5)
    }

    // Platforms don't move
    this.isStatic = true
  }

  update(deltaTime) {
    // Static platforms don't update
  }
}
