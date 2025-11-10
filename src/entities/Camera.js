/**
 * Camera - Stationary security camera that rotates and detects in a cone
 * Cannot be distracted, perfect mechanical detection
 */

import { Entity } from './Entity.js'
import { Config } from '../utils/Config.js'

export class Camera extends Entity {
  constructor(scene, x, y, rotationSpeed = 1.0, rotationRange = Math.PI / 2) {
    super(scene)

    this.position.set(x, y, 0)

    // Camera properties
    this.rotationSpeed = rotationSpeed // radians per second
    this.rotationRange = rotationRange // total sweep range
    this.rotationDirection = 1 // 1 or -1
    this.currentRotation = -rotationRange / 2 // Start at left edge

    // Detection state
    this.detectionState = 'scanning' // scanning or alert
    this.detectionLevel = 0
    this.detectedTarget = null

    // Vision (longer range, narrower cone than humans)
    this.visionRange = 12
    this.visionAngle = Math.PI / 6 // 30 degrees (narrow)

    // Cameras don't move
    this.isStatic = true

    // Size
    this.size = { width: 1, height: 1 }
    this.collider.size.x = 1
    this.collider.size.y = 1
  }

  update(deltaTime) {
    if (!this.active) return

    // Rotate back and forth
    this.currentRotation += this.rotationDirection * this.rotationSpeed * deltaTime

    // Reverse direction at edges
    if (this.currentRotation >= this.rotationRange / 2) {
      this.currentRotation = this.rotationRange / 2
      this.rotationDirection = -1
    } else if (this.currentRotation <= -this.rotationRange / 2) {
      this.currentRotation = -this.rotationRange / 2
      this.rotationDirection = 1
    }

    // Decay detection level when not actively detecting
    if (this.detectionLevel > 0 && !this.detectedTarget) {
      this.detectionLevel -= deltaTime * 0.5
      if (this.detectionLevel < 0) this.detectionLevel = 0
    }

    super.update(deltaTime)
  }

  onPlayerSpotted(player, detectionAmount) {
    // Cameras detect FASTER than humans (mechanical precision)
    this.detectionLevel = Math.min(1, this.detectionLevel + detectionAmount * 1.5)
    this.detectedTarget = player

    if (this.detectionLevel >= Config.DETECTION.DETECTION_THRESHOLD) {
      if (this.detectionState !== 'alert') {
        this.detectionState = 'alert'
        console.log('📹 Camera detected player! ALARM!')
        return true // Signal full detection
      }
    }

    return false
  }

  onSoundHeard(soundPosition, soundIntensity) {
    // Cameras don't detect sound - they're visual only
  }

  getVisionDirection() {
    // Return current rotation as a normalized vector
    return {
      x: Math.cos(this.currentRotation),
      y: Math.sin(this.currentRotation)
    }
  }

  getVisionAngle() {
    // Return current rotation angle (for vision cone rendering)
    return this.currentRotation
  }
}
