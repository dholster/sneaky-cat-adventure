/**
 * InputManager - Handles keyboard and gamepad input
 */

export class InputManager {
  constructor() {
    this.keys = {}
    this.keysPressed = {} // For single-press detection
    this.keysReleased = {} // For release detection

    this.setupEventListeners()
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) {
        this.keysPressed[e.code] = true
      }
      this.keys[e.code] = true
    })

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false
      this.keysReleased[e.code] = true
    })
  }

  update() {
    // Clear pressed/released states each frame
    this.keysPressed = {}
    this.keysReleased = {}
  }

  isKeyDown(keyCode) {
    return this.keys[keyCode] === true
  }

  isKeyPressed(keyCode) {
    return this.keysPressed[keyCode] === true
  }

  isKeyReleased(keyCode) {
    return this.keysReleased[keyCode] === true
  }

  // Convenience methods for common keys
  get left() {
    return this.isKeyDown('ArrowLeft') || this.isKeyDown('KeyA')
  }

  get right() {
    return this.isKeyDown('ArrowRight') || this.isKeyDown('KeyD')
  }

  get up() {
    return this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW')
  }

  get down() {
    return this.isKeyDown('ArrowDown') || this.isKeyDown('KeyS')
  }

  get jump() {
    return this.isKeyPressed('Space')
  }

  get run() {
    return this.isKeyDown('ShiftLeft') || this.isKeyDown('ShiftRight')
  }

  get crouch() {
    return this.isKeyDown('ControlLeft') || this.isKeyDown('ControlRight')
  }

  get interact() {
    return this.isKeyPressed('KeyE')
  }
}
