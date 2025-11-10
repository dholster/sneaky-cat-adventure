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
        // Cardboard box
        this.size = { width: 1.5, height: 1.5 }
        this.createColorSprite(0x8B7355, this.size.width, this.size.height)
        break
      case 'furniture':
        // Under furniture
        this.size = { width: 2, height: 1 }
        this.createColorSprite(0x4a4a4a, this.size.width, this.size.height)
        break
      case 'curtain':
        // Behind curtain
        this.size = { width: 1, height: 3 }
        this.createColorSprite(0x6b4c7a, this.size.width, this.size.height)
        break
      case 'shadow':
        // Dark shadow area
        this.size = { width: 3, height: 2 }
        this.createColorSprite(0x1a1a2e, this.size.width, this.size.height)
        break
      default:
        this.size = { width: 1.5, height: 1.5 }
        this.createColorSprite(0x8B7355, this.size.width, this.size.height)
    }

    // Make sprite semi-transparent
    if (this.sprite) {
      this.sprite.material.opacity = 0.6
      this.sprite.material.transparent = true
    }
  }

  update(deltaTime) {
    // Static hiding spots don't need updates
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
