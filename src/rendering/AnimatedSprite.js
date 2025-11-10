/**
 * AnimatedSprite - A sprite that can play animations from a sprite sheet
 * Combines SpriteSheet, AnimationManager, and Three.js rendering
 */

import * as THREE from 'three'
import { AnimationManager } from './AnimationManager.js'

export class AnimatedSprite {
  constructor(scene, spriteSheet, width, height) {
    this.scene = scene
    this.spriteSheet = spriteSheet
    this.animationManager = new AnimationManager()

    // Create geometry and material
    this.geometry = new THREE.PlaneGeometry(width, height)
    this.material = spriteSheet.createMaterial()

    // Store original UVs
    this.originalUVs = this.geometry.attributes.uv.array.slice()

    // Create mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.z = 1
    this.scene.add(this.mesh)

    this.width = width
    this.height = height
  }

  /**
   * Add an animation
   */
  addAnimation(name, frames, frameRate = 10, loop = true) {
    this.animationManager.addAnimation(name, frames, frameRate, loop)
  }

  /**
   * Play an animation
   */
  play(name, restart = false) {
    this.animationManager.play(name, restart)
  }

  /**
   * Update sprite (updates animation and UVs)
   */
  update(deltaTime) {
    // Update animation
    const frameIndex = this.animationManager.update(deltaTime)

    // Update UVs to show current frame
    this.updateUVs(frameIndex)
  }

  /**
   * Update UV coordinates to display specific frame
   */
  updateUVs(frameIndex) {
    const frame = this.spriteSheet.getFrameUV(frameIndex)
    const uvAttribute = this.geometry.attributes.uv

    // Update UV coordinates
    // Bottom-left
    uvAttribute.setXY(0, frame.u, frame.v)
    // Bottom-right
    uvAttribute.setXY(1, frame.u + frame.uSize, frame.v)
    // Top-right
    uvAttribute.setXY(2, frame.u + frame.uSize, frame.v + frame.vSize)
    // Top-left
    uvAttribute.setXY(3, frame.u, frame.v + frame.vSize)

    uvAttribute.needsUpdate = true
  }

  /**
   * Set sprite position
   */
  setPosition(x, y, z = 1) {
    this.mesh.position.set(x, y, z)
  }

  /**
   * Set sprite scale (for flipping, etc)
   */
  setScale(x, y, z = 1) {
    this.mesh.scale.set(x, y, z)
  }

  /**
   * Flip sprite horizontally
   */
  flipX(flip) {
    this.mesh.scale.x = flip ? -Math.abs(this.mesh.scale.x) : Math.abs(this.mesh.scale.x)
  }

  /**
   * Get current animation name
   */
  getCurrentAnimation() {
    return this.animationManager.getCurrentAnimation()
  }

  /**
   * Destroy sprite
   */
  destroy() {
    this.scene.remove(this.mesh)
    this.geometry.dispose()
    this.material.dispose()
  }

  /**
   * Get the Three.js mesh
   */
  getMesh() {
    return this.mesh
  }
}
