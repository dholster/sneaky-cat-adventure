/**
 * Human - Patrolling enemy with vision detection
 */

import { Entity } from './Entity.js'
import { Config } from '../utils/Config.js'

export class Human extends Entity {
  constructor(scene, patrolPath = []) {
    super(scene)

    // Movement
    this.walkSpeed = 2
    this.runSpeed = 4

    // Vision
    this.visionRange = Config.DETECTION.VISION_RANGE
    this.visionAngle = Config.DETECTION.VISION_ANGLE

    // Detection
    this.detectionLevel = 0 // 0 to 1
    this.detectionState = 'unaware' // unaware, suspicious, alert, search
    this.detectionSpeed = Config.DETECTION.DETECTION_SPEED

    // Patrol
    this.patrolPath = patrolPath
    this.currentWaypoint = 0
    this.waitTimer = 0
    this.waypointWaitTime = 2 // seconds to wait at each waypoint

    // Investigation
    this.investigatePosition = null
    this.investigateTimer = 0

    // Chase
    this.chaseTarget = null
    this.lastKnownPosition = null

    // Set collider
    this.collider.size.x = 1
    this.collider.size.y = 2

    this.size = { width: 1, height: 2 }
  }

  update(deltaTime) {
    if (!this.active) return

    // Update based on detection state
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

    // Apply movement
    this.position.x += this.velocity.x * deltaTime

    // Decay detection level when not seeing player
    if (this.detectionState === 'unaware' || this.detectionState === 'suspicious') {
      this.detectionLevel = Math.max(0, this.detectionLevel - deltaTime * 0.3)
    }

    super.update(deltaTime)
  }

  updatePatrol(deltaTime) {
    if (!this.patrolPath || this.patrolPath.length === 0) {
      this.velocity.x = 0
      return
    }

    const target = this.patrolPath[this.currentWaypoint]
    const distance = Math.abs(target.x - this.position.x)

    if (distance < 0.5) {
      // Reached waypoint
      this.velocity.x = 0
      this.currentWaypoint = (this.currentWaypoint + 1) % this.patrolPath.length
      this.waitTimer = this.waypointWaitTime

      // Update facing direction for next waypoint (but not if detecting player)
      if (this.detectionLevel <= 0) {
        const nextTarget = this.patrolPath[this.currentWaypoint]
        this.facing = nextTarget.x > this.position.x ? 1 : -1
      }
    } else if (this.waitTimer <= 0) {
      // Move toward waypoint
      const direction = target.x > this.position.x ? 1 : -1
      this.velocity.x = direction * this.walkSpeed
      this.facing = direction
    } else {
      // Waiting at waypoint
      this.waitTimer -= deltaTime
      this.velocity.x = 0
    }
  }

  updateInvestigate(deltaTime) {
    if (!this.investigatePosition) {
      this.detectionState = 'unaware'
      return
    }

    const distance = Math.abs(this.investigatePosition.x - this.position.x)

    if (distance < 1) {
      // Reached investigation point - start searching
      this.velocity.x = 0
      this.investigateTimer = 3 // Look around for 3 seconds
      this.detectionState = 'search'
    } else {
      // Move toward sound source
      const direction = this.investigatePosition.x > this.position.x ? 1 : -1
      this.velocity.x = direction * this.walkSpeed * 1.5
      this.facing = direction
    }
  }

  updateChase(deltaTime) {
    if (!this.chaseTarget) {
      this.detectionState = 'search'
      return
    }

    // Chase toward target
    const direction = this.chaseTarget.position.x > this.position.x ? 1 : -1
    this.velocity.x = direction * this.runSpeed
    this.facing = direction

    // If target is hiding, lose sight
    if (this.chaseTarget.isHiding) {
      this.detectionState = 'search'
      this.lastKnownPosition = this.chaseTarget.position.clone()
      this.chaseTarget = null
    }
  }

  updateSearch(deltaTime) {
    this.investigateTimer -= deltaTime

    if (this.investigateTimer <= 0) {
      // Give up search, return to patrol
      this.detectionState = 'unaware'
      this.detectionLevel = 0
      this.investigatePosition = null
      this.chaseTarget = null
      console.log('🕵️ Human gave up search, returning to patrol')
    } else {
      // Look around (alternate facing direction)
      this.velocity.x = 0
      if (Math.floor(this.investigateTimer * 2) % 2 === 0) {
        this.facing = 1
      } else {
        this.facing = -1
      }
    }
  }

  // Called by detection system when player is spotted
  onPlayerSpotted(player, detectionAmount) {
    this.detectionLevel = Math.min(1, this.detectionLevel + detectionAmount)

    if (this.detectionLevel >= Config.DETECTION.DETECTION_THRESHOLD) {
      if (this.detectionState !== 'alert') {
        // Just became alert - trigger detection event
        this.detectionState = 'alert'
        this.chaseTarget = player
        console.log('🚨 Human fully detected player! ALERT!')

        // Return true to signal full detection
        return true
      }
    } else if (this.detectionLevel > 0.3) {
      this.detectionState = 'suspicious'
    }

    return false
  }

  // Called when hearing a sound
  onSoundHeard(position) {
    if (this.detectionState === 'unaware') {
      this.detectionState = 'suspicious'
      this.investigatePosition = position.clone()
      console.log('👂 Human heard a sound, investigating...')
    }
  }
}
