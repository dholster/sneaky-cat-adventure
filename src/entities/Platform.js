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

    // Create visual representation
    this.createColorSprite(color, width, height)

    // Platforms don't move
    this.isStatic = true
  }

  update(deltaTime) {
    // Static platforms don't update
  }
}
