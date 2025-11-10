/**
 * Distraction - Interactive object that creates noise to distract enemies
 * Examples: vases, picture frames, books, etc.
 */

import * as THREE from 'three'
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
    // Sync sprite position with entity position when not knocked over
    if (this.sprite && !this.hasBeenKnocked) {
      this.sprite.position.copy(this.position)
    }

    // Apply physics when falling
    if (this.hasBeenKnocked && this.isFalling && !this.hasHitGround) {
      // Apply gravity
      this.velocity.y += this.gravity * deltaTime

      // Update position
      this.position.y += this.velocity.y * deltaTime
      this.position.x += this.velocity.x * deltaTime

      // Rotate while falling
      if (this.sprite) {
        this.sprite.position.copy(this.position)
        this.sprite.rotation.z += deltaTime * 5
      }

      // Check if hit ground
      if (this.position.y <= this.groundY) {
        this.position.y = this.groundY
        this.hasHitGround = true
        this.isFalling = false
        this.createBreakEffect()
        console.log(`💥 ${this.type} hit the ground and broke!`)
      }
    }

    // Update break pieces
    if (this.hasHitGround && this.breakPieces.length > 0) {
      for (let i = this.breakPieces.length - 1; i >= 0; i--) {
        const piece = this.breakPieces[i]

        // Apply gravity to pieces
        piece.velocityY += this.gravity * deltaTime * 0.5
        piece.mesh.position.y += piece.velocityY * deltaTime
        piece.mesh.position.x += piece.velocityX * deltaTime

        // Bounce off ground
        if (piece.mesh.position.y < this.groundY) {
          piece.mesh.position.y = this.groundY
          piece.velocityY = Math.abs(piece.velocityY) * 0.3 // Bounce with energy loss
        }

        // Rotate pieces
        piece.mesh.rotation.z += deltaTime * piece.rotationSpeed

        // Fade out
        piece.mesh.material.opacity -= deltaTime * 1.5

        // Remove if fully faded
        if (piece.mesh.material.opacity <= 0) {
          this.scene.remove(piece.mesh)
          piece.mesh.geometry.dispose()
          piece.mesh.material.dispose()
          this.breakPieces.splice(i, 1)
        }
      }

      // Destroy self when all pieces are gone
      if (this.breakPieces.length === 0) {
        this.destroy()
      }
    }
  }

  createBreakEffect() {
    if (!this.sprite) return

    // Hide original sprite
    this.sprite.visible = false

    // Create 6-8 break pieces (more dramatic)
    const numPieces = 6 + Math.floor(Math.random() * 3)

    for (let i = 0; i < numPieces; i++) {
      // Create smaller piece with varied sizes
      const pieceSize = this.size.width / 4 + Math.random() * 0.5
      const geometry = new THREE.PlaneGeometry(pieceSize, pieceSize)

      // Use same texture as original
      const material = new THREE.MeshBasicMaterial({
        map: this.sprite.material.map,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide
      })

      const piece = new THREE.Mesh(geometry, material)

      // Position near break point with some randomness
      piece.position.set(
        this.position.x + (Math.random() - 0.5) * 1.5,
        this.position.y + (Math.random() - 0.5) * 0.8,
        this.sprite.position.z
      )

      // Random rotation
      piece.rotation.z = Math.random() * Math.PI * 2

      this.scene.add(piece)

      // Store piece data with more dramatic velocities
      this.breakPieces.push({
        mesh: piece,
        velocityX: (Math.random() - 0.5) * 6, // Faster scatter sideways
        velocityY: Math.random() * 3 + 2, // Higher bounce up
        rotationSpeed: (Math.random() - 0.5) * 15 // Faster rotation
      })
    }

    console.log(`💥 ${this.type} shattered into ${numPieces} pieces!`)
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
    this.isFalling = true

    // Set ground level (main floor platform top is at y = 0.5)
    this.groundY = 0.5

    // Give it some initial velocity (kicked away from player)
    const directionX = this.position.x - player.position.x
    const normalized = Math.sign(directionX) || 1
    this.velocity.x = normalized * 3 // Kicked sideways
    this.velocity.y = -1 // Start falling immediately

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

  destroy() {
    // Clean up break pieces
    if (this.breakPieces.length > 0) {
      for (const piece of this.breakPieces) {
        this.scene.remove(piece.mesh)
        piece.mesh.geometry.dispose()
        piece.mesh.material.dispose()
      }
      this.breakPieces = []
    }

    // Call parent destroy
    super.destroy()
  }
}
