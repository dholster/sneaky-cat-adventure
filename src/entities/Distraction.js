/**
 * Distraction - Interactive object that creates noise to distract enemies
 * Examples: vases, picture frames, books, etc.
 */

import { Entity } from './Entity.js'

export class Distraction extends Entity {
  constructor(scene, x, y, type = 'vase') {
    super(scene)

    this.position.set(x, y, 0)
    this.type = type // 'vase', 'book', 'frame', 'plant'

    // Interaction
    this.interactionRange = 2.0
    this.hasBeenKnocked = false

    // Sound properties
    this.soundRadius = 8 // How far the noise travels
    this.soundDuration = 3.0 // How long enemies investigate

    // Visual
    this.setupVisual(type)

    // Static until knocked over
    this.isStatic = true
  }

  setupVisual(type) {
    switch (type) {
      case 'vase':
        this.size = { width: 1.5, height: 2.0 }
        this.createColorSprite(0xFF1493, this.size.width, this.size.height) // BRIGHT PINK vase
        break
      case 'book':
        this.size = { width: 1.5, height: 1.0 }
        this.createColorSprite(0xFF4500, this.size.width, this.size.height) // BRIGHT ORANGE book
        break
      case 'frame':
        this.size = { width: 2.0, height: 2.5 }
        this.createColorSprite(0xFFD700, this.size.width, this.size.height) // BRIGHT GOLD frame
        break
      case 'plant':
        this.size = { width: 1.5, height: 2.5 }
        this.createColorSprite(0x00FF00, this.size.width, this.size.height) // BRIGHT GREEN plant
        break
      default:
        this.size = { width: 1.5, height: 2.0 }
        this.createColorSprite(0xFF1493, this.size.width, this.size.height)
    }

    if (this.sprite) {
      this.sprite.position.copy(this.position) // Sync position again
      this.sprite.position.z = 2.5 // In front of everything!
      this.sprite.material.transparent = false
      console.log(`   → Distraction sprite at x=${this.sprite.position.x}, y=${this.sprite.position.y}`)
    }
  }

  update(deltaTime) {
    // Sync sprite position with entity position
    if (this.sprite && !this.hasBeenKnocked) {
      this.sprite.position.copy(this.position)
    }

    // Knocked over objects fall and fade
    if (this.hasBeenKnocked && this.sprite) {
      // Rotate and fall
      this.sprite.rotation.z += deltaTime * 3
      this.sprite.material.opacity -= deltaTime * 0.5

      if (this.sprite.material.opacity <= 0) {
        this.destroy()
      }
    }
  }

  canInteract(player) {
    if (this.hasBeenKnocked) return false
    const distance = this.position.distanceTo(player.position)
    return distance < this.interactionRange
  }

  knockOver(player) {
    if (this.hasBeenKnocked) return null

    console.log(`💥 Knocked over ${this.type}! Creating noise...`)
    this.hasBeenKnocked = true

    if (this.sprite) {
      this.sprite.material.transparent = true
    }

    // Return sound event data for game to process
    return {
      position: { x: this.position.x, y: this.position.y },
      radius: this.soundRadius,
      duration: this.soundDuration
    }
  }

  getInteractPrompt() {
    return `Press E to knock over ${this.type}`
  }
}
