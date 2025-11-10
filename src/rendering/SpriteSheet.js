/**
 * SpriteSheet - Handles sprite sheet textures and UV coordinate mapping
 * Works with AnimationManager to display the correct frame
 */

import * as THREE from 'three'

export class SpriteSheet {
  constructor(texture, frameWidth, frameHeight, columns, rows) {
    this.texture = texture
    this.frameWidth = frameWidth
    this.frameHeight = frameHeight
    this.columns = columns
    this.rows = rows

    // Calculate UV coordinates for each frame
    this.frames = []
    this.generateFrameUVs()
  }

  /**
   * Generate UV coordinates for each frame in the sprite sheet
   */
  generateFrameUVs() {
    const frameWidthUV = 1 / this.columns
    const frameHeightUV = 1 / this.rows

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const u = col * frameWidthUV
        const v = row * frameHeightUV // No flip needed with flipY = false

        this.frames.push({
          u: u,
          v: v,
          uSize: frameWidthUV,
          vSize: frameHeightUV
        })
      }
    }
  }

  /**
   * Get UV coordinates for a specific frame
   * @param {number} frameIndex - Frame number (0-based)
   */
  getFrameUV(frameIndex) {
    if (frameIndex < 0 || frameIndex >= this.frames.length) {
      console.warn(`Frame index ${frameIndex} out of bounds`)
      return this.frames[0]
    }
    return this.frames[frameIndex]
  }

  /**
   * Get total number of frames
   */
  getFrameCount() {
    return this.frames.length
  }

  /**
   * Create a material using this sprite sheet
   */
  createMaterial() {
    return new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide
    })
  }
}
