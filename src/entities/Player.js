/**
 * Player - The cat character controlled by the player
 */

import { Entity } from './Entity.js'
import { Config } from '../utils/Config.js'
import { AlertMarkers } from '../rendering/AlertMarkers.js'

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
    this.wasInAir = false // Track if player was in air last frame (for landing animation)
    this.landingTimer = 0 // Timer for landing animation

    // Sound detection radius (changes based on movement)
    this.soundRadius = 0

    // Detection state
    this.detectionLevel = 0 // 0-1, how close to being detected
    this.enemyNearby = false // Is an enemy actively searching nearby

    // Alert markers (exclamation marks above head)
    this.alertMarkers = new AlertMarkers(scene)
    this.alertMarkers.create()

    // Particle system reference (injected from Game)
    this.particleSystem = null
    this.dustTrailTimer = 0 // Timer for dust trail particles

    // Set collider size
    this.collider.size.x = Config.PLAYER.SIZE.width
    this.collider.size.y = Config.PLAYER.SIZE.height
  }

  /**
   * Set the particle system reference (called from Game)
   */
  setParticleSystem(particleSystem) {
    this.particleSystem = particleSystem
  }

  update(deltaTime) {
    if (!this.active) return

    // If hiding, don't process movement (Game.js will handle exit)
    if (this.isHiding) {
      // Stay in hiding, just update sprite
      super.update(deltaTime)
      return
    }

    // Update landing timer
    if (this.landingTimer > 0) {
      this.landingTimer -= deltaTime
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

    // Jump - only allow when grounded and not already jumping
    if (this.input.jump && this.isGrounded && this.velocity.y <= 0.1) {
      this.velocity.y = this.jumpForce
      this.isGrounded = false
      this.wasInAir = true
      console.log('🐱 Jump! From position:', this.position.y.toFixed(2))
    }

    // Apply gravity (only if physics system isn't handling it)
    // Note: This will be moved to PhysicsSystem later
    if (!this.isGrounded) {
      this.velocity.y += this.gravity * deltaTime
    }

    // Detect landing (was in air, now grounded)
    if (this.wasInAir && this.isGrounded && this.velocity.y >= 0) {
      this.landingTimer = 0.2 // Landing animation duration
      this.wasInAir = false
      console.log('🐱 Landed!')

      // Create landing particle burst
      if (this.particleSystem) {
        this.particleSystem.createBurst(this.position.x, this.position.y - this.size.height / 2, 8, 0xcccccc, 2)
      }
    }

    // Track if we're in the air
    if (!this.isGrounded) {
      this.wasInAir = true
    }

    // Update animation state
    this.updateAnimation()

    // Apply velocity to position
    this.position.x += this.velocity.x * deltaTime
    this.position.y += this.velocity.y * deltaTime

    // Create dust trail when running on ground
    if (this.particleSystem && this.isGrounded) {
      const isRunning = Math.abs(this.velocity.x) > this.walkSpeed + 1
      if (isRunning) {
        this.dustTrailTimer -= deltaTime
        if (this.dustTrailTimer <= 0) {
          this.particleSystem.createDustTrail(
            this.position.x,
            this.position.y - this.size.height / 2,
            this.facing
          )
          this.dustTrailTimer = 0.1 // Create dust every 0.1 seconds
        }
      }
    }

    // Reset grounded state (will be set by collision detection)
    if (this.velocity.y < -0.1) {
      this.isGrounded = false
    }

    // Call parent update to sync sprite
    super.update(deltaTime)

    // Update alert markers based on player state
    const isMoving = this.velocity.x !== 0
    const isRunning = Math.abs(this.velocity.x) > this.walkSpeed + 1

    // Calculate alert level
    const alertLevel = this.alertMarkers.setFromState(
      isMoving,
      isRunning,
      this.enemyNearby,
      this.detectionLevel
    )

    // Update marker positions and visibility
    this.alertMarkers.update(
      alertLevel,
      this.position,
      this.size.height,
      deltaTime
    )
  }

  updateAnimation() {
    // Determine current animation based on state
    // Landing animation takes priority
    if (this.landingTimer > 0) {
      this.setAnimation('land')
    } else if (!this.isGrounded) {
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

  hide() {
    this.isHiding = true
    this.setAnimation('hide_peek')
    this.soundRadius = 0
    this.velocity.x = 0

    // Make sprite greyscale when hiding
    if (this.animatedSprite) {
      this.animatedSprite.setColor(0x808080) // Grey color for greyscale effect
    }

    console.log('Hiding!')
  }

  exitHiding() {
    this.isHiding = false
    this.setAnimation('idle')

    // Restore normal color when exiting hiding
    if (this.animatedSprite) {
      this.animatedSprite.setColor(0xFFFFFF) // White color = normal
    }

    console.log('Exiting hiding')
  }

  onDetected() {
    this.isDetected = true
    console.log('DETECTED! Lost a life')
    // This will be handled by Game manager later
  }

  /**
   * Clean up player resources
   */
  destroy() {
    // Clean up alert markers
    if (this.alertMarkers) {
      this.alertMarkers.destroy()
      this.alertMarkers = null
    }

    // Call parent cleanup
    super.destroy()
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
