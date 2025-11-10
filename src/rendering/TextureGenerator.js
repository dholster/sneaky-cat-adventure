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

    // Colors - more realistic cat colors
    const catOrange = '#E07B39'
    const catDark = '#B85C2A'
    const catLight = '#F5A66D'
    const catHighlight = '#FFD4AA'
    const white = '#FFFFFF'
    const black = '#1a1a1a'
    const pink = '#E8A1A8'
    const nose = '#E67E7E'

    // Helper to draw a cat frame with more detail
    const drawCatFrame = (col, row, offsetX = 0, offsetY = 0, earAngle = 0, tailCurve = 0, legPos = 0) => {
      const x = col * frameSize
      const y = row * frameSize
      const centerX = x + frameSize / 2 + offsetX
      const centerY = y + frameSize / 2 + offsetY

      // Tail (behind body) - curved and fluffy with gradient
      const tailGradient = ctx.createLinearGradient(centerX - 12, centerY, centerX - 8, centerY - 10 + tailCurve)
      tailGradient.addColorStop(0, catDark)
      tailGradient.addColorStop(0.5, catOrange)
      tailGradient.addColorStop(1, catLight)
      ctx.strokeStyle = tailGradient
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(centerX - 8, centerY + 2)
      ctx.quadraticCurveTo(
        centerX - 14, centerY - 4 + tailCurve,
        centerX - 10, centerY - 10 + tailCurve
      )
      ctx.stroke()

      // Tail tip (darker)
      ctx.fillStyle = catDark
      ctx.beginPath()
      ctx.arc(centerX - 10, centerY - 10 + tailCurve, 2, 0, Math.PI * 2)
      ctx.fill()

      // Body (oval, more compact and cat-like) with gradient
      const bodyGradient = ctx.createRadialGradient(centerX - 2, centerY, 2, centerX - 2, centerY + 2, 8)
      bodyGradient.addColorStop(0, catLight)
      bodyGradient.addColorStop(0.6, catOrange)
      bodyGradient.addColorStop(1, catDark)
      ctx.fillStyle = bodyGradient
      ctx.beginPath()
      ctx.ellipse(centerX - 2, centerY + 2, 8, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Body stripes (subtle)
      ctx.strokeStyle = catDark
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(centerX - 2, centerY + i, 6, 0, Math.PI)
        ctx.stroke()
      }
      ctx.globalAlpha = 1.0

      // Back legs with shading
      ctx.fillStyle = catDark
      ctx.fillRect(centerX - 8, centerY + 6 + legPos, 3, 5)
      ctx.fillRect(centerX - 4, centerY + 6 - legPos, 3, 5)

      // Leg highlights
      ctx.fillStyle = catOrange
      ctx.fillRect(centerX - 7, centerY + 6 + legPos, 1, 5)
      ctx.fillRect(centerX - 3, centerY + 6 - legPos, 1, 5)

      // Paws (back) with toe beans
      ctx.fillStyle = catLight
      ctx.fillRect(centerX - 8, centerY + 10 + legPos, 3, 2)
      ctx.fillRect(centerX - 4, centerY + 10 - legPos, 3, 2)

      // Toe beans
      ctx.fillStyle = pink
      ctx.fillRect(centerX - 7, centerY + 11 + legPos, 1, 1)
      ctx.fillRect(centerX - 3, centerY + 11 - legPos, 1, 1)

      // Head (more cat-like with pointed face) with gradient shading
      const headGradient = ctx.createRadialGradient(centerX + 6, centerY - 3, 1, centerX + 6, centerY - 2, 6)
      headGradient.addColorStop(0, catHighlight)
      headGradient.addColorStop(0.4, catLight)
      headGradient.addColorStop(0.8, catOrange)
      headGradient.addColorStop(1, catDark)
      ctx.fillStyle = headGradient
      ctx.beginPath()
      ctx.ellipse(centerX + 6, centerY - 2, 6, 5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Face marking (white chest patch)
      ctx.fillStyle = white
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.ellipse(centerX + 1, centerY + 4, 3, 4, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Snout/muzzle (white) with shading
      ctx.fillStyle = white
      ctx.beginPath()
      ctx.ellipse(centerX + 8, centerY + 1, 3, 2.5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Muzzle shadow
      ctx.fillStyle = catLight
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.ellipse(centerX + 8, centerY + 2, 2, 1.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Ears (triangular, more prominent) with inner pink
      // Left ear
      ctx.fillStyle = catOrange
      ctx.beginPath()
      ctx.moveTo(centerX + 2 + earAngle, centerY - 6)
      ctx.lineTo(centerX + 4 + earAngle, centerY - 11)
      ctx.lineTo(centerX + 6 + earAngle, centerY - 6)
      ctx.closePath()
      ctx.fill()

      // Left ear shadow
      ctx.fillStyle = catDark
      ctx.beginPath()
      ctx.moveTo(centerX + 2 + earAngle, centerY - 6)
      ctx.lineTo(centerX + 3 + earAngle, centerY - 9)
      ctx.lineTo(centerX + 4 + earAngle, centerY - 6)
      ctx.closePath()
      ctx.fill()

      // Right ear
      ctx.fillStyle = catOrange
      ctx.beginPath()
      ctx.moveTo(centerX + 7 - earAngle, centerY - 6)
      ctx.lineTo(centerX + 9 - earAngle, centerY - 11)
      ctx.lineTo(centerX + 11 - earAngle, centerY - 6)
      ctx.closePath()
      ctx.fill()

      // Right ear shadow
      ctx.fillStyle = catDark
      ctx.beginPath()
      ctx.moveTo(centerX + 8 - earAngle, centerY - 6)
      ctx.lineTo(centerX + 9 - earAngle, centerY - 9)
      ctx.lineTo(centerX + 10 - earAngle, centerY - 6)
      ctx.closePath()
      ctx.fill()

      // Inner ears (pink)
      ctx.fillStyle = pink
      ctx.beginPath()
      ctx.moveTo(centerX + 3.5 + earAngle, centerY - 7)
      ctx.lineTo(centerX + 4 + earAngle, centerY - 9)
      ctx.lineTo(centerX + 4.5 + earAngle, centerY - 7)
      ctx.closePath()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(centerX + 8.5 - earAngle, centerY - 7)
      ctx.lineTo(centerX + 9 - earAngle, centerY - 9)
      ctx.lineTo(centerX + 9.5 - earAngle, centerY - 7)
      ctx.closePath()
      ctx.fill()

      // Eyes (cat-like with more detail)
      // Eye whites
      ctx.fillStyle = white
      ctx.beginPath()
      ctx.ellipse(centerX + 4, centerY - 2.5, 1.5, 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(centerX + 8, centerY - 2.5, 1.5, 2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupils (vertical slits)
      ctx.fillStyle = black
      ctx.fillRect(centerX + 3.5, centerY - 3, 1, 3)
      ctx.fillRect(centerX + 7.5, centerY - 3, 1, 3)

      // Eye shine (green reflection)
      ctx.fillStyle = '#90EE90'
      ctx.fillRect(centerX + 3.8, centerY - 2.5, 0.8, 1)
      ctx.fillRect(centerX + 7.8, centerY - 2.5, 0.8, 1)

      // Nose (small triangle) with shading
      ctx.fillStyle = nose
      ctx.beginPath()
      ctx.moveTo(centerX + 8, centerY)
      ctx.lineTo(centerX + 7, centerY + 1.2)
      ctx.lineTo(centerX + 9, centerY + 1.2)
      ctx.closePath()
      ctx.fill()

      // Nose highlight
      ctx.fillStyle = pink
      ctx.fillRect(centerX + 7.5, centerY + 0.3, 1, 0.5)

      // Mouth (subtle line)
      ctx.strokeStyle = catDark
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX + 8, centerY + 1.2)
      ctx.lineTo(centerX + 8, centerY + 2)
      ctx.moveTo(centerX + 8, centerY + 2)
      ctx.quadraticCurveTo(centerX + 7, centerY + 2.5, centerX + 6, centerY + 2)
      ctx.moveTo(centerX + 8, centerY + 2)
      ctx.quadraticCurveTo(centerX + 9, centerY + 2.5, centerX + 10, centerY + 2)
      ctx.stroke()

      // Whiskers (thin lines)
      ctx.strokeStyle = white
      ctx.lineWidth = 0.5
      // Left whiskers
      ctx.globalAlpha = 0.8
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
      ctx.globalAlpha = 1.0

      // Front legs with shading
      ctx.fillStyle = catOrange
      ctx.fillRect(centerX + 2, centerY + 6 - legPos, 2, 5)
      ctx.fillRect(centerX + 5, centerY + 6 + legPos, 2, 5)

      // Leg highlights
      ctx.fillStyle = catLight
      ctx.fillRect(centerX + 2, centerY + 6 - legPos, 1, 5)
      ctx.fillRect(centerX + 5, centerY + 6 + legPos, 1, 5)

      // Paws (front) with toe beans
      ctx.fillStyle = catLight
      ctx.fillRect(centerX + 2, centerY + 10 - legPos, 2, 2)
      ctx.fillRect(centerX + 5, centerY + 10 + legPos, 2, 2)

      // Toe beans (front)
      ctx.fillStyle = pink
      ctx.fillRect(centerX + 2.5, centerY + 11 - legPos, 1, 1)
      ctx.fillRect(centerX + 5.5, centerY + 11 + legPos, 1, 1)
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

    // Colors - more realistic with shading
    const uniformBlue = '#3a4a7a'
    const uniformDark = '#2a3a5a'
    const uniformLight = '#4a5a8a'
    const skinTone = '#FFD0A0'
    const skinDark = '#E8B080'
    const skinLight = '#FFE8C0'
    const hairBrown = '#4a3020'
    const hairLight = '#6a4a30'
    const black = '#222222'
    const white = '#FFFFFF'
    const bootBlack = '#1a1a1a'

    const drawGuardFrame = (col, row, legOffset = 0, armSwing = 0) => {
      const x = col * frameSize
      const y = row * frameSize
      const centerX = x + frameSize / 2
      const centerY = y + frameSize / 2

      // Back arm with gradient shading
      const backArmGradient = ctx.createLinearGradient(centerX - 8 - armSwing, centerY + 2, centerX - 5 - armSwing, centerY + 2)
      backArmGradient.addColorStop(0, uniformDark)
      backArmGradient.addColorStop(1, uniformBlue)
      ctx.fillStyle = backArmGradient
      ctx.fillRect(centerX - 8 - armSwing, centerY + 2, 3, 8)

      // Arm shadow
      ctx.fillStyle = uniformDark
      ctx.globalAlpha = 0.3
      ctx.fillRect(centerX - 8 - armSwing, centerY + 5, 1, 5)
      ctx.globalAlpha = 1.0

      // Back hand
      ctx.fillStyle = skinTone
      ctx.fillRect(centerX - 8 - armSwing, centerY + 10, 3, 3)

      // Hand shading
      ctx.fillStyle = skinDark
      ctx.globalAlpha = 0.4
      ctx.fillRect(centerX - 8 - armSwing, centerY + 12, 3, 1)
      ctx.globalAlpha = 1.0

      // Legs with gradient shading
      const legGradient = ctx.createLinearGradient(centerX - 4, centerY + 10, centerX - 1, centerY + 10)
      legGradient.addColorStop(0, uniformDark)
      legGradient.addColorStop(0.6, uniformBlue)
      legGradient.addColorStop(1, uniformLight)
      ctx.fillStyle = legGradient

      // Left leg
      ctx.fillRect(centerX - 4 + legOffset, centerY + 10, 3, 6)
      // Right leg
      ctx.fillRect(centerX + 1 - legOffset, centerY + 10, 3, 6)

      // Leg highlights (fabric shine)
      ctx.fillStyle = uniformLight
      ctx.globalAlpha = 0.3
      ctx.fillRect(centerX - 2 + legOffset, centerY + 11, 1, 4)
      ctx.fillRect(centerX + 3 - legOffset, centerY + 11, 1, 4)
      ctx.globalAlpha = 1.0

      // Boots with gradient
      const bootGradient = ctx.createLinearGradient(centerX - 4, centerY + 15, centerX, centerY + 15)
      bootGradient.addColorStop(0, bootBlack)
      bootGradient.addColorStop(0.5, '#2a2a2a')
      bootGradient.addColorStop(1, bootBlack)
      ctx.fillStyle = bootGradient
      ctx.fillRect(centerX - 4 + legOffset, centerY + 15, 4, 3)
      ctx.fillRect(centerX + 1 - legOffset, centerY + 15, 4, 3)

      // Boot shine
      ctx.fillStyle = '#444444'
      ctx.fillRect(centerX - 3 + legOffset, centerY + 15, 1, 2)
      ctx.fillRect(centerX + 2 - legOffset, centerY + 15, 1, 2)

      // Body/torso with gradient for fabric depth
      const bodyGradient = ctx.createRadialGradient(centerX - 2, centerY + 2, 2, centerX, centerY + 4, 10)
      bodyGradient.addColorStop(0, uniformLight)
      bodyGradient.addColorStop(0.5, uniformBlue)
      bodyGradient.addColorStop(1, uniformDark)
      ctx.fillStyle = bodyGradient
      ctx.fillRect(centerX - 6, centerY - 2, 12, 12)

      // Uniform folds/shadows
      ctx.fillStyle = uniformDark
      ctx.globalAlpha = 0.4
      // Vertical fold
      ctx.fillRect(centerX, centerY, 1, 10)
      // Side shadows
      ctx.fillRect(centerX - 6, centerY + 2, 1, 8)
      ctx.fillRect(centerX + 5, centerY + 2, 1, 8)
      ctx.globalAlpha = 1.0

      // Collar highlights
      ctx.fillStyle = uniformLight
      ctx.globalAlpha = 0.5
      ctx.fillRect(centerX - 4, centerY - 2, 8, 1)
      ctx.globalAlpha = 1.0

      // Belt with buckle detail
      ctx.fillStyle = uniformDark
      ctx.fillRect(centerX - 6, centerY + 8, 12, 2)

      // Belt buckle
      ctx.fillStyle = '#C0C0C0' // silver
      ctx.fillRect(centerX - 1, centerY + 8, 2, 2)
      ctx.strokeStyle = '#888888'
      ctx.lineWidth = 1
      ctx.strokeRect(centerX - 1, centerY + 8, 2, 2)

      // Badge/button with shine
      ctx.fillStyle = '#FFD700' // gold
      ctx.fillRect(centerX - 1, centerY + 2, 2, 2)

      // Badge shine
      ctx.fillStyle = '#FFED4E'
      ctx.globalAlpha = 0.6
      ctx.fillRect(centerX - 0.5, centerY + 2, 1, 1)
      ctx.globalAlpha = 1.0

      // Neck with gradient
      const neckGradient = ctx.createLinearGradient(centerX - 2, centerY - 4, centerX + 2, centerY - 4)
      neckGradient.addColorStop(0, skinDark)
      neckGradient.addColorStop(0.5, skinTone)
      neckGradient.addColorStop(1, skinDark)
      ctx.fillStyle = neckGradient
      ctx.fillRect(centerX - 2, centerY - 4, 4, 3)

      // Neck shadow
      ctx.fillStyle = skinDark
      ctx.globalAlpha = 0.3
      ctx.fillRect(centerX - 2, centerY - 2, 4, 1)
      ctx.globalAlpha = 1.0

      // Head with realistic skin gradient
      const headGradient = ctx.createRadialGradient(centerX - 1, centerY - 9, 2, centerX, centerY - 7, 6)
      headGradient.addColorStop(0, skinLight)
      headGradient.addColorStop(0.5, skinTone)
      headGradient.addColorStop(1, skinDark)
      ctx.fillStyle = headGradient
      ctx.beginPath()
      ctx.ellipse(centerX, centerY - 8, 5, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Face shadow on side
      ctx.fillStyle = skinDark
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.ellipse(centerX + 3, centerY - 8, 2, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Hair with gradient and texture
      const hairGradient = ctx.createLinearGradient(centerX - 5, centerY - 13, centerX + 5, centerY - 13)
      hairGradient.addColorStop(0, hairBrown)
      hairGradient.addColorStop(0.5, hairLight)
      hairGradient.addColorStop(1, hairBrown)
      ctx.fillStyle = hairGradient
      ctx.fillRect(centerX - 5, centerY - 13, 10, 5)

      // Hair texture lines
      ctx.strokeStyle = hairBrown
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.5
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(centerX - 4 + i * 2, centerY - 13)
        ctx.lineTo(centerX - 3 + i * 2, centerY - 9)
        ctx.stroke()
      }
      ctx.globalAlpha = 1.0

      // Ears with shading
      const earGradient = ctx.createLinearGradient(centerX - 6, centerY - 8, centerX - 4, centerY - 8)
      earGradient.addColorStop(0, skinDark)
      earGradient.addColorStop(1, skinTone)
      ctx.fillStyle = earGradient
      ctx.fillRect(centerX - 6, centerY - 8, 2, 3)

      const earGradient2 = ctx.createLinearGradient(centerX + 4, centerY - 8, centerX + 6, centerY - 8)
      earGradient2.addColorStop(0, skinTone)
      earGradient2.addColorStop(1, skinDark)
      ctx.fillStyle = earGradient2
      ctx.fillRect(centerX + 4, centerY - 8, 2, 3)

      // Ear shadows
      ctx.fillStyle = skinDark
      ctx.globalAlpha = 0.4
      ctx.fillRect(centerX - 5, centerY - 7, 1, 2)
      ctx.fillRect(centerX + 4, centerY - 7, 1, 2)
      ctx.globalAlpha = 1.0

      // Eyes with detail
      // Eye whites
      ctx.fillStyle = white
      ctx.fillRect(centerX - 3, centerY - 9, 2, 2)
      ctx.fillRect(centerX + 1, centerY - 9, 2, 2)

      // Pupils
      ctx.fillStyle = black
      ctx.fillRect(centerX - 2, centerY - 9, 2, 2)
      ctx.fillRect(centerX + 2, centerY - 9, 2, 2)

      // Eye shine
      ctx.fillStyle = white
      ctx.fillRect(centerX - 3, centerY - 9, 1, 1)
      ctx.fillRect(centerX + 1, centerY - 9, 1, 1)

      // Eyebrows
      ctx.strokeStyle = hairBrown
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX - 4, centerY - 10)
      ctx.lineTo(centerX - 1, centerY - 10.5)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX + 1, centerY - 10.5)
      ctx.lineTo(centerX + 4, centerY - 10)
      ctx.stroke()

      // Nose with shading
      const noseGradient = ctx.createLinearGradient(centerX - 1, centerY - 6, centerX + 1, centerY - 6)
      noseGradient.addColorStop(0, skinDark)
      noseGradient.addColorStop(0.5, '#FFBB88')
      noseGradient.addColorStop(1, skinTone)
      ctx.fillStyle = noseGradient
      ctx.fillRect(centerX - 1, centerY - 6, 2, 3)

      // Nose shadow
      ctx.fillStyle = skinDark
      ctx.globalAlpha = 0.3
      ctx.fillRect(centerX + 1, centerY - 6, 1, 3)
      ctx.globalAlpha = 1.0

      // Mouth with depth
      ctx.fillStyle = '#8B6F6F'
      ctx.fillRect(centerX - 2, centerY - 4, 4, 1)

      // Mouth highlight (upper lip)
      ctx.fillStyle = skinTone
      ctx.globalAlpha = 0.6
      ctx.fillRect(centerX - 2, centerY - 5, 4, 1)
      ctx.globalAlpha = 1.0

      // Front arm with gradient
      const frontArmGradient = ctx.createLinearGradient(centerX + 5 + armSwing, centerY + 2, centerX + 8 + armSwing, centerY + 2)
      frontArmGradient.addColorStop(0, uniformBlue)
      frontArmGradient.addColorStop(1, uniformLight)
      ctx.fillStyle = frontArmGradient
      ctx.fillRect(centerX + 5 + armSwing, centerY + 2, 3, 8)

      // Arm highlight
      ctx.fillStyle = uniformLight
      ctx.globalAlpha = 0.4
      ctx.fillRect(centerX + 6 + armSwing, centerY + 3, 1, 6)
      ctx.globalAlpha = 1.0

      // Front hand
      ctx.fillStyle = skinTone
      ctx.fillRect(centerX + 5 + armSwing, centerY + 10, 3, 3)

      // Hand shading and fingers
      ctx.fillStyle = skinDark
      ctx.globalAlpha = 0.3
      ctx.fillRect(centerX + 5 + armSwing, centerY + 12, 3, 1)
      ctx.globalAlpha = 1.0

      // Finger lines
      ctx.strokeStyle = skinDark
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.5
      ctx.beginPath()
      ctx.moveTo(centerX + 6 + armSwing, centerY + 10)
      ctx.lineTo(centerX + 6 + armSwing, centerY + 13)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX + 7 + armSwing, centerY + 10)
      ctx.lineTo(centerX + 7 + armSwing, centerY + 13)
      ctx.stroke()
      ctx.globalAlpha = 1.0
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
    const dogHighlight = '#C4916A'
    const black = '#222222'
    const white = '#FFFFFF'
    const pink = '#FFB6C1'

    const drawDogFrame = (col, tailWag = 0, legPhase = 0) => {
      const x = col * frameSize
      const y = 0
      const centerX = x + frameSize / 2
      const centerY = y + frameSize / 2 + 2

      // Tail (behind body) - wagging with gradient
      const tailGradient = ctx.createLinearGradient(centerX - 10, centerY + 1, centerX - 14, centerY - 3 + tailWag)
      tailGradient.addColorStop(0, dogDark)
      tailGradient.addColorStop(0.5, dogBrown)
      tailGradient.addColorStop(1, dogLight)
      ctx.strokeStyle = tailGradient
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(centerX - 10, centerY + 1)
      ctx.lineTo(centerX - 14, centerY - 3 + tailWag)
      ctx.stroke()

      // Tail tip highlight
      ctx.fillStyle = dogLight
      ctx.beginPath()
      ctx.arc(centerX - 14, centerY - 3 + tailWag, 2, 0, Math.PI * 2)
      ctx.fill()

      // Body (elongated, dog-like) with gradient for depth
      const bodyGradient = ctx.createRadialGradient(centerX - 3, centerY - 1, 2, centerX - 3, centerY + 2, 10)
      bodyGradient.addColorStop(0, dogHighlight)
      bodyGradient.addColorStop(0.5, dogBrown)
      bodyGradient.addColorStop(1, dogDark)
      ctx.fillStyle = bodyGradient
      ctx.beginPath()
      ctx.ellipse(centerX - 3, centerY + 1, 10, 5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Body fur texture (subtle stripes)
      ctx.strokeStyle = dogDark
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.2
      for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        ctx.moveTo(centerX - 10 + i * 3, centerY - 2)
        ctx.lineTo(centerX - 8 + i * 3, centerY + 4)
        ctx.stroke()
      }
      ctx.globalAlpha = 1.0

      // Back legs with shading
      const backLegGradient = ctx.createLinearGradient(centerX - 9, centerY + 5, centerX - 7, centerY + 5)
      backLegGradient.addColorStop(0, dogDark)
      backLegGradient.addColorStop(1, dogBrown)
      ctx.fillStyle = backLegGradient
      ctx.fillRect(centerX - 9, centerY + 5 + Math.sin(legPhase) * 2, 2, 5)
      ctx.fillRect(centerX - 6, centerY + 5 - Math.sin(legPhase) * 2, 2, 5)

      // Leg highlights
      ctx.fillStyle = dogLight
      ctx.fillRect(centerX - 8, centerY + 6 + Math.sin(legPhase) * 2, 1, 4)
      ctx.fillRect(centerX - 5, centerY + 6 - Math.sin(legPhase) * 2, 1, 4)

      // Paws (back)
      ctx.fillStyle = black
      ctx.fillRect(centerX - 9, centerY + 9 + Math.sin(legPhase) * 2, 2, 2)
      ctx.fillRect(centerX - 6, centerY + 9 - Math.sin(legPhase) * 2, 2, 2)

      // Chest/neck area with gradient
      const chestGradient = ctx.createRadialGradient(centerX + 5, centerY - 1, 1, centerX + 5, centerY + 1, 4)
      chestGradient.addColorStop(0, dogHighlight)
      chestGradient.addColorStop(0.6, dogLight)
      chestGradient.addColorStop(1, dogBrown)
      ctx.fillStyle = chestGradient
      ctx.beginPath()
      ctx.ellipse(centerX + 5, centerY, 4, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      // Head with gradient shading
      const headGradient = ctx.createRadialGradient(centerX + 9, centerY - 2, 1, centerX + 9, centerY, 5)
      headGradient.addColorStop(0, dogLight)
      headGradient.addColorStop(0.6, dogBrown)
      headGradient.addColorStop(1, dogDark)
      ctx.fillStyle = headGradient
      ctx.beginPath()
      ctx.ellipse(centerX + 9, centerY - 1, 5, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      // Snout (elongated) with gradient
      const snoutGradient = ctx.createLinearGradient(centerX + 11, centerY - 1, centerX + 15, centerY - 1)
      snoutGradient.addColorStop(0, dogLight)
      snoutGradient.addColorStop(0.7, dogLight)
      snoutGradient.addColorStop(1, dogBrown)
      ctx.fillStyle = snoutGradient
      ctx.fillRect(centerX + 11, centerY - 1, 4, 3)

      // Snout shadow underneath
      ctx.fillStyle = dogDark
      ctx.globalAlpha = 0.3
      ctx.fillRect(centerX + 11, centerY + 1, 4, 1)
      ctx.globalAlpha = 1.0

      // Nose (black, prominent) with shine
      ctx.fillStyle = black
      ctx.fillRect(centerX + 14, centerY - 1, 2, 2)

      // Nose shine
      ctx.fillStyle = white
      ctx.globalAlpha = 0.6
      ctx.fillRect(centerX + 14.5, centerY - 0.5, 1, 1)
      ctx.globalAlpha = 1.0

      // Ears (floppy) with gradient shading
      const earGradient = ctx.createRadialGradient(centerX + 6, centerY - 3, 0, centerX + 6, centerY - 1, 4)
      earGradient.addColorStop(0, dogDark)
      earGradient.addColorStop(0.5, dogBrown)
      earGradient.addColorStop(1, dogLight)

      // Left ear
      ctx.fillStyle = earGradient
      ctx.beginPath()
      ctx.ellipse(centerX + 6, centerY - 3, 2, 4, -0.3, 0, Math.PI * 2)
      ctx.fill()

      // Left ear inner/highlight
      ctx.fillStyle = dogLight
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.ellipse(centerX + 6.5, centerY - 3, 1, 3, -0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Right ear
      const earGradient2 = ctx.createRadialGradient(centerX + 11, centerY - 3, 0, centerX + 11, centerY - 1, 4)
      earGradient2.addColorStop(0, dogDark)
      earGradient2.addColorStop(0.5, dogBrown)
      earGradient2.addColorStop(1, dogLight)
      ctx.fillStyle = earGradient2
      ctx.beginPath()
      ctx.ellipse(centerX + 11, centerY - 3, 2, 4, 0.3, 0, Math.PI * 2)
      ctx.fill()

      // Right ear inner/highlight
      ctx.fillStyle = dogLight
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.ellipse(centerX + 10.5, centerY - 3, 1, 3, 0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Eye with more detail
      ctx.fillStyle = white
      ctx.beginPath()
      ctx.ellipse(centerX + 9.5, centerY - 2, 1.5, 1.8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupil
      ctx.fillStyle = black
      ctx.beginPath()
      ctx.arc(centerX + 9.5, centerY - 1.8, 1, 0, Math.PI * 2)
      ctx.fill()

      // Eye shine
      ctx.fillStyle = white
      ctx.fillRect(centerX + 9, centerY - 2.2, 1, 1)

      // Eyebrow/expression
      ctx.strokeStyle = dogDark
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.moveTo(centerX + 7.5, centerY - 3)
      ctx.lineTo(centerX + 10.5, centerY - 3.5)
      ctx.stroke()
      ctx.globalAlpha = 1.0

      // Mouth line with curve
      ctx.strokeStyle = black
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX + 14, centerY + 1)
      ctx.quadraticCurveTo(centerX + 13, centerY + 2, centerX + 12, centerY + 2)
      ctx.stroke()

      // Front legs with shading
      const frontLegGradient = ctx.createLinearGradient(centerX + 2, centerY + 4, centerX + 4, centerY + 4)
      frontLegGradient.addColorStop(0, dogDark)
      frontLegGradient.addColorStop(0.5, dogBrown)
      frontLegGradient.addColorStop(1, dogLight)
      ctx.fillStyle = frontLegGradient
      ctx.fillRect(centerX + 2, centerY + 4 - Math.sin(legPhase) * 2, 2, 6)
      ctx.fillRect(centerX + 5, centerY + 4 + Math.sin(legPhase) * 2, 2, 6)

      // Front leg highlights
      ctx.fillStyle = dogLight
      ctx.fillRect(centerX + 3, centerY + 5 - Math.sin(legPhase) * 2, 1, 4)
      ctx.fillRect(centerX + 6, centerY + 5 + Math.sin(legPhase) * 2, 1, 4)

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

    const cardboard = '#D2B48C'  // Light tan cardboard
    const cardboardDark = '#A0826D'
    const cardboardLight = '#E8D4B8'
    const tape = '#C8B090'
    const black = '#000000'

    // Simple rectangular box - front view
    // Main box body
    ctx.fillStyle = cardboard
    ctx.fillRect(16, 22, 32, 32)

    // Top flaps (open box)
    // Left flap
    ctx.fillStyle = cardboardLight
    ctx.beginPath()
    ctx.moveTo(16, 22)
    ctx.lineTo(14, 16)
    ctx.lineTo(26, 16)
    ctx.lineTo(24, 22)
    ctx.closePath()
    ctx.fill()

    // Right flap
    ctx.beginPath()
    ctx.moveTo(40, 22)
    ctx.lineTo(38, 16)
    ctx.lineTo(50, 16)
    ctx.lineTo(48, 22)
    ctx.closePath()
    ctx.fill()

    // Flap creases (darker lines)
    ctx.strokeStyle = cardboardDark
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(16, 22)
    ctx.lineTo(24, 22)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(40, 22)
    ctx.lineTo(48, 22)
    ctx.stroke()

    // Box seam down the middle
    ctx.strokeStyle = cardboardDark
    ctx.lineWidth = 1
    ctx.setLineDash([3, 2])
    ctx.beginPath()
    ctx.moveTo(32, 22)
    ctx.lineTo(32, 54)
    ctx.stroke()
    ctx.setLineDash([])

    // Horizontal seam
    ctx.beginPath()
    ctx.moveTo(16, 38)
    ctx.lineTo(48, 38)
    ctx.stroke()

    // Tape strip (vertical)
    ctx.fillStyle = tape
    ctx.fillRect(30, 16, 4, 38)

    // Tape highlights
    ctx.fillStyle = cardboardLight
    ctx.globalAlpha = 0.5
    ctx.fillRect(30, 16, 1, 38)
    ctx.fillRect(33, 16, 1, 38)
    ctx.globalAlpha = 1.0

    // Tape strip (horizontal)
    ctx.fillStyle = tape
    ctx.fillRect(16, 36, 32, 4)
    ctx.fillStyle = cardboardLight
    ctx.globalAlpha = 0.5
    ctx.fillRect(16, 36, 32, 1)
    ctx.fillRect(16, 39, 32, 1)
    ctx.globalAlpha = 1.0

    // Box outline
    ctx.strokeStyle = black
    ctx.lineWidth = 2
    ctx.strokeRect(16, 22, 32, 32)

    // Simple "FRAGILE" text
    ctx.fillStyle = black
    ctx.font = 'bold 6px monospace'
    ctx.globalAlpha = 0.3
    ctx.fillText('FRAGILE', 20, 50)
    ctx.globalAlpha = 1.0

    // Cardboard texture (simple dots/specks)
    ctx.fillStyle = cardboardDark
    ctx.globalAlpha = 0.2
    for (let i = 0; i < 40; i++) {
      const x = 16 + Math.random() * 32
      const y = 22 + Math.random() * 32
      ctx.fillRect(x, y, 1, 1)
    }
    ctx.globalAlpha = 1.0

    // Shadow at bottom
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(16, 52, 32, 2)

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
    const woodHighlight = '#C4A574'
    const grainDark = '#5A4428'

    // Draw wood planks (3 horizontal planks) with more realistic grain
    const plankHeight = size / 3

    for (let i = 0; i < 3; i++) {
      const y = i * plankHeight

      // Base plank with gradient for roundness
      const plankGradient = ctx.createLinearGradient(0, y, 0, y + plankHeight)
      plankGradient.addColorStop(0, i % 2 === 0 ? woodLight : woodBrown)
      plankGradient.addColorStop(0.5, i % 2 === 0 ? woodBrown : woodLight)
      plankGradient.addColorStop(1, i % 2 === 0 ? woodDark : woodBrown)
      ctx.fillStyle = plankGradient
      ctx.fillRect(0, y, size, plankHeight)

      // Wood grain lines (more natural curves)
      ctx.strokeStyle = grainDark
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3
      for (let j = 0; j < 5; j++) {
        const grainX = j * 13 + (i * 7)
        ctx.beginPath()
        ctx.moveTo(grainX - 5, y + 2)
        ctx.quadraticCurveTo(grainX, y + plankHeight / 3, grainX - 3, y + plankHeight / 2)
        ctx.quadraticCurveTo(grainX + 2, y + (plankHeight * 2) / 3, grainX, y + plankHeight - 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1.0

      // Subtle grain texture lines
      ctx.strokeStyle = woodLight
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.2
      for (let j = 0; j < 8; j++) {
        ctx.beginPath()
        ctx.moveTo(j * 8, y + plankHeight / 2)
        ctx.lineTo(j * 8 + 8, y + plankHeight / 2 + (Math.random() - 0.5) * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1.0

      // Plank separators with shadow
      ctx.strokeStyle = grainDark
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, y + plankHeight - 1)
      ctx.lineTo(size, y + plankHeight - 1)
      ctx.stroke()

      // Separator highlight (beveled edge)
      ctx.strokeStyle = woodHighlight
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.moveTo(0, y + 1)
      ctx.lineTo(size, y + 1)
      ctx.stroke()
      ctx.globalAlpha = 1.0

      // Wood knots (more realistic)
      if (i === 1 || (i === 0 && Math.random() > 0.5)) {
        const knotX = 15 + Math.random() * 30
        const knotY = y + plankHeight / 2

        // Knot shadow
        ctx.fillStyle = grainDark
        ctx.beginPath()
        ctx.ellipse(knotX, knotY, 4, 3, Math.random() * Math.PI, 0, Math.PI * 2)
        ctx.fill()

        // Knot center
        ctx.fillStyle = woodDark
        ctx.beginPath()
        ctx.ellipse(knotX, knotY, 2.5, 1.5, Math.random() * Math.PI, 0, Math.PI * 2)
        ctx.fill()

        // Knot grain rings
        ctx.strokeStyle = grainDark
        ctx.lineWidth = 0.5
        ctx.globalAlpha = 0.5
        for (let ring = 0; ring < 2; ring++) {
          ctx.beginPath()
          ctx.ellipse(knotX, knotY, 3 + ring, 2 + ring, 0, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.globalAlpha = 1.0
      }
    }

    // Overall texture variation (subtle noise)
    ctx.fillStyle = woodDark
    ctx.globalAlpha = 0.05
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      ctx.fillRect(x, y, 1 + Math.random(), 1 + Math.random())
    }
    ctx.globalAlpha = 1.0

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
