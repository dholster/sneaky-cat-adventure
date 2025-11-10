/**
 * HidingSpot - Interactive object where player can hide from enemies
 */

import { Entity } from './Entity.js'
import { TextureGenerator } from '../rendering/TextureGenerator.js'

export class HidingSpot extends Entity {
  constructor(scene, x, y, type = 'box') {
    super(scene)

    this.position.set(x, y, 0)
    this.type = type // 'box', 'furniture', 'curtain', 'shadow'

    // Interaction
    this.interactionRange = 1.5
    this.isOccupied = false
    this.occupant = null

    // Visual
    this.setupVisual(type)

    // Static object
    this.isStatic = true
  }

  setupVisual(type) {
    switch (type) {
      case 'box':
        // Cardboard box - SUPER BRIGHT ORANGE (highly visible)
        this.size = { width: 3, height: 3 }
        this.createColorSprite(0xFF8800, this.size.width, this.size.height)
        break
      case 'furniture':
        // Under furniture - Bright gray
        this.size = { width: 2.5, height: 1.5 }
        this.createColorSprite(0xAAAAAA, this.size.width, this.size.height)
        break
      case 'curtain':
        // Behind curtain - Bright Purple
        this.size = { width: 1.5, height: 3 }
        this.createColorSprite(0xCC66FF, this.size.width, this.size.height)
        break
      case 'shadow':
        // Dark shadow area - BRIGHT CYAN (contrasts with blue background)
        this.size = { width: 4, height: 3 }
        this.createColorSprite(0x00FFFF, this.size.width, this.size.height)
        break
      default:
        this.size = { width: 3, height: 3 }
        this.createColorSprite(0xFF8800, this.size.width, this.size.height)
    }

    // Make sure sprite is visible and in front - set AFTER createColorSprite
    if (this.sprite) {
      this.sprite.position.copy(this.position) // Sync position again
      this.sprite.position.z = 2.0 // Even higher z to be in front of everything
      this.sprite.material.opacity = 1.0 // Fully opaque
      this.sprite.material.transparent = false
      console.log(`   → Sprite created at x=${this.sprite.position.x}, y=${this.sprite.position.y}, z=${this.sprite.position.z}`)
    }
  }

  update(deltaTime) {
    // Sync sprite position even though we're static
    if (this.sprite) {
      this.sprite.position.copy(this.position)
    }
  }

  canInteract(player) {
    const distance = this.position.distanceTo(player.position)
    return distance < this.interactionRange && !this.isOccupied
  }

  enter(player) {
    if (this.isOccupied) return false

    this.isOccupied = true
    this.occupant = player
    player.hide()
    console.log(`😸 Player hiding in ${this.type}`)
    return true
  }

  exit(player) {
    if (this.occupant !== player) return false

    this.isOccupied = false
    this.occupant = null
    player.exitHiding()
    console.log('😼 Player left hiding spot')
    return true
  }

  getInteractPrompt() {
    return `Press E to hide in ${this.type}`
  }
}
