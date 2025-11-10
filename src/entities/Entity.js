/**
 * Entity - Base class for all game objects (player, enemies, props)
 */

import * as THREE from 'three'

export class Entity {
  constructor(scene) {
    this.scene = scene
    this.sprite = null
    this.position = new THREE.Vector3(0, 0, 0)
    this.velocity = new THREE.Vector3(0, 0, 0)
    this.size = { width: 1, height: 1 }

    // Animation state
    this.currentAnimation = null
    this.animationFrame = 0
    this.animationTime = 0

    // Collision
    this.collider = {
      offset: new THREE.Vector2(0, 0),
      size: new THREE.Vector2(1, 1)
    }

    // State
    this.isGrounded = false
    this.facing = 1 // 1 = right, -1 = left
    this.active = true
  }

  /**
   * Create a sprite plane for this entity
   */
  createSprite(texture, width, height) {
    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide
    })

    this.sprite = new THREE.Mesh(geometry, material)
    this.sprite.position.z = 1 // Layer for rendering order
    this.scene.add(this.sprite)

    return this.sprite
  }

  /**
   * Create a simple colored sprite (for prototyping)
   */
  createColorSprite(color, width, height) {
    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: false
    })

    this.sprite = new THREE.Mesh(geometry, material)
    this.sprite.position.copy(this.position) // Sync immediately!
    this.sprite.position.z = 1
    this.scene.add(this.sprite)

    return this.sprite
  }

  /**
   * Update entity (override in subclasses)
   */
  update(deltaTime) {
    if (!this.active) return

    // Update sprite position to match entity position
    if (this.sprite) {
      this.sprite.position.copy(this.position)

      // Flip sprite based on facing direction
      this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.facing
    }
  }

  /**
   * Set animation (will be used with animation system later)
   */
  setAnimation(animName) {
    if (this.currentAnimation !== animName) {
      this.currentAnimation = animName
      this.animationFrame = 0
      this.animationTime = 0
    }
  }

  /**
   * Get axis-aligned bounding box for collision
   */
  getBounds() {
    return {
      x: this.position.x + this.collider.offset.x - this.collider.size.x / 2,
      y: this.position.y + this.collider.offset.y - this.collider.size.y / 2,
      width: this.collider.size.x,
      height: this.collider.size.y
    }
  }

  /**
   * Clean up
   */
  destroy() {
    if (this.sprite) {
      this.scene.remove(this.sprite)
      this.sprite.geometry.dispose()
      this.sprite.material.dispose()
    }
    this.active = false
  }
}
