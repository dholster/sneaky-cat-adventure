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
    texture.flipY = false // Don't flip canvas texture
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
    texture.flipY = false // Don't flip canvas texture
    texture.needsUpdate = true

    console.log('🎨 Created guard sprite sheet')

    return { texture, frameSize, columns, rows }
  }

  /**
   * Create a recognizable dog sprite sheet
   * 4 columns x 1 row = 4 frames
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

    const dogBrown = '#8B5A3C'
    const dogDark = '#654321'
    const dogLight = '#A67C52'
    const black = '#222222'
    const white = '#FFFFFF'
    const pink = '#FFB6C1'

    const drawDogFrame = (col, tailWag = 0, legPhase = 0) => {
      const x = col * frameSize
      const y = 0
      const centerX = x + frameSize / 2
      const centerY = y + frameSize / 2 + 2

      // Tail (behind body) - wagging
      ctx.strokeStyle = dogBrown
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(centerX - 10, centerY + 1)
      ctx.lineTo(centerX - 14, centerY - 3 + tailWag)
      ctx.stroke()

      // Body (elongated, dog-like)
      ctx.fillStyle = dogBrown
      ctx.beginPath()
      ctx.ellipse(centerX - 3, centerY + 1, 10, 5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Back legs
      ctx.fillStyle = dogDark
      ctx.fillRect(centerX - 9, centerY + 5 + Math.sin(legPhase) * 2, 2, 5)
      ctx.fillRect(centerX - 6, centerY + 5 - Math.sin(legPhase) * 2, 2, 5)

      // Paws (back)
      ctx.fillStyle = black
      ctx.fillRect(centerX - 9, centerY + 9 + Math.sin(legPhase) * 2, 2, 2)
      ctx.fillRect(centerX - 6, centerY + 9 - Math.sin(legPhase) * 2, 2, 2)

      // Chest/neck area
      ctx.fillStyle = dogLight
      ctx.beginPath()
      ctx.ellipse(centerX + 5, centerY, 4, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      // Head
      ctx.fillStyle = dogBrown
      ctx.beginPath()
      ctx.ellipse(centerX + 9, centerY - 1, 5, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      // Snout (elongated)
      ctx.fillStyle = dogLight
      ctx.fillRect(centerX + 11, centerY - 1, 4, 3)

      // Nose (black, prominent)
      ctx.fillStyle = black
      ctx.fillRect(centerX + 14, centerY - 1, 2, 2)

      // Ears (floppy)
      ctx.fillStyle = dogDark
      // Left ear
      ctx.beginPath()
      ctx.ellipse(centerX + 6, centerY - 3, 2, 4, -0.3, 0, Math.PI * 2)
      ctx.fill()
      // Right ear
      ctx.beginPath()
      ctx.ellipse(centerX + 11, centerY - 3, 2, 4, 0.3, 0, Math.PI * 2)
      ctx.fill()

      // Eye
      ctx.fillStyle = black
      ctx.fillRect(centerX + 9, centerY - 2, 2, 2)

      // Eye shine
      ctx.fillStyle = white
      ctx.fillRect(centerX + 9, centerY - 2, 1, 1)

      // Mouth line
      ctx.strokeStyle = black
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX + 14, centerY + 1)
      ctx.lineTo(centerX + 12, centerY + 2)
      ctx.stroke()

      // Front legs
      ctx.fillStyle = dogBrown
      ctx.fillRect(centerX + 2, centerY + 4 - Math.sin(legPhase) * 2, 2, 6)
      ctx.fillRect(centerX + 5, centerY + 4 + Math.sin(legPhase) * 2, 2, 6)

      // Paws (front)
      ctx.fillStyle = black
      ctx.fillRect(centerX + 2, centerY + 9 - Math.sin(legPhase) * 2, 2, 2)
      ctx.fillRect(centerX + 5, centerY + 9 + Math.sin(legPhase) * 2, 2, 2)

      // Collar (optional detail)
      ctx.fillStyle = '#FF4444'
      ctx.fillRect(centerX + 4, centerY - 1, 4, 2)

      // Collar tag
      ctx.fillStyle = '#FFD700'
      ctx.fillRect(centerX + 5, centerY + 1, 2, 2)
    }

    // Walk cycle with tail wagging and leg movement
    for (let i = 0; i < 4; i++) {
      const tailWag = Math.sin(i * Math.PI / 2) * 3
      const legPhase = (i / 4) * Math.PI * 2
      drawDogFrame(i, tailWag, legPhase)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false // Don't flip canvas texture
    texture.needsUpdate = true

    console.log('🎨 Created dog sprite sheet')

    return { texture, frameSize, columns, rows }
  }

  /**
   * Create sprite textures for hiding spots
   */
  static createBoxSprite() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const boxBrown = '#8B6F47'
    const boxLight = '#A68A5C'
    const boxDark = '#6B5537'
    const tape = '#D4AF37'

    // Cardboard box with tape
    // Bottom face
    ctx.fillStyle = boxDark
    ctx.fillRect(8, 45, 48, 15)

    // Left face
    ctx.fillStyle = boxBrown
    ctx.beginPath()
    ctx.moveTo(8, 45)
    ctx.lineTo(2, 40)
    ctx.lineTo(2, 10)
    ctx.lineTo(8, 15)
    ctx.fill()

    // Front face (lighter)
    ctx.fillStyle = boxLight
    ctx.fillRect(8, 15, 48, 30)

    // Top face
    ctx.fillStyle = boxBrown
    ctx.fillRect(8, 10, 48, 5)

    // Flaps (open box)
    ctx.fillStyle = boxLight
    ctx.beginPath()
    ctx.moveTo(8, 15)
    ctx.lineTo(6, 8)
    ctx.lineTo(20, 8)
    ctx.lineTo(18, 15)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(56, 15)
    ctx.lineTo(58, 8)
    ctx.lineTo(44, 8)
    ctx.lineTo(46, 15)
    ctx.fill()

    // Tape strips
    ctx.fillStyle = tape
    ctx.fillRect(28, 15, 8, 30)
    ctx.fillRect(8, 28, 48, 4)

    // Box lines/texture
    ctx.strokeStyle = boxDark
    ctx.lineWidth = 1
    // Vertical lines
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(16 + i * 12, 15)
      ctx.lineTo(16 + i * 12, 45)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.needsUpdate = true

    return texture
  }

  static createFurnitureSprite() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const woodBrown = '#654321'
    const woodLight = '#8B6F47'
    const woodDark = '#4a3419'
    const shadow = 'rgba(0, 0, 0, 0.5)'

    // Table/furniture (side view with space underneath)
    // Table top
    ctx.fillStyle = woodBrown
    ctx.fillRect(4, 18, 56, 6)

    // Table top edge (3D effect)
    ctx.fillStyle = woodLight
    ctx.fillRect(4, 18, 56, 2)

    // Wood grain
    ctx.strokeStyle = woodDark
    ctx.lineWidth = 1
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.moveTo(8 + i * 10, 20)
      ctx.lineTo(12 + i * 10, 24)
      ctx.stroke()
    }

    // Left leg
    ctx.fillStyle = woodBrown
    ctx.fillRect(8, 24, 6, 36)
    ctx.fillStyle = woodDark
    ctx.fillRect(8, 24, 2, 36)

    // Right leg
    ctx.fillStyle = woodBrown
    ctx.fillRect(50, 24, 6, 36)
    ctx.fillStyle = woodDark
    ctx.fillRect(50, 24, 2, 36)

    // Shadow underneath (hiding space)
    ctx.fillStyle = shadow
    ctx.fillRect(14, 32, 36, 24)

    // Hide here indicator (subtle)
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.setLineDash([4, 4])
    ctx.strokeRect(16, 34, 32, 20)
    ctx.setLineDash([])

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.needsUpdate = true

    return texture
  }

  static createCurtainSprite() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const curtainRed = '#8B0000'
    const curtainLight = '#CD5C5C'
    const curtainDark = '#5C0000'
    const rodBrown = '#654321'

    // Curtain rod
    ctx.fillStyle = rodBrown
    ctx.fillRect(4, 4, 56, 4)

    // Rod ends (decorative)
    ctx.beginPath()
    ctx.arc(4, 6, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(60, 6, 4, 0, Math.PI * 2)
    ctx.fill()

    // Curtain folds (multiple vertical strips)
    for (let i = 0; i < 6; i++) {
      const x = 6 + i * 9
      const offset = Math.sin(i * 0.5) * 2

      // Dark fold
      ctx.fillStyle = curtainDark
      ctx.beginPath()
      ctx.moveTo(x + offset, 8)
      ctx.lineTo(x + offset - 2, 60)
      ctx.lineTo(x + offset + 2, 60)
      ctx.lineTo(x + offset + 4, 8)
      ctx.fill()

      // Light fold
      ctx.fillStyle = curtainLight
      ctx.beginPath()
      ctx.moveTo(x + offset + 4, 8)
      ctx.lineTo(x + offset + 2, 60)
      ctx.lineTo(x + offset + 6, 60)
      ctx.lineTo(x + offset + 8, 8)
      ctx.fill()

      // Main curtain
      ctx.fillStyle = curtainRed
      ctx.beginPath()
      ctx.moveTo(x + offset + 8, 8)
      ctx.lineTo(x + offset + 6, 60)
      ctx.lineTo(x + offset + 10, 60)
      ctx.lineTo(x + offset + 12, 8)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.needsUpdate = true

    return texture
  }

  static createShadowSprite() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    // Dark shadow area with gradient effect
    const gradient = ctx.createRadialGradient(32, 32, 10, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.5)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    // Moonlight edge (to show it's a shadow)
    ctx.strokeStyle = 'rgba(200, 200, 255, 0.3)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 10)
    ctx.quadraticCurveTo(32, 20, 64, 10)
    ctx.stroke()

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.needsUpdate = true

    return texture
  }

  /**
   * Create sprite textures for distractions
   */
  static createVaseSprite() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const vasePink = '#FF69B4'
    const vaseDark = '#C71585'
    const vaseLight = '#FFB6C1'
    const white = '#FFFFFF'

    // Vase base
    ctx.fillStyle = vaseDark
    ctx.fillRect(20, 54, 24, 6)

    // Vase body (curved)
    ctx.fillStyle = vasePink
    ctx.beginPath()
    ctx.moveTo(22, 54)
    ctx.quadraticCurveTo(18, 40, 22, 26)
    ctx.lineTo(42, 26)
    ctx.quadraticCurveTo(46, 40, 42, 54)
    ctx.fill()

    // Vase neck
    ctx.fillRect(26, 18, 12, 8)

    // Vase rim
    ctx.fillStyle = vaseDark
    ctx.fillRect(24, 16, 16, 2)

    // Shine/highlight
    ctx.fillStyle = vaseLight
    ctx.beginPath()
    ctx.ellipse(28, 35, 4, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // Decorative pattern
    ctx.strokeStyle = white
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(32, 42, 6, 0, Math.PI * 2)
    ctx.stroke()

    // Flowers in vase (optional)
    ctx.fillStyle = '#FF6347'
    ctx.beginPath()
    ctx.arc(28, 12, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(36, 10, 3, 0, Math.PI * 2)
    ctx.fill()

    // Flower stems
    ctx.strokeStyle = '#228B22'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(28, 12)
    ctx.lineTo(28, 20)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(36, 10)
    ctx.lineTo(36, 20)
    ctx.stroke()

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.needsUpdate = true

    return texture
  }

  static createBookSprite() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const bookRed = '#8B0000'
    const bookBrown = '#654321'
    const bookBlue = '#191970'
    const paper = '#FFF8DC'
    const gold = '#FFD700'

    // Stack of 3 books
    // Bottom book (brown)
    ctx.fillStyle = bookBrown
    ctx.fillRect(12, 48, 40, 10)
    ctx.fillStyle = paper
    ctx.fillRect(52, 48, 2, 10)
    // Spine
    ctx.fillStyle = '#4a3419'
    ctx.fillRect(12, 48, 4, 10)
    // Title line
    ctx.fillStyle = gold
    ctx.fillRect(20, 52, 24, 2)

    // Middle book (blue)
    ctx.fillStyle = bookBlue
    ctx.fillRect(16, 38, 36, 10)
    ctx.fillStyle = paper
    ctx.fillRect(52, 38, 2, 10)
    ctx.fillStyle = '#0c0c38'
    ctx.fillRect(16, 38, 4, 10)
    ctx.fillStyle = gold
    ctx.fillRect(24, 42, 20, 2)

    // Top book (red)
    ctx.fillStyle = bookRed
    ctx.fillRect(20, 28, 32, 10)
    ctx.fillStyle = paper
    ctx.fillRect(52, 28, 2, 10)
    ctx.fillStyle = '#5C0000'
    ctx.fillRect(20, 28, 4, 10)
    ctx.fillStyle = gold
    ctx.fillRect(28, 32, 16, 2)

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.needsUpdate = true

    return texture
  }

  static createFrameSprite() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const frameGold = '#FFD700'
    const frameDark = '#B8860B'
    const picture = '#87CEEB'
    const pictureDark = '#4682B4'

    // Frame outer border (ornate gold)
    ctx.fillStyle = frameGold
    ctx.fillRect(8, 8, 48, 48)

    // Frame inner (darker)
    ctx.fillStyle = frameDark
    ctx.fillRect(10, 10, 44, 44)

    // Frame decorative corners
    ctx.fillStyle = frameGold
    ctx.beginPath()
    ctx.arc(12, 12, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(52, 12, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(12, 52, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(52, 52, 3, 0, Math.PI * 2)
    ctx.fill()

    // Picture inside (simple landscape)
    ctx.fillStyle = picture
    ctx.fillRect(14, 14, 36, 36)

    // Simple picture content (mountains)
    ctx.fillStyle = pictureDark
    ctx.beginPath()
    ctx.moveTo(14, 42)
    ctx.lineTo(26, 24)
    ctx.lineTo(38, 42)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(28, 42)
    ctx.lineTo(38, 28)
    ctx.lineTo(50, 42)
    ctx.fill()

    // Sun
    ctx.fillStyle = '#FFFF00'
    ctx.beginPath()
    ctx.arc(42, 20, 4, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.needsUpdate = true

    return texture
  }

  static createPlantSprite() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const potRed = '#8B4513'
    const potDark = '#654321'
    const leafGreen = '#228B22'
    const leafDark = '#006400'
    const soil = '#3d2817'

    // Pot
    ctx.fillStyle = potRed
    ctx.beginPath()
    ctx.moveTo(22, 54)
    ctx.quadraticCurveTo(20, 48, 22, 42)
    ctx.lineTo(42, 42)
    ctx.quadraticCurveTo(44, 48, 42, 54)
    ctx.fill()

    // Pot rim
    ctx.fillStyle = potDark
    ctx.fillRect(20, 40, 24, 2)

    // Soil
    ctx.fillStyle = soil
    ctx.fillRect(22, 40, 20, 4)

    // Plant stem
    ctx.strokeStyle = leafDark
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(32, 40)
    ctx.lineTo(32, 20)
    ctx.stroke()

    // Leaves (multiple)
    ctx.fillStyle = leafGreen
    // Left leaves
    ctx.beginPath()
    ctx.ellipse(24, 32, 6, 3, -0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(22, 26, 7, 4, -0.7, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(24, 20, 6, 3, -0.4, 0, Math.PI * 2)
    ctx.fill()

    // Right leaves
    ctx.beginPath()
    ctx.ellipse(40, 34, 6, 3, 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(42, 28, 7, 4, 0.7, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(40, 22, 6, 3, 0.4, 0, Math.PI * 2)
    ctx.fill()

    // Top leaves
    ctx.beginPath()
    ctx.ellipse(32, 16, 5, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // Leaf veins
    ctx.strokeStyle = leafDark
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(24, 32)
    ctx.lineTo(20, 32)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(40, 34)
    ctx.lineTo(44, 34)
    ctx.stroke()

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.needsUpdate = true

    return texture
  }

  /**
   * Create environment tile textures
   */
  static createWoodFloorTile() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const woodBrown = '#8B6F47'
    const woodDark = '#6B5537'
    const woodLight = '#A68A5C'

    // Draw wood planks (3 horizontal planks)
    const plankHeight = size / 3

    for (let i = 0; i < 3; i++) {
      const y = i * plankHeight

      // Base plank color (slight variation)
      const variation = Math.sin(i * 1.5) * 10
      ctx.fillStyle = i % 2 === 0 ? woodBrown : woodLight
      ctx.fillRect(0, y, size, plankHeight)

      // Wood grain lines
      ctx.strokeStyle = woodDark
      ctx.lineWidth = 1
      for (let j = 0; j < 4; j++) {
        const grainX = j * 16 + (i * 8)
        ctx.beginPath()
        ctx.moveTo(grainX, y + 2)
        ctx.quadraticCurveTo(grainX + 8, y + plankHeight / 2, grainX + 4, y + plankHeight - 2)
        ctx.stroke()
      }

      // Plank separators
      ctx.strokeStyle = woodDark
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, y + plankHeight)
      ctx.lineTo(size, y + plankHeight)
      ctx.stroke()

      // Knots in wood
      if (i === 1) {
        ctx.fillStyle = woodDark
        ctx.beginPath()
        ctx.ellipse(20 + variation, y + plankHeight / 2, 3, 2, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.needsUpdate = true

    return texture
  }

  static createCarpetTile() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const carpetRed = '#8B2635'
    const carpetDark = '#6B1525'
    const carpetLight = '#AB4655'

    // Base carpet color
    ctx.fillStyle = carpetRed
    ctx.fillRect(0, 0, size, size)

    // Carpet pattern (diamond/square pattern)
    ctx.strokeStyle = carpetDark
    ctx.lineWidth = 2

    // Diamond pattern
    for (let x = -size; x < size * 2; x += 16) {
      for (let y = -size; y < size * 2; y += 16) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + 8, y + 8)
        ctx.lineTo(x, y + 16)
        ctx.lineTo(x - 8, y + 8)
        ctx.closePath()
        ctx.stroke()
      }
    }

    // Add some texture/fibers
    ctx.strokeStyle = carpetLight
    ctx.lineWidth = 1
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 1, y + 1)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.needsUpdate = true

    return texture
  }

  static createTileFloorTile() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const tileWhite = '#E8E8E8'
    const tileGray = '#D0D0D0'
    const grout = '#A0A0A0'

    // Draw 2x2 tiles
    const tileSize = size / 2

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const x = col * tileSize
        const y = row * tileSize

        // Checkerboard pattern
        ctx.fillStyle = (row + col) % 2 === 0 ? tileWhite : tileGray
        ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2)

        // Grout lines
        ctx.strokeStyle = grout
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, tileSize, tileSize)
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.needsUpdate = true

    return texture
  }

  static createWallpaperTile() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const wallBlue = '#4A5A7A'
    const wallDark = '#3A4A6A'
    const wallLight = '#6A7A9A'

    // Base wallpaper color
    ctx.fillStyle = wallBlue
    ctx.fillRect(0, 0, size, size)

    // Damask pattern (simplified)
    ctx.strokeStyle = wallDark
    ctx.lineWidth = 2

    // Vertical stripes
    for (let x = 0; x < size; x += 16) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, size)
      ctx.stroke()
    }

    // Decorative flourishes
    ctx.strokeStyle = wallLight
    ctx.lineWidth = 1
    for (let x = 8; x < size; x += 16) {
      for (let y = 8; y < size; y += 16) {
        // Small flower pattern
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.stroke()

        // Petals
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + Math.cos(angle) * 5, y + Math.sin(angle) * 5)
          ctx.stroke()
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.needsUpdate = true

    return texture
  }

  static createBrickWallTile() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const brickRed = '#8B4C4C'
    const brickDark = '#6B3C3C'
    const mortar = '#B0A090'

    // Draw bricks in offset pattern
    const brickHeight = 16
    const brickWidth = 32

    for (let row = 0; row < 4; row++) {
      const offsetX = row % 2 === 0 ? 0 : brickWidth / 2

      for (let col = -1; col < 3; col++) {
        const x = col * brickWidth + offsetX
        const y = row * brickHeight

        // Mortar (background)
        ctx.fillStyle = mortar
        ctx.fillRect(x, y, brickWidth, brickHeight)

        // Brick
        ctx.fillStyle = brickRed
        ctx.fillRect(x + 1, y + 1, brickWidth - 2, brickHeight - 2)

        // Brick texture
        ctx.fillStyle = brickDark
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(
            x + 3 + Math.random() * (brickWidth - 6),
            y + 3 + Math.random() * (brickHeight - 6),
            2, 1
          )
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.flipY = false
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.needsUpdate = true

    return texture
  }
}
