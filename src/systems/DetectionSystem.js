/**
 * DetectionSystem - Handles vision cone detection and raycasting
 */

import * as THREE from 'three'
import { Config } from '../utils/Config.js'

export class DetectionSystem {
  constructor(scene, player) {
    this.scene = scene
    this.player = player
    this.enemies = []
    this.obstacles = [] // Walls/platforms that block vision

    // Raycaster for line-of-sight checks
    this.raycaster = new THREE.Raycaster()
  }

  registerEnemy(enemy) {
    this.enemies.push(enemy)
  }

  unregisterEnemy(enemy) {
    const index = this.enemies.indexOf(enemy)
    if (index > -1) {
      this.enemies.splice(index, 1)
    }
  }

  registerObstacle(obstacle) {
    // Obstacles block vision (platforms, walls, furniture)
    this.obstacles.push(obstacle)
  }

  update(deltaTime) {
    this.enemies.forEach(enemy => {
      if (!enemy.active) return

      switch (enemy.detectionState) {
        case 'alert':
          // Already spotted, continue chase
          break
        case 'suspicious':
        case 'unaware':
        default:
          // Check if player is in vision cone
          this.checkVisionDetection(enemy, deltaTime)
          // Check if player is making sound
          this.checkSoundDetection(enemy)
          break
      }
    })
  }

  checkVisionDetection(enemy, deltaTime) {
    // Calculate vector from enemy to player
    const toPlayer = new THREE.Vector2(
      this.player.position.x - enemy.position.x,
      this.player.position.y - enemy.position.y
    )
    const distance = toPlayer.length()

    // Check if player is within range
    if (distance > enemy.visionRange) {
      return
    }

    // Calculate angle to player
    const angleToPlayer = Math.atan2(toPlayer.y, toPlayer.x)

    // Enemy's facing angle (right = 0, left = PI)
    const enemyAngle = enemy.facing === 1 ? 0 : Math.PI

    // Calculate angle difference
    let angleDiff = angleToPlayer - enemyAngle

    // Normalize angle to -PI to PI
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI

    // Check if player is within vision cone
    const inCone = Math.abs(angleDiff) < enemy.visionAngle / 2

    if (!inCone) {
      // Player not in cone, decrease detection
      return
    }

    // Player is in cone - check line of sight
    const hasLineOfSight = this.checkLineOfSight(enemy, this.player)

    if (!hasLineOfSight) {
      // Vision blocked by obstacle
      return
    }

    // Player is visible! Calculate detection amount
    let detectionSpeed = enemy.detectionSpeed || Config.DETECTION.DETECTION_SPEED

    // Modify by player state
    if (this.player.isHiding) {
      // Can't see hidden player
      return
    } else if (this.player.isCrouching) {
      detectionSpeed *= 0.5 // Slower to detect crouching cat
    }

    // Modify by distance (further = slower detection)
    const distanceFactor = 1 - (distance / enemy.visionRange)
    detectionSpeed *= distanceFactor

    // TODO: Modify by lighting (implement later)
    // const lightLevel = this.getLightLevel(this.player.position)
    // detectionSpeed *= lightLevel

    // Apply detection
    const detectionAmount = detectionSpeed * deltaTime
    enemy.onPlayerSpotted(this.player, detectionAmount)
  }

  checkLineOfSight(enemy, player) {
    // Create ray from enemy to player
    const origin = new THREE.Vector3(enemy.position.x, enemy.position.y, 1)
    const target = new THREE.Vector3(player.position.x, player.position.y, 1)
    const direction = target.clone().sub(origin).normalize()
    const distance = origin.distanceTo(target)

    this.raycaster.set(origin, direction)
    this.raycaster.far = distance

    // Check for intersections with obstacles
    const intersectObjects = this.obstacles
      .filter(obs => obs.sprite) // Only check objects with sprites
      .map(obs => obs.sprite)

    const intersects = this.raycaster.intersectObjects(intersectObjects, false)

    // If any obstacle is between enemy and player, vision is blocked
    const blocked = intersects.some(hit => {
      return hit.distance < distance - 0.5 // Small buffer
    })

    return !blocked
  }

  checkSoundDetection(enemy) {
    // Check if player is making sound (running)
    if (this.player.soundRadius <= 0) return

    const distance = this.player.position.distanceTo(enemy.position)

    if (distance < this.player.soundRadius) {
      enemy.onSoundHeard(this.player.position)
    }
  }

  // Called when player is fully detected
  onPlayerDetected(enemy) {
    console.log('🚨 PLAYER DETECTED! Game Over')
    // Game manager will handle life loss and respawn
  }
}
