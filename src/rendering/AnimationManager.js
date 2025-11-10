/**
 * AnimationManager - Handles sprite sheet animations
 * Supports frame-based animations with configurable timing
 */

export class AnimationManager {
  constructor() {
    this.animations = new Map()
    this.currentAnimation = null
    this.currentFrame = 0
    this.frameTime = 0
    this.loop = true
    this.playing = true
  }

  /**
   * Add an animation definition
   * @param {string} name - Animation name (e.g., 'idle', 'walk')
   * @param {Array} frames - Array of frame indices [0, 1, 2, 3]
   * @param {number} frameRate - Frames per second (default 10)
   * @param {boolean} loop - Should animation loop? (default true)
   */
  addAnimation(name, frames, frameRate = 10, loop = true) {
    this.animations.set(name, {
      frames,
      frameRate,
      frameDuration: 1 / frameRate,
      loop
    })
  }

  /**
   * Play an animation
   * @param {string} name - Animation name
   * @param {boolean} restart - Force restart if already playing
   */
  play(name, restart = false) {
    if (!this.animations.has(name)) {
      console.warn(`Animation '${name}' not found`)
      return
    }

    // If already playing this animation and not forcing restart, do nothing
    if (this.currentAnimation === name && !restart) {
      return
    }

    const animation = this.animations.get(name)
    this.currentAnimation = name
    this.currentFrame = 0
    this.frameTime = 0
    this.loop = animation.loop
    this.playing = true
  }

  /**
   * Update animation (call every frame)
   * @param {number} deltaTime - Time since last frame
   * @returns {number} Current frame index in the animation
   */
  update(deltaTime) {
    if (!this.playing || !this.currentAnimation) {
      return 0
    }

    const animation = this.animations.get(this.currentAnimation)
    if (!animation) return 0

    this.frameTime += deltaTime

    // Check if we should advance to next frame
    if (this.frameTime >= animation.frameDuration) {
      this.frameTime -= animation.frameDuration
      this.currentFrame++

      // Handle loop or stop at end
      if (this.currentFrame >= animation.frames.length) {
        if (this.loop) {
          this.currentFrame = 0
        } else {
          this.currentFrame = animation.frames.length - 1
          this.playing = false
        }
      }
    }

    return animation.frames[this.currentFrame]
  }

  /**
   * Get the current frame index in the sprite sheet
   */
  getCurrentFrameIndex() {
    if (!this.currentAnimation) return 0
    const animation = this.animations.get(this.currentAnimation)
    if (!animation) return 0
    return animation.frames[this.currentFrame]
  }

  /**
   * Check if current animation is finished (for non-looping animations)
   */
  isFinished() {
    if (!this.currentAnimation || this.loop) return false
    const animation = this.animations.get(this.currentAnimation)
    return this.currentFrame >= animation.frames.length - 1
  }

  /**
   * Stop the current animation
   */
  stop() {
    this.playing = false
  }

  /**
   * Resume the current animation
   */
  resume() {
    this.playing = true
  }

  /**
   * Reset to first frame of current animation
   */
  reset() {
    this.currentFrame = 0
    this.frameTime = 0
  }

  /**
   * Get current animation name
   */
  getCurrentAnimation() {
    return this.currentAnimation
  }
}
