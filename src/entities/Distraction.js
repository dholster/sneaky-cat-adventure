/**
 * Distraction - Interactive object that creates noise to distract enemies
 * Examples: vases, picture frames, books, etc.
 */

import { Entity } from './Entity.js'
import { TextureGenerator } from '../rendering/TextureGenerator.js'

export class Distraction extends Entity {
  constructor(scene, x, y, type = 'vase') {
    super(scene)

    this.position.set(x, y, 0)
    this.type = type // 'vase', 'book', 'frame', 'plant'

    // Interaction
    this.interactionRange = 2.0
    this.hasBeenKnocked = false

    // Physics (for falling)
    this.gravity = -20
    this.isFalling = false
    this.groundY = -10 // Will be set when knocked over
    this.hasHitGround = false
    this.breakPieces = [] // For shatter effect

    // Sound properties
    this.soundRadius = 8 // How far the noise travels
    this.soundDuration = 3.0 // How long enemies investigate

    // Visual
    this.setupVisual(type)

    // Static until knocked over
    this.isStatic = true
  }

  setupVisual(type) {
    let texture
    switch (type) {
      case 'vase':
        this.size = { width: 1.5, height: 2.0 }
        texture = TextureGenerator.createVaseSprite()
        this.createSprite(texture, this.size.width, this.size.height)
        break
      case 'book':
        this.size = { width: 1.5, height: 1.0 }
        texture = TextureGenerator.createBookSprite()
        this.createSprite(texture, this.size.width, this.size.height)
        break
      case 'frame':
        this.size = { width: 2.0, height: 2.5 }
        texture = TextureGenerator.createFrameSprite()
        this.createSprite(texture, this.size.width, this.size.height)
        break
      case 'plant':
        this.size = { width: 1.5, height: 2.5 }
        texture = TextureGenerator.createPlantSprite()
        this.createSprite(texture, this.size.width, this.size.height)
        break
      default:
        this.size = { width: 1.5, height: 2.0 }
        texture = TextureGenerator.createVaseSprite()
        this.createSprite(texture, this.size.width, this.size.height)
    }

    if (this.sprite) {
      this.sprite.position.copy(this.position)
      this.sprite.position.z = 2.5
      console.log(`   → ${type} distraction sprite at x=${this.sprite.position.x}, y=${this.sprite.position.y}`)
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
