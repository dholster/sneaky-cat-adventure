/**
 * TextureGenerator - Creates simple pixel art textures programmatically
 * Used as placeholders until real sprite sheets are loaded
 */

import * as THREE from 'three'

export class TextureGenerator {
  /**
   * Create a recognizable cat sprite sheet
   * 6 columns x 2 rows = 12 frames
   * Row 1: idle (2 frames), walk (4 frames)
   * Row 2: run (4 frames), crouch (2 frames)
   */
  static createCatSpriteSheet() {
    const frameSize = 32
    const columns = 6
    const rows = 2
    const canvas = document.createElement('canvas')
    canvas.width = frameSize * columns
    canvas.height = frameSize * rows
    const ctx = canvas.getContext('2d')

    // Clear canvas
    ctx.fillStyle = 'transparent'
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Colors
    const catOrange = '#FF8844'
    const catDark = '#CC5522'
    const catLight = '#FFAA77'
    const white = '#FFFFFF'
    const black = '#222222'
    const pink = '#FFB6C1'

    // Helper to draw a cat frame with more detail
    const drawCatFrame = (col, row, offsetX = 0, offsetY = 0, earAngle = 0, tailCurve = 0, legPos = 0) => {
      const x = col * frameSize
      const y = row * frameSize
      const centerX = x + frameSize / 2 + offsetX
      const centerY = y + frameSize / 2 + offsetY

      // Tail (behind body) - curved and fluffy
      ctx.strokeStyle = catOrange
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(centerX - 8, centerY + 2)
      ctx.quadraticCurveTo(
        centerX - 14, centerY - 4 + tailCurve,
        centerX - 10, centerY - 10 + tailCurve
      )
      ctx.stroke()

      // Body (oval, more compact and cat-like)
      ctx.fillStyle = catOrange
      ctx.beginPath()
      ctx.ellipse(centerX - 2, centerY + 2, 8, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Back legs
      ctx.fillStyle = catDark
      ctx.fillRect(centerX - 8, centerY + 6 + legPos, 3, 5)
      ctx.fillRect(centerX - 4, centerY + 6 - legPos, 3, 5)

      // Paws (back)
      ctx.fillStyle = catLight
      ctx.fillRect(centerX - 8, centerY + 10 + legPos, 3, 2)
      ctx.fillRect(centerX - 4, centerY + 10 - legPos, 3, 2)

      // Head (more cat-like with pointed face)
      ctx.fillStyle = catOrange
      ctx.beginPath()
      ctx.ellipse(centerX + 6, centerY - 2, 6, 5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Snout/muzzle (white)
      ctx.fillStyle = white
      ctx.beginPath()
      ctx.ellipse(centerX + 8, centerY + 1, 3, 2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Ears (triangular, more prominent)
      ctx.fillStyle = catOrange
      ctx.beginPath()
      ctx.moveTo(centerX + 2 + earAngle, centerY - 6)
      ctx.lineTo(centerX + 4 + earAngle, centerY - 11)
      ctx.lineTo(centerX + 6 + earAngle, centerY - 6)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(centerX + 7 - earAngle, centerY - 6)
      ctx.lineTo(centerX + 9 - earAngle, centerY - 11)
      ctx.lineTo(centerX + 11 - earAngle, centerY - 6)
      ctx.fill()

      // Inner ears (pink)
      ctx.fillStyle = pink
      ctx.beginPath()
      ctx.moveTo(centerX + 3 + earAngle, centerY - 7)
      ctx.lineTo(centerX + 4 + earAngle, centerY - 9)
      ctx.lineTo(centerX + 5 + earAngle, centerY - 7)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(centerX + 8 - earAngle, centerY - 7)
      ctx.lineTo(centerX + 9 - earAngle, centerY - 9)
      ctx.lineTo(centerX + 10 - earAngle, centerY - 7)
      ctx.fill()

      // Eyes (cat-like slits)
      ctx.fillStyle = black
      ctx.fillRect(centerX + 4, centerY - 3, 2, 3)
      ctx.fillRect(centerX + 8, centerY - 3, 2, 3)

      // Eye shine
      ctx.fillStyle = white
      ctx.fillRect(centerX + 4, centerY - 3, 1, 1)
      ctx.fillRect(centerX + 8, centerY - 3, 1, 1)

      // Nose (small triangle)
      ctx.fillStyle = pink
      ctx.beginPath()
      ctx.moveTo(centerX + 8, centerY)
      ctx.lineTo(centerX + 7, centerY + 1)
      ctx.lineTo(centerX + 9, centerY + 1)
      ctx.fill()

      // Whiskers (thin lines)
      ctx.strokeStyle = black
      ctx.lineWidth = 1
      // Left whiskers
      ctx.beginPath()
      ctx.moveTo(centerX + 5, centerY)
      ctx.lineTo(centerX + 1, centerY - 1)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX + 5, centerY + 1)
      ctx.lineTo(centerX + 1, centerY + 2)
      ctx.stroke()
      // Right whiskers
      ctx.beginPath()
      ctx.moveTo(centerX + 11, centerY)
      ctx.lineTo(centerX + 15, centerY - 1)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX + 11, centerY + 1)
      ctx.lineTo(centerX + 15, centerY + 2)
      ctx.stroke()

      // Front legs
      ctx.fillStyle = catOrange
      ctx.fillRect(centerX + 2, centerY + 6 - legPos, 2, 5)
      ctx.fillRect(centerX + 5, centerY + 6 + legPos, 2, 5)

      // Paws (front)
      ctx.fillStyle = catLight
      ctx.fillRect(centerX + 2, centerY + 10 - legPos, 2, 2)
      ctx.fillRect(centerX + 5, centerY + 10 + legPos, 2, 2)
    }

    // Row 0: Idle and Walk animations
    // Idle (frames 0-1) - subtle breathing and tail movement
    drawCatFrame(0, 0, 0, 0, 0, 0, 0) // neutral
    drawCatFrame(1, 0, 0, -1, 0, 2, 0) // slight bob, tail up

    // Walk (frames 2-5) - alternating legs
    drawCatFrame(2, 0, 0, 0, 0, 0, 1)  // left legs forward
    drawCatFrame(3, 0, 0, -1, 0, 1, 0) // middle position
    drawCatFrame(4, 0, 0, 0, 0, 0, -1) // right legs forward
    drawCatFrame(5, 0, 0, -1, 0, 1, 0) // middle position

    // Row 1: Run and Crouch animations
    // Run (frames 6-9) - stretched out, ears back
    drawCatFrame(0, 1, 0, 0, -2, -2, 2)  // stretched, ears back
    drawCatFrame(1, 1, 1, -1, -2, -1, -2) // compressed
    drawCatFrame(2, 1, 2, 0, -2, -2, 2)  // stretched opposite
    drawCatFrame(3, 1, 1, -1, -2, -1, -2) // compressed

    // Crouch (frames 10-11) - lower to ground, sneaky
    drawCatFrame(4, 1, 0, 3, 1, 3, 0) // crouched low
    drawCatFrame(5, 1, 0, 4, 1, 4, 0) // even lower

    // Create texture
    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter // Pixel-perfect scaling
    texture.minFilter = THREE.NearestFilter
    texture.needsUpdate = true

    console.log('🎨 Created cat sprite sheet:', columns, 'x', rows, 'frames')

    return { texture, frameSize, columns, rows }
  }

  /**
   * Create a recognizable human guard sprite sheet
   * 4 columns x 2 rows = 8 frames
   */
  static createGuardSpriteSheet() {
    const frameSize = 32
    const columns = 4
    const rows = 2
    const canvas = document.createElement('canvas')
    canvas.width = frameSize * columns
    canvas.height = frameSize * rows
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Colors
    const uniformBlue = '#3a4a7a'
    const uniformDark = '#2a3a5a'
    const skinTone = '#FFD0A0'
    const hairBrown = '#4a3020'
    const black = '#222222'
    const white = '#FFFFFF'
    const bootBlack = '#1a1a1a'

    const drawGuardFrame = (col, row, legOffset = 0, armSwing = 0) => {
      const x = col * frameSize
      const y = row * frameSize
      const centerX = x + frameSize / 2
      const centerY = y + frameSize / 2

      // Back arm
      ctx.fillStyle = uniformBlue
      ctx.fillRect(centerX - 8 - armSwing, centerY + 2, 3, 8)
      ctx.fillStyle = skinTone
      ctx.fillRect(centerX - 8 - armSwing, centerY + 10, 3, 3)

      // Legs with boots
      ctx.fillStyle = uniformDark
      // Left leg
      ctx.fillRect(centerX - 4 + legOffset, centerY + 10, 3, 6)
      // Right leg
      ctx.fillRect(centerX + 1 - legOffset, centerY + 10, 3, 6)

      // Boots
      ctx.fillStyle = bootBlack
      ctx.fillRect(centerX - 4 + legOffset, centerY + 15, 4, 3)
      ctx.fillRect(centerX + 1 - legOffset, centerY + 15, 4, 3)

      // Body/torso (uniform)
      ctx.fillStyle = uniformBlue
      ctx.fillRect(centerX - 6, centerY - 2, 12, 12)

      // Belt
      ctx.fillStyle = uniformDark
      ctx.fillRect(centerX - 6, centerY + 8, 12, 2)

      // Badge/button
      ctx.fillStyle = '#FFD700' // gold
      ctx.fillRect(centerX - 1, centerY + 2, 2, 2)

      // Neck
      ctx.fillStyle = skinTone
      ctx.fillRect(centerX - 2, centerY - 4, 4, 3)

      // Head
      ctx.beginPath()
      ctx.ellipse(centerX, centerY - 8, 5, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Hair
      ctx.fillStyle = hairBrown
      ctx.fillRect(centerX - 5, centerY - 13, 10, 5)

      // Ears
      ctx.fillStyle = skinTone
      ctx.fillRect(centerX - 6, centerY - 8, 2, 3)
      ctx.fillRect(centerX + 4, centerY - 8, 2, 3)

      // Eyes
      ctx.fillStyle = black
      ctx.fillRect(centerX - 3, centerY - 9, 2, 2)
      ctx.fillRect(centerX + 1, centerY - 9, 2, 2)

      // Eye whites
      ctx.fillStyle = white
      ctx.fillRect(centerX - 3, centerY - 9, 1, 1)
      ctx.fillRect(centerX + 1, centerY - 9, 1, 1)

      // Nose
      ctx.fillStyle = '#FFBB88'
      ctx.fillRect(centerX - 1, centerY - 6, 2, 3)

      // Mouth
      ctx.fillStyle = black
      ctx.fillRect(centerX - 2, centerY - 4, 4, 1)

      // Front arm
      ctx.fillStyle = uniformBlue
      ctx.fillRect(centerX + 5 + armSwing, centerY + 2, 3, 8)
      ctx.fillStyle = skinTone
      ctx.fillRect(centerX + 5 + armSwing, centerY + 10, 3, 3)
    }

    // Patrol animations with walking motion
    for (let i = 0; i < 8; i++) {
      const col = i % columns
      const row = Math.floor(i / columns)
      const phase = (i % 4) / 4 * Math.PI * 2
      const legOffset = Math.sin(phase) * 2
      const armSwing = Math.sin(phase) * 1.5
      drawGuardFrame(col, row, legOffset, armSwing)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.needsUpdate = true

    console.log('🎨 Created guard sprite sheet')

    return { texture, frameSize, columns, rows }
  }

  /**
   * Create a simple dog sprite sheet (placeholder)
   */
  static createDogSpriteSheet() {
    const frameSize = 32
    const columns = 4
    const rows = 1
    const canvas = document.createElement('canvas')
    canvas.width = frameSize * columns
    canvas.height = frameSize * rows
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const dogBrown = '#8B4513'
    const dogDark = '#654321'
    const black = '#000000'

    const drawDogFrame = (col, tailWag = 0) => {
      const x = col * frameSize
      const y = 0
      const centerX = x + frameSize / 2
      const centerY = y + frameSize / 2

      // Body (elongated)
      ctx.fillStyle = dogBrown
      ctx.fillRect(centerX - 12, centerY, 20, 8)

      // Head
      ctx.fillRect(centerX + 8, centerY - 2, 8, 6)

      // Ears
      ctx.fillStyle = dogDark
      ctx.fillRect(centerX + 9, centerY - 5, 2, 3)
      ctx.fillRect(centerX + 13, centerY - 5, 2, 3)

      // Nose
      ctx.fillStyle = black
      ctx.fillRect(centerX + 14, centerY, 2, 2)

      // Tail
      ctx.fillStyle = dogBrown
      ctx.fillRect(centerX - 12, centerY - 2 + tailWag, 2, 6)

      // Legs
      ctx.fillRect(centerX - 8, centerY + 8, 2, 4)
      ctx.fillRect(centerX - 4, centerY + 8, 2, 4)
      ctx.fillRect(centerX + 0, centerY + 8, 2, 4)
      ctx.fillRect(centerX + 4, centerY + 8, 2, 4)
    }

    // Walk cycle
    drawDogFrame(0, 0)
    drawDogFrame(1, 2)
    drawDogFrame(2, 0)
    drawDogFrame(3, -2)

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.needsUpdate = true

    console.log('🎨 Created dog sprite sheet')

    return { texture, frameSize, columns, rows }
  }
}
