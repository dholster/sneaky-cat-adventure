/**
 * TextureGenerator - Creates simple pixel art textures programmatically
 * Used as placeholders until real sprite sheets are loaded
 */

import * as THREE from 'three'

export class TextureGenerator {
  /**
   * Create a simple cat sprite sheet (placeholder)
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
    const catDark = '#CC6622'
    const catLight = '#FFAA66'
    const white = '#FFFFFF'
    const black = '#000000'

    // Helper to draw a frame
    const drawCatFrame = (col, row, offsetX = 0, offsetY = 0, earLeft = 0, earRight = 0) => {
      const x = col * frameSize
      const y = row * frameSize
      const centerX = x + frameSize / 2 + offsetX
      const centerY = y + frameSize / 2 + offsetY

      // Body (rounded square)
      ctx.fillStyle = catOrange
      ctx.fillRect(centerX - 10, centerY - 6, 20, 12)

      // Head (circle)
      ctx.beginPath()
      ctx.arc(centerX + 10, centerY - 2, 8, 0, Math.PI * 2)
      ctx.fill()

      // Ears
      ctx.fillStyle = catDark
      // Left ear
      ctx.beginPath()
      ctx.moveTo(centerX + 5 + earLeft, centerY - 8)
      ctx.lineTo(centerX + 8 + earLeft, centerY - 12)
      ctx.lineTo(centerX + 10 + earLeft, centerY - 8)
      ctx.fill()
      // Right ear
      ctx.beginPath()
      ctx.moveTo(centerX + 12 + earRight, centerY - 8)
      ctx.lineTo(centerX + 14 + earRight, centerY - 12)
      ctx.lineTo(centerX + 17 + earRight, centerY - 8)
      ctx.fill()

      // Eye
      ctx.fillStyle = black
      ctx.fillRect(centerX + 13, centerY - 3, 2, 2)

      // Tail
      ctx.strokeStyle = catOrange
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX - 10, centerY)
      ctx.quadraticCurveTo(centerX - 15, centerY - 8, centerX - 12, centerY - 12)
      ctx.stroke()

      // Legs (simple lines)
      ctx.strokeStyle = catDark
      ctx.lineWidth = 2
      // Front legs
      ctx.beginPath()
      ctx.moveTo(centerX + 5, centerY + 6)
      ctx.lineTo(centerX + 5, centerY + 10)
      ctx.stroke()
      // Back legs
      ctx.beginPath()
      ctx.moveTo(centerX - 5, centerY + 6)
      ctx.lineTo(centerX - 5, centerY + 10)
      ctx.stroke()
    }

    // Row 0: Idle and Walk animations
    // Idle (frames 0-1)
    drawCatFrame(0, 0, 0, 0, 0, 0)
    drawCatFrame(1, 0, 0, -1, 0, 0) // Slight bob

    // Walk (frames 2-5)
    drawCatFrame(2, 0, 0, 0, 0, 0)
    drawCatFrame(3, 0, 1, -1, 0, 0) // Step forward
    drawCatFrame(4, 0, 2, 0, 0, 0)
    drawCatFrame(5, 0, 1, -1, 0, 0) // Step forward

    // Row 1: Run and Crouch animations
    // Run (frames 6-9)
    drawCatFrame(0, 1, 0, 0, -1, 1) // Ears back
    drawCatFrame(1, 1, 2, -1, -1, 1) // Stretched
    drawCatFrame(2, 1, 4, 0, -1, 1)
    drawCatFrame(3, 1, 2, -1, -1, 1) // Stretched

    // Crouch (frames 10-11)
    drawCatFrame(4, 1, 0, 2, 1, -1) // Lower to ground
    drawCatFrame(5, 1, 0, 3, 1, -1) // Lower to ground

    // Create texture
    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter // Pixel-perfect scaling
    texture.minFilter = THREE.NearestFilter
    texture.needsUpdate = true

    console.log('🎨 Created cat sprite sheet:', columns, 'x', rows, 'frames')

    return { texture, frameSize, columns, rows }
  }

  /**
   * Create a simple guard sprite sheet (placeholder)
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
    const uniformGray = '#4a4a6a'
    const skinTone = '#FFD0A0'
    const black = '#000000'

    const drawGuardFrame = (col, row, legOffset = 0) => {
      const x = col * frameSize
      const y = row * frameSize
      const centerX = x + frameSize / 2
      const centerY = y + frameSize / 2

      // Body (rectangle - uniform)
      ctx.fillStyle = uniformGray
      ctx.fillRect(centerX - 8, centerY - 4, 16, 20)

      // Head (circle)
      ctx.fillStyle = skinTone
      ctx.beginPath()
      ctx.arc(centerX, centerY - 10, 6, 0, Math.PI * 2)
      ctx.fill()

      // Eyes
      ctx.fillStyle = black
      ctx.fillRect(centerX - 3, centerY - 11, 2, 1)
      ctx.fillRect(centerX + 1, centerY - 11, 2, 1)

      // Legs
      ctx.fillStyle = uniformGray
      ctx.fillRect(centerX - 6 + legOffset, centerY + 16, 4, 8)
      ctx.fillRect(centerX + 2 - legOffset, centerY + 16, 4, 8)
    }

    // Idle and patrol animations
    for (let i = 0; i < 8; i++) {
      const col = i % columns
      const row = Math.floor(i / columns)
      const legOffset = Math.sin(i * Math.PI / 2) * 2
      drawGuardFrame(col, row, legOffset)
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
