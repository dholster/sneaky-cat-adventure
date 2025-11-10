/**
 * PhysicsSystem - Handles gravity, jumping, and physics
 * Note: Collision detection will be added in Phase 2
 */

import { Config } from '../utils/Config.js'

export class PhysicsSystem {
  constructor() {
    this.entities = []
    this.gravity = Config.PLAYER.GRAVITY
  }

  registerEntity(entity) {
    this.entities.push(entity)
  }

  unregisterEntity(entity) {
    const index = this.entities.indexOf(entity)
    if (index > -1) {
      this.entities.splice(index, 1)
    }
  }

  update(deltaTime) {
    this.entities.forEach(entity => {
      if (!entity.active) return

      // Apply gravity if not grounded
      if (!entity.isGrounded) {
        entity.velocity.y += this.gravity * deltaTime
      }

      // Apply velocity to position
      entity.position.x += entity.velocity.x * deltaTime
      entity.position.y += entity.velocity.y * deltaTime

      // Temporary simple ground collision (y = 0)
      // This will be replaced with proper tilemap collision later
      if (entity.position.y <= 0) {
        entity.position.y = 0
        entity.velocity.y = 0
        entity.isGrounded = true
      } else if (entity.position.y > 0) {
        entity.isGrounded = false
      }
    })
  }
}
