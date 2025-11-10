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
        this.size = { width: 0.8, height: 1.2 }
        this.createColorSprite(0xFF6B9D, this.size.width, this.size.height) // Pink vase
        break
      case 'book':
        this.size = { width: 1.0, height: 0.6 }
        this.createColorSprite(0x8B4513, this.size.width, this.size.height) // Brown book
        break
      case 'frame':
        this.size = { width: 1.2, height: 1.5 }
        this.createColorSprite(0xFFD700, this.size.width, this.size.height) // Gold frame
        break
      case 'plant':
        this.size = { width: 1.0, height: 1.5 }
        this.createColorSprite(0x228B22, this.size.width, this.size.height) // Green plant
        break
      default:
        this.size = { width: 0.8, height: 1.2 }
        this.createColorSprite(0xFF6B9D, this.size.width, this.size.height)
    }

    if (this.sprite) {
      this.sprite.position.z = 1.0
    }
  }

  update(deltaTime) {
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
