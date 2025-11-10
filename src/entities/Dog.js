/**
 * Dog - Fast enemy that detects by sound more easily
 * Patrols smaller areas but moves faster than humans
 */

import { Entity } from './Entity.js'
import { Config } from '../utils/Config.js'

export class Dog extends Entity {
  constructor(scene, patrolPath = []) {
    super(scene)

    // AI behavior
    this.patrolPath = patrolPath
    this.currentWaypoint = 0
    this.waitTimer = 0
    this.waitDuration = 1.0 // Shorter wait than humans

    // Movement (faster than humans)
    this.walkSpeed = 4.0
    this.runSpeed = 8.0

    // Detection state
    this.detectionState = 'unaware' // unaware, suspicious, alert, search
    this.detectionLevel = 0
    this.alertCooldown = 0
    this.investigatePosition = null
    this.chaseTarget = null

    // Vision (shorter range but wider angle)
    this.visionRange = 8
    this.visionAngle = Math.PI / 1.5 // 120 degrees (wider than human)
    this.soundDetectionRange = 10 // More sensitive to sound!

    // Collider
    this.collider.size.x = 1.2
    this.collider.size.y = 0.8

    this.size = { width: 1.2, height: 0.8 }
  }

  update(deltaTime) {
    if (!this.active) return

    // Update AI behavior based on state
    switch (this.detectionState) {
      case 'unaware':
        this.updatePatrol(deltaTime)
        break
      case 'suspicious':
        this.updateInvestigate(deltaTime)
        break
      case 'alert':
        this.updateChase(deltaTime)
        break
      case 'search':
        this.updateSearch(deltaTime)
        break
    }

    // Apply velocity
    this.position.x += this.velocity.x * deltaTime
    this.position.y += this.velocity.y * deltaTime

    // Update facing direction
    if (this.velocity.x > 0.1) {
      this.facing = 1
    } else if (this.velocity.x < -0.1) {
      this.facing = -1
    }

    // Decay detection level when not actively detecting
    if (this.detectionLevel > 0 && this.detectionState === 'unaware') {
      this.detectionLevel -= deltaTime * 0.3
      if (this.detectionLevel < 0) this.detectionLevel = 0
    }

    super.update(deltaTime)
  }

  updatePatrol(deltaTime) {
    if (this.patrolPath.length === 0) {
      this.velocity.x = 0
      return
    }

    const target = this.patrolPath[this.currentWaypoint]
    const dx = target.x - this.position.x

    if (Math.abs(dx) < 0.5) {
      // Reached waypoint - wait
      this.velocity.x = 0
      this.waitTimer += deltaTime

      if (this.waitTimer >= this.waitDuration) {
        this.waitTimer = 0
        this.currentWaypoint = (this.currentWaypoint + 1) % this.patrolPath.length
      }
    } else {
      // Move toward waypoint
      this.velocity.x = Math.sign(dx) * this.walkSpeed
    }
  }

  updateInvestigate(deltaTime) {
    if (!this.investigatePosition) {
      this.detectionState = 'unaware'
      return
    }

    const dx = this.investigatePosition.x - this.position.x

    if (Math.abs(dx) < 1) {
      // Reached investigation point
      this.velocity.x = 0
      this.waitTimer += deltaTime

      if (this.waitTimer >= 3.0) {
        // Give up investigation
        console.log('🐕 Dog finished investigating')
        this.detectionState = 'unaware'
        this.investigatePosition = null
        this.waitTimer = 0
        this.detectionLevel = 0
      }
    } else {
      // Move toward investigation point
      this.velocity.x = Math.sign(dx) * this.runSpeed * 0.7
    }
  }

  updateChase(deltaTime) {
    if (!this.chaseTarget) {
      this.detectionState = 'search'
      return
    }

    const dx = this.chaseTarget.position.x - this.position.x

    // Dogs chase fast!
    this.velocity.x = Math.sign(dx) * this.runSpeed
  }

  updateSearch(deltaTime) {
    // Simple search behavior - return to patrol
    this.waitTimer += deltaTime

    if (this.waitTimer >= 5.0) {
      console.log('🐕 Dog giving up search')
      this.detectionState = 'unaware'
      this.waitTimer = 0
      this.detectionLevel = 0
      this.chaseTarget = null
    }
  }

  onPlayerSpotted(player, detectionAmount) {
    this.detectionLevel = Math.min(1, this.detectionLevel + detectionAmount)

    if (this.detectionLevel >= Config.DETECTION.DETECTION_THRESHOLD) {
      if (this.detectionState !== 'alert') {
        this.detectionState = 'alert'
        this.chaseTarget = player
        console.log('🐕 Dog fully detected player! WOOF!')
        return true // Signal full detection
      }
    } else if (this.detectionLevel > 0.3 && this.detectionState === 'unaware') {
      // Become suspicious
      this.detectionState = 'suspicious'
      this.investigatePosition = { x: player.position.x, y: player.position.y }
      this.waitTimer = 0
      console.log('🐕 Dog heard something...')
    }

    return false
  }

  onSoundHeard(soundPosition, soundIntensity) {
    // Dogs are VERY sensitive to sound
    const distance = Math.abs(this.position.x - soundPosition.x)

    if (distance < this.soundDetectionRange) {
      console.log('🐕 Dog heard noise!')
      this.detectionState = 'suspicious'
      this.investigatePosition = { x: soundPosition.x, y: soundPosition.y }
      this.waitTimer = 0
    }
  }

  getVisionDirection() {
    return this.facing
  }
}
