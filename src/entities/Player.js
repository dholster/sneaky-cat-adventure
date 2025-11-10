/**
 * Player - The cat character controlled by the player
 */

import { Entity } from './Entity.js'
import { Config } from '../utils/Config.js'

export class Player extends Entity {
  constructor(scene, inputManager) {
    super(scene)

    this.input = inputManager

    // Movement stats (from Config)
    this.walkSpeed = Config.PLAYER.WALK_SPEED
    this.runSpeed = Config.PLAYER.RUN_SPEED
    this.crouchSpeed = Config.PLAYER.CROUCH_SPEED
    this.jumpForce = Config.PLAYER.JUMP_FORCE
    this.gravity = Config.PLAYER.GRAVITY

    // State
    this.isCrouching = false
    this.isHiding = false
    this.isDetected = false

    // Sound detection radius (changes based on movement)
    this.soundRadius = 0

    // Set collider size
    this.collider.size.x = Config.PLAYER.SIZE.width
    this.collider.size.y = Config.PLAYER.SIZE.height
  }

  update(deltaTime) {
    if (!this.active) return

    // Don't process input if hiding
    if (this.isHiding) {
      this.updateHiding()
      super.update(deltaTime)
      return
    }

    // Horizontal movement
    let speed = this.walkSpeed

    // Check movement modifiers
    if (this.input.run && !this.input.crouch) {
      speed = this.runSpeed
      this.soundRadius = Config.DETECTION.SOUND_RADIUS_RUN
      this.isCrouching = false
    } else if (this.input.crouch) {
      this.isCrouching = true
      speed = this.crouchSpeed
      this.soundRadius = 0
    } else {
      this.isCrouching = false
      this.soundRadius = Config.DETECTION.SOUND_RADIUS_WALK
    }

    // Apply horizontal input
    if (this.input.left) {
      this.velocity.x = -speed
      this.facing = -1
    } else if (this.input.right) {
      this.velocity.x = speed
      this.facing = 1
    } else {
      this.velocity.x = 0
    }

    // Jump
    if (this.input.jump && this.isGrounded) {
      this.velocity.y = this.jumpForce
      this.isGrounded = false
      console.log('Jump!')
    }

    // Apply gravity (only if physics system isn't handling it)
    // Note: This will be moved to PhysicsSystem later
    if (!this.isGrounded) {
      this.velocity.y += this.gravity * deltaTime
    }

    // Update animation state
    this.updateAnimation()

    // Apply velocity to position
    this.position.x += this.velocity.x * deltaTime
    this.position.y += this.velocity.y * deltaTime

    // Temporary ground collision (y = 0)
    if (this.position.y <= 0) {
      this.position.y = 0
      this.velocity.y = 0
      this.isGrounded = true
    }

    // Call parent update to sync sprite
    super.update(deltaTime)
  }

  updateAnimation() {
    // Determine current animation based on state
    if (!this.isGrounded) {
      this.setAnimation('jump')
    } else if (this.velocity.x !== 0) {
      if (this.isCrouching) {
        this.setAnimation('crouch')
      } else if (Math.abs(this.velocity.x) > this.walkSpeed + 1) {
        this.setAnimation('run')
      } else {
        this.setAnimation('walk')
      }
    } else {
      if (this.isCrouching) {
        this.setAnimation('crouch')
      } else {
        this.setAnimation('idle')
      }
    }
  }

  updateHiding() {
    // Check if player wants to exit hiding
    if (this.input.down) {
      this.exitHiding()
    }
  }

  hide() {
    this.isHiding = true
    this.setAnimation('hide_peek')
    this.soundRadius = 0
    this.velocity.x = 0
    console.log('Hiding!')
  }

  exitHiding() {
    this.isHiding = false
    this.setAnimation('idle')
    console.log('Exiting hiding')
  }

  onDetected() {
    this.isDetected = true
    console.log('DETECTED! Lost a life')
    // This will be handled by Game manager later
  }

  // Debug: Log current state
  getDebugInfo() {
    return {
      position: `(${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)})`,
      velocity: `(${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)})`,
      grounded: this.isGrounded,
      animation: this.currentAnimation,
      facing: this.facing === 1 ? 'right' : 'left'
    }
  }
}
