/**
 * HidingSpot - Interactive object where player can hide from enemies
 */

import { Entity } from './Entity.js'

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
        // Cardboard box - BRIGHT and VISIBLE
        this.size = { width: 2, height: 2 }
        this.createColorSprite(0xCC8844, this.size.width, this.size.height)
        break
      case 'furniture':
        // Under furniture - Dark gray
        this.size = { width: 2.5, height: 1.5 }
        this.createColorSprite(0x666666, this.size.width, this.size.height)
        break
      case 'curtain':
        // Behind curtain - Purple
        this.size = { width: 1.5, height: 3 }
        this.createColorSprite(0x9966CC, this.size.width, this.size.height)
        break
      case 'shadow':
        // Dark shadow area - Darker but still visible
        this.size = { width: 3, height: 2 }
        this.createColorSprite(0x3a3a5e, this.size.width, this.size.height)
        break
      default:
        this.size = { width: 2, height: 2 }
        this.createColorSprite(0xCC8844, this.size.width, this.size.height)
    }

    // Make sure sprite is visible and in front
    if (this.sprite) {
      this.sprite.position.z = 1.5 // Higher z than ground and entities
      this.sprite.material.opacity = 0.9
      this.sprite.material.transparent = true
    }
  }

  update(deltaTime) {
    // Static hiding spots don't need updates
  }

  canInteract(player) {
    const distance = this.position.distanceTo(player.position)
    const canInteract = distance < this.interactionRange && !this.isOccupied

    // Debug logging
    if (distance < this.interactionRange + 1) {
      console.log(`Near hiding spot: distance=${distance.toFixed(2)}, can interact=${canInteract}`)
    }

    return canInteract
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
