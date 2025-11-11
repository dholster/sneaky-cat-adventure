/**
 * TextureGenerator - Creates simple pixel art textures programmatically
 * Used as placeholders until real sprite sheets are loaded
 */

import * as THREE from 'three'

export class TextureGenerator {
  /**
   * Create a HIGH-RESOLUTION recognizable cat sprite sheet
   * 6 columns x 3 rows = 18 frames
   * 128x128 per frame (4x resolution upgrade from 32x32)
   * Row 1: idle (2 frames), walk (4 frames)
   * Row 2: run (4 frames), crouch (2 frames)
   * Row 3: jump (4 frames), land (2 frames)
   */
  static createCatSpriteSheet() {
    const frameSize = 64 // Increased from 32 to 64 (2x, more manageable)
    const columns = 6
    const rows = 3
    const canvas = document.createElement('canvas')
    canvas.width = frameSize * columns
    canvas.height = frameSize * rows
    const ctx = canvas.getContext('2d')

    // Enable anti-aliasing for smooth rendering
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Clear canvas
    ctx.fillStyle = 'transparent'
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Enhanced color palette with more shades
    const catOrange = '#E07B39'
    const catDark = '#A04920'
    const catMid = '#C86530'
    const catLight = '#F5A66D'
    const catHighlight = '#FFD4AA'
    const catVeryLight = '#FFF5E8'
    const white = '#FFFFFF'
    const black = '#1a1a1a'
    const darkGrey = '#3a3a3a'
    const pink = '#FFB6C1'
    const pinkDark = '#E8A1A8'
    const nose = '#E67E7E'
    const eyeGreen = '#7EC850'
    const eyeGreenDark = '#5A9C38'

    // Helper to draw a HIGH-RES cat frame with smooth gradients and details
    const drawCatFrame = (col, row, offsetX = 0, offsetY = 0, earAngle = 0, tailCurve = 0, legPos = 0) => {
      const x = col * frameSize
      const y = row * frameSize
      const centerX = x + frameSize / 2 + offsetX
      const centerY = y + frameSize / 2 + offsetY

      ctx.save()

      // === TAIL (behind body) - Fluffy and curved with multiple gradients ===
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 4
      ctx.shadowOffsetY = 2

      // Tail base (thick)
      const tailGradient = ctx.createLinearGradient(
        centerX - 48, centerY,
        centerX - 32, centerY - 40 + tailCurve
      )
      tailGradient.addColorStop(0, catDark)
      tailGradient.addColorStop(0.3, catMid)
      tailGradient.addColorStop(0.6, catOrange)
      tailGradient.addColorStop(1, catLight)

      ctx.strokeStyle = tailGradient
      ctx.lineWidth = 20
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(centerX - 32, centerY + 8)
      ctx.quadraticCurveTo(
        centerX - 56, centerY - 16 + tailCurve,
        centerX - 40, centerY - 40 + tailCurve
      )
      ctx.stroke()

      // Tail highlight stripe
      ctx.strokeStyle = catLight
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.moveTo(centerX - 32, centerY + 8)
      ctx.quadraticCurveTo(
        centerX - 54, centerY - 16 + tailCurve,
        centerX - 40, centerY - 40 + tailCurve
      )
      ctx.stroke()

      // Tail tip (fluffy circle)
      const tailTipGradient = ctx.createRadialGradient(
        centerX - 40, centerY - 40 + tailCurve, 2,
        centerX - 40, centerY - 40 + tailCurve, 10
      )
      tailTipGradient.addColorStop(0, catLight)
      tailTipGradient.addColorStop(0.7, catMid)
      tailTipGradient.addColorStop(1, catDark)
      ctx.fillStyle = tailTipGradient
      ctx.beginPath()
      ctx.arc(centerX - 40, centerY - 40 + tailCurve, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowColor = 'transparent'

      // === BODY (oval, more cat-like) with radial gradient for volume ===
      const bodyGradient = ctx.createRadialGradient(
        centerX - 8, centerY, 8,
        centerX - 8, centerY + 8, 32
      )
      bodyGradient.addColorStop(0, catVeryLight)
      bodyGradient.addColorStop(0.2, catHighlight)
      bodyGradient.addColorStop(0.5, catLight)
      bodyGradient.addColorStop(0.8, catOrange)
      bodyGradient.addColorStop(1, catDark)

      ctx.fillStyle = bodyGradient
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 8
      ctx.shadowOffsetY = 4
      ctx.beginPath()
      ctx.ellipse(centerX - 8, centerY + 8, 32, 24, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowColor = 'transparent'

      // Body fur texture (subtle stripes)
      ctx.strokeStyle = catDark
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.15
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.arc(centerX - 8, centerY + i * 4, 24, 0, Math.PI)
        ctx.stroke()
      }
      ctx.globalAlpha = 1.0

      // === BACK LEGS with gradient shading ===
      const legGradient = ctx.createLinearGradient(centerX - 32, centerY + 24, centerX - 28, centerY + 44)
      legGradient.addColorStop(0, catMid)
      legGradient.addColorStop(0.5, catOrange)
      legGradient.addColorStop(1, catDark)

      // Back left leg
      ctx.fillStyle = legGradient
      ctx.fillRect(centerX - 32, centerY + 24 + legPos, 12, 20)

      // Back right leg
      ctx.fillRect(centerX - 16, centerY + 24 - legPos, 12, 20)

      // Leg highlights
      ctx.fillStyle = catLight
      ctx.globalAlpha = 0.6
      ctx.fillRect(centerX - 30, centerY + 24 + legPos, 4, 20)
      ctx.fillRect(centerX - 14, centerY + 24 - legPos, 4, 20)
      ctx.globalAlpha = 1.0

      // === FRONT LEGS ===
      ctx.fillStyle = legGradient
      ctx.fillRect(centerX + 8, centerY + 24 + legPos, 12, 20)
      ctx.fillRect(centerX + 24, centerY + 24 - legPos, 12, 20)

      // Front leg highlights
      ctx.fillStyle = catLight
      ctx.globalAlpha = 0.6
      ctx.fillRect(centerX + 10, centerY + 24 + legPos, 4, 20)
      ctx.fillRect(centerX + 26, centerY + 24 - legPos, 4, 20)
      ctx.globalAlpha = 1.0

      // === PAWS with toe beans ===
      // Back paws
      const pawGradient = ctx.createRadialGradient(
        centerX - 26, centerY + 42, 2,
        centerX - 26, centerY + 42, 8
      )
      pawGradient.addColorStop(0, catLight)
      pawGradient.addColorStop(1, catMid)

      ctx.fillStyle = pawGradient
      ctx.beginPath()
      ctx.ellipse(centerX - 26, centerY + 42 + legPos, 8, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(centerX - 10, centerY + 42 - legPos, 8, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Front paws
      ctx.beginPath()
      ctx.ellipse(centerX + 14, centerY + 42 + legPos, 8, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(centerX + 30, centerY + 42 - legPos, 8, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Toe beans (cute detail)
      ctx.fillStyle = pinkDark
      const beans = [
        [centerX - 26, centerY + 42 + legPos],
        [centerX - 10, centerY + 42 - legPos],
        [centerX + 14, centerY + 42 + legPos],
        [centerX + 30, centerY + 42 - legPos]
      ]
      beans.forEach(([bx, by]) => {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.arc(bx + (i - 1) * 3, by + 2, 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(bx, by - 2, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // === HEAD with sophisticated gradient ===
      const headGradient = ctx.createRadialGradient(
        centerX + 24, centerY - 12, 4,
        centerX + 24, centerY - 8, 24
      )
      headGradient.addColorStop(0, catVeryLight)
      headGradient.addColorStop(0.3, catHighlight)
      headGradient.addColorStop(0.6, catLight)
      headGradient.addColorStop(0.85, catOrange)
      headGradient.addColorStop(1, catDark)

      ctx.fillStyle = headGradient
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetY = 3
      ctx.beginPath()
      ctx.ellipse(centerX + 24, centerY - 8, 24, 20, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowColor = 'transparent'

      // Face marking (white chest patch extending to face)
      ctx.fillStyle = white
      ctx.globalAlpha = 0.9
      ctx.beginPath()
      ctx.ellipse(centerX + 4, centerY + 16, 12, 16, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(centerX + 16, centerY + 4, 8, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // === SNOUT/MUZZLE ===
      const muzzleGradient = ctx.createRadialGradient(
        centerX + 32, centerY + 4, 2,
        centerX + 32, centerY + 4, 12
      )
      muzzleGradient.addColorStop(0, white)
      muzzleGradient.addColorStop(0.7, catVeryLight)
      muzzleGradient.addColorStop(1, catLight)

      ctx.fillStyle = muzzleGradient
      ctx.beginPath()
      ctx.ellipse(centerX + 32, centerY + 4, 12, 10, 0, 0, Math.PI * 2)
      ctx.fill()

      // Muzzle shadow/definition
      ctx.strokeStyle = catLight
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.arc(centerX + 32, centerY + 4, 10, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1.0

      // === NOSE (detailed with highlights) ===
      const noseGradient = ctx.createRadialGradient(
        centerX + 32, centerY + 8, 1,
        centerX + 32, centerY + 8, 4
      )
      noseGradient.addColorStop(0, pink)
      noseGradient.addColorStop(0.5, pinkDark)
      noseGradient.addColorStop(1, nose)

      ctx.fillStyle = noseGradient
      ctx.beginPath()
      ctx.moveTo(centerX + 32, centerY + 6)
      ctx.lineTo(centerX + 30, centerY + 10)
      ctx.lineTo(centerX + 34, centerY + 10)
      ctx.closePath()
      ctx.fill()

      // Nose highlight
      ctx.fillStyle = pink
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.arc(centerX + 31, centerY + 7, 1, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // === WHISKERS (fine lines) ===
      ctx.strokeStyle = darkGrey
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.6
      const whiskerSide = [1, -1]
      whiskerSide.forEach(side => {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(centerX + 30, centerY + 2 + i * 2)
          ctx.lineTo(centerX + 30 + side * 20, centerY + i * 2 - 2)
          ctx.stroke()
        }
      })
      ctx.globalAlpha = 1.0

      // === EARS (triangular with inner detail) ===
      // Left ear
      const earGradient = ctx.createLinearGradient(
        centerX + 8 + earAngle, centerY - 28,
        centerX + 8 + earAngle, centerY - 24
      )
      earGradient.addColorStop(0, catDark)
      earGradient.addColorStop(0.5, catOrange)
      earGradient.addColorStop(1, catLight)

      ctx.fillStyle = earGradient
      ctx.beginPath()
      ctx.moveTo(centerX + 8 + earAngle, centerY - 24)
      ctx.lineTo(centerX + 16 + earAngle, centerY - 44)
      ctx.lineTo(centerX + 24 + earAngle, centerY - 24)
      ctx.closePath()
      ctx.fill()

      // Left ear inner (pink)
      ctx.fillStyle = pinkDark
      ctx.globalAlpha = 0.7
      ctx.beginPath()
      ctx.moveTo(centerX + 12 + earAngle, centerY - 26)
      ctx.lineTo(centerX + 16 + earAngle, centerY - 38)
      ctx.lineTo(centerX + 20 + earAngle, centerY - 26)
      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Right ear
      ctx.fillStyle = earGradient
      ctx.beginPath()
      ctx.moveTo(centerX + 24 - earAngle, centerY - 24)
      ctx.lineTo(centerX + 32 - earAngle, centerY - 44)
      ctx.lineTo(centerX + 40 - earAngle, centerY - 24)
      ctx.closePath()
      ctx.fill()

      // Right ear inner (pink)
      ctx.fillStyle = pinkDark
      ctx.globalAlpha = 0.7
      ctx.beginPath()
      ctx.moveTo(centerX + 28 - earAngle, centerY - 26)
      ctx.lineTo(centerX + 32 - earAngle, centerY - 38)
      ctx.lineTo(centerX + 36 - earAngle, centerY - 26)
      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Ear tufts (fur detail)
      ctx.strokeStyle = catLight
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.moveTo(centerX + 16 + earAngle, centerY - 42)
      ctx.lineTo(centerX + 14 + earAngle, centerY - 36)
      ctx.moveTo(centerX + 16 + earAngle, centerY - 42)
      ctx.lineTo(centerX + 18 + earAngle, centerY - 36)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX + 32 - earAngle, centerY - 42)
      ctx.lineTo(centerX + 30 - earAngle, centerY - 36)
      ctx.moveTo(centerX + 32 - earAngle, centerY - 42)
      ctx.lineTo(centerX + 34 - earAngle, centerY - 36)
      ctx.stroke()
      ctx.globalAlpha = 1.0

      // === EYES (detailed with pupils and highlights) ===
      // Left eye
      const eyeWhiteGradient = ctx.createRadialGradient(
        centerX + 20, centerY - 4, 2,
        centerX + 20, centerY - 4, 6
      )
      eyeWhiteGradient.addColorStop(0, white)
      eyeWhiteGradient.addColorStop(1, catVeryLight)

      ctx.fillStyle = eyeWhiteGradient
      ctx.beginPath()
      ctx.ellipse(centerX + 20, centerY - 4, 6, 8, -0.2, 0, Math.PI * 2)
      ctx.fill()

      // Left eye iris
      const irisGradient = ctx.createRadialGradient(
        centerX + 20, centerY - 4, 1,
        centerX + 20, centerY - 4, 5
      )
      irisGradient.addColorStop(0, eyeGreen)
      irisGradient.addColorStop(0.6, eyeGreenDark)
      irisGradient.addColorStop(1, darkGrey)

      ctx.fillStyle = irisGradient
      ctx.beginPath()
      ctx.ellipse(centerX + 20, centerY - 4, 4, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Left eye pupil (vertical slit)
      ctx.fillStyle = black
      ctx.beginPath()
      ctx.ellipse(centerX + 20, centerY - 4, 1.5, 5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Left eye highlight
      ctx.fillStyle = white
      ctx.globalAlpha = 0.9
      ctx.beginPath()
      ctx.arc(centerX + 19, centerY - 6, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Right eye (mirrored)
      ctx.fillStyle = eyeWhiteGradient
      ctx.beginPath()
      ctx.ellipse(centerX + 28, centerY - 4, 6, 8, 0.2, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = irisGradient
      ctx.beginPath()
      ctx.ellipse(centerX + 28, centerY - 4, 4, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = black
      ctx.beginPath()
      ctx.ellipse(centerX + 28, centerY - 4, 1.5, 5, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = white
      ctx.globalAlpha = 0.9
      ctx.beginPath()
      ctx.arc(centerX + 27, centerY - 6, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Eye outlines for definition
      ctx.strokeStyle = darkGrey
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.ellipse(centerX + 20, centerY - 4, 6, 8, -0.2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(centerX + 28, centerY - 4, 6, 8, 0.2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1.0

      ctx.restore()
    }

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

    // Row 2: Jump and Land animations
    // Jump (frames 12-15) - ascending, mid-air, descending
    // Frame 12: Crouch before jump (preparing to leap)
    drawCatFrame(0, 2, 0, 2, 1, 1, -2) // crouched, ready to jump

    // Frame 13: Jump start (pushing off, extended)
    drawCatFrame(1, 2, 0, 0, -1, -3, -2) // extended body, tail down

    // Frame 14: Mid-air (stretched out, flying)
    drawCatFrame(2, 2, 1, -2, -2, -4, 0) // fully extended, ears back, horizontal

    // Frame 15: Descent (body curling for landing)
    drawCatFrame(3, 2, 0, 0, 1, -2, 2) // curling, tail up

    // Land (frames 16-17) - landing and recovery
    // Frame 16: Impact (compressed on landing)
    drawCatFrame(4, 2, 0, 3, 1, 2, 1) // compressed, absorbing impact

    // Frame 17: Recovery (straightening up)
    drawCatFrame(5, 2, 0, 1, 0, 1, 0) // returning to normal stance

    // Create texture with LINEAR filtering for smooth, anti-aliased appearance
    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter // Smooth scaling (upgraded from NearestFilter)
    texture.minFilter = THREE.LinearMipmapLinearFilter // Smooth min with mipmaps
    texture.generateMipmaps = true // Enable mipmaps for better quality at distance
    texture.flipY = false // Don't flip canvas texture
    texture.needsUpdate = true

    console.log('🎨 Created HIGH-RES cat sprite sheet:', columns, 'x', rows, 'frames at', frameSize, 'x', frameSize, 'px')

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
    const woodHighlight = '#A68A5C'
    const shadow = 'rgba(0, 0, 0, 0.6)'
    const shadowLight = 'rgba(0, 0, 0, 0.3)'

    // Table/furniture (side view with space underneath)
    // Table top with realistic wood gradient
    const topGradient = ctx.createLinearGradient(4, 18, 4, 24)
    topGradient.addColorStop(0, woodHighlight)
    topGradient.addColorStop(0.3, woodLight)
    topGradient.addColorStop(0.8, woodBrown)
    topGradient.addColorStop(1, woodDark)
    ctx.fillStyle = topGradient
    ctx.fillRect(4, 18, 56, 6)

    // Table top edge (3D effect) - top beveled edge
    ctx.fillStyle = woodHighlight
    ctx.beginPath()
    ctx.moveTo(4, 18)
    ctx.lineTo(60, 18)
    ctx.lineTo(58, 19)
    ctx.lineTo(6, 19)
    ctx.fill()

    // Table top front edge (3D depth)
    ctx.fillStyle = woodDark
    ctx.beginPath()
    ctx.moveTo(4, 24)
    ctx.lineTo(60, 24)
    ctx.lineTo(60, 26)
    ctx.lineTo(4, 26)
    ctx.fill()

    // Wood grain lines on table top
    ctx.strokeStyle = woodDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.3
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.moveTo(8 + i * 9, 20)
      ctx.quadraticCurveTo(10 + i * 9, 21, 12 + i * 9, 22)
      ctx.stroke()
    }
    ctx.globalAlpha = 1.0

    // Wood knots on table top
    ctx.fillStyle = woodDark
    ctx.globalAlpha = 0.4
    ctx.beginPath()
    ctx.ellipse(25, 21, 2, 1.5, 0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(45, 21, 2, 1.5, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Left leg with gradient for roundness
    const leftLegGradient = ctx.createLinearGradient(8, 24, 14, 24)
    leftLegGradient.addColorStop(0, woodDark)
    leftLegGradient.addColorStop(0.3, woodBrown)
    leftLegGradient.addColorStop(0.7, woodLight)
    leftLegGradient.addColorStop(1, woodBrown)
    ctx.fillStyle = leftLegGradient
    ctx.fillRect(8, 24, 6, 36)

    // Left leg shadow (inner side)
    ctx.fillStyle = woodDark
    ctx.globalAlpha = 0.4
    ctx.fillRect(8, 26, 2, 34)
    ctx.globalAlpha = 1.0

    // Left leg highlight (outer side)
    ctx.fillStyle = woodLight
    ctx.globalAlpha = 0.3
    ctx.fillRect(12, 26, 1, 34)
    ctx.globalAlpha = 1.0

    // Right leg with gradient
    const rightLegGradient = ctx.createLinearGradient(50, 24, 56, 24)
    rightLegGradient.addColorStop(0, woodBrown)
    rightLegGradient.addColorStop(0.3, woodLight)
    rightLegGradient.addColorStop(0.7, woodBrown)
    rightLegGradient.addColorStop(1, woodDark)
    ctx.fillStyle = rightLegGradient
    ctx.fillRect(50, 24, 6, 36)

    // Right leg shadow (inner side)
    ctx.fillStyle = woodDark
    ctx.globalAlpha = 0.4
    ctx.fillRect(54, 26, 2, 34)
    ctx.globalAlpha = 1.0

    // Right leg highlight (outer side)
    ctx.fillStyle = woodLight
    ctx.globalAlpha = 0.3
    ctx.fillRect(51, 26, 1, 34)
    ctx.globalAlpha = 1.0

    // Shadow underneath (hiding space) with gradient
    const shadowGradient = ctx.createRadialGradient(32, 40, 5, 32, 45, 18)
    shadowGradient.addColorStop(0, shadow)
    shadowGradient.addColorStop(0.6, shadowLight)
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)')
    ctx.fillStyle = shadowGradient
    ctx.fillRect(14, 32, 36, 24)

    // Darker shadow in the very center (deepest part)
    ctx.fillStyle = shadow
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.ellipse(32, 44, 12, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Hide here indicator (subtle, dashed outline)
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.6
    ctx.setLineDash([4, 4])
    ctx.strokeRect(16, 34, 32, 20)
    ctx.setLineDash([])
    ctx.globalAlpha = 1.0

    // Add "cat icon" or indicator in hiding spot
    ctx.fillStyle = '#FFFFFF'
    ctx.globalAlpha = 0.3
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🐱', 32, 46)
    ctx.globalAlpha = 1.0

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
    const curtainHighlight = '#DC7C7C'
    const rodBrown = '#654321'
    const rodLight = '#8B6F47'
    const rodDark = '#4a3419'

    // Curtain rod with gradient for metallic/wood effect
    const rodGradient = ctx.createLinearGradient(4, 4, 4, 8)
    rodGradient.addColorStop(0, rodLight)
    rodGradient.addColorStop(0.5, rodBrown)
    rodGradient.addColorStop(1, rodDark)
    ctx.fillStyle = rodGradient
    ctx.fillRect(4, 4, 56, 4)

    // Rod highlight (shine)
    ctx.fillStyle = rodLight
    ctx.globalAlpha = 0.6
    ctx.fillRect(4, 4, 56, 1)
    ctx.globalAlpha = 1.0

    // Rod ends (decorative) with depth
    // Left end
    const leftEndGradient = ctx.createRadialGradient(4, 6, 1, 4, 6, 4)
    leftEndGradient.addColorStop(0, rodLight)
    leftEndGradient.addColorStop(0.6, rodBrown)
    leftEndGradient.addColorStop(1, rodDark)
    ctx.fillStyle = leftEndGradient
    ctx.beginPath()
    ctx.arc(4, 6, 4, 0, Math.PI * 2)
    ctx.fill()

    // Left end highlight
    ctx.fillStyle = rodLight
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.arc(3, 5, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Right end
    const rightEndGradient = ctx.createRadialGradient(60, 6, 1, 60, 6, 4)
    rightEndGradient.addColorStop(0, rodLight)
    rightEndGradient.addColorStop(0.6, rodBrown)
    rightEndGradient.addColorStop(1, rodDark)
    ctx.fillStyle = rightEndGradient
    ctx.beginPath()
    ctx.arc(60, 6, 4, 0, Math.PI * 2)
    ctx.fill()

    // Right end highlight
    ctx.fillStyle = rodLight
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.arc(59, 5, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Curtain folds (multiple vertical strips) with realistic fabric shading
    for (let i = 0; i < 6; i++) {
      const x = 6 + i * 9
      const offset = Math.sin(i * 0.5) * 2

      // Deep shadow fold (darkest)
      const darkFoldGradient = ctx.createLinearGradient(x + offset - 2, 8, x + offset + 2, 8)
      darkFoldGradient.addColorStop(0, curtainRed)
      darkFoldGradient.addColorStop(0.5, curtainDark)
      darkFoldGradient.addColorStop(1, curtainRed)
      ctx.fillStyle = darkFoldGradient
      ctx.beginPath()
      ctx.moveTo(x + offset, 8)
      ctx.lineTo(x + offset - 2, 60)
      ctx.lineTo(x + offset + 2, 60)
      ctx.lineTo(x + offset + 4, 8)
      ctx.fill()

      // Shadow gradient on fold edge
      ctx.fillStyle = curtainDark
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.moveTo(x + offset, 8)
      ctx.lineTo(x + offset - 1, 60)
      ctx.lineTo(x + offset + 1, 60)
      ctx.lineTo(x + offset + 2, 8)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Light fold (highlighted part)
      const lightFoldGradient = ctx.createLinearGradient(x + offset + 4, 8, x + offset + 8, 8)
      lightFoldGradient.addColorStop(0, curtainRed)
      lightFoldGradient.addColorStop(0.3, curtainLight)
      lightFoldGradient.addColorStop(0.7, curtainLight)
      lightFoldGradient.addColorStop(1, curtainRed)
      ctx.fillStyle = lightFoldGradient
      ctx.beginPath()
      ctx.moveTo(x + offset + 4, 8)
      ctx.lineTo(x + offset + 2, 60)
      ctx.lineTo(x + offset + 6, 60)
      ctx.lineTo(x + offset + 8, 8)
      ctx.fill()

      // Fabric highlight (catch light)
      ctx.fillStyle = curtainHighlight
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.moveTo(x + offset + 5, 8)
      ctx.lineTo(x + offset + 3.5, 60)
      ctx.lineTo(x + offset + 5, 60)
      ctx.lineTo(x + offset + 6.5, 8)
      ctx.fill()
      ctx.globalAlpha = 1.0

      // Main curtain (base color)
      const mainFoldGradient = ctx.createLinearGradient(x + offset + 8, 8, x + offset + 12, 8)
      mainFoldGradient.addColorStop(0, curtainLight)
      mainFoldGradient.addColorStop(0.5, curtainRed)
      mainFoldGradient.addColorStop(1, curtainDark)
      ctx.fillStyle = mainFoldGradient
      ctx.beginPath()
      ctx.moveTo(x + offset + 8, 8)
      ctx.lineTo(x + offset + 6, 60)
      ctx.lineTo(x + offset + 10, 60)
      ctx.lineTo(x + offset + 12, 8)
      ctx.fill()

      // Fabric texture lines (subtle weave)
      ctx.strokeStyle = curtainDark
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.2
      for (let j = 0; j < 10; j++) {
        ctx.beginPath()
        ctx.moveTo(x + offset, 10 + j * 5)
        ctx.lineTo(x + offset + 12, 10 + j * 5)
        ctx.stroke()
      }
      ctx.globalAlpha = 1.0
    }

    // Bottom hem shadow
    ctx.fillStyle = curtainDark
    ctx.globalAlpha = 0.4
    ctx.fillRect(4, 58, 56, 2)
    ctx.globalAlpha = 1.0

    // Overall fabric shadow variation (depth)
    ctx.fillStyle = curtainDark
    ctx.globalAlpha = 0.1
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(6 + Math.random() * 52, 10 + Math.random() * 48, 1, 2)
    }
    ctx.globalAlpha = 1.0

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

    // Dark shadow area with complex gradient effect for realistic darkness
    const gradient = ctx.createRadialGradient(32, 32, 5, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)')
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.7)')
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.4)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    // Additional darker spots for depth variation
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.beginPath()
    ctx.ellipse(20, 25, 8, 6, 0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(44, 28, 8, 6, -0.3, 0, Math.PI * 2)
    ctx.fill()

    // Very dark core (deepest shadow)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.beginPath()
    ctx.ellipse(32, 36, 10, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // Moonlight edge (to show it's a shadow) with softer glow
    const moonlightGradient = ctx.createLinearGradient(0, 10, 0, 15)
    moonlightGradient.addColorStop(0, 'rgba(200, 200, 255, 0.4)')
    moonlightGradient.addColorStop(1, 'rgba(200, 200, 255, 0)')
    ctx.strokeStyle = moonlightGradient
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(0, 10)
    ctx.quadraticCurveTo(32, 20, 64, 10)
    ctx.stroke()

    // Secondary moonlight edge (stronger highlight)
    ctx.strokeStyle = 'rgba(220, 220, 255, 0.4)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 10)
    ctx.quadraticCurveTo(32, 18, 64, 10)
    ctx.stroke()

    // Ambient light scatter (small spots)
    ctx.fillStyle = 'rgba(180, 180, 220, 0.15)'
    ctx.globalAlpha = 0.5
    for (let i = 0; i < 8; i++) {
      const x = 10 + Math.random() * 44
      const y = 8 + Math.random() * 15
      ctx.beginPath()
      ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1.0

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
    const vaseHighlight = '#FFD0DD'
    const white = '#FFFFFF'

    // Vase base with gradient
    const baseGradient = ctx.createLinearGradient(20, 54, 44, 54)
    baseGradient.addColorStop(0, vaseDark)
    baseGradient.addColorStop(0.5, vasePink)
    baseGradient.addColorStop(1, vaseDark)
    ctx.fillStyle = baseGradient
    ctx.fillRect(20, 54, 24, 6)

    // Base shadow underneath
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(19, 59, 26, 2)

    // Vase body (curved) with realistic gradient
    const bodyGradient = ctx.createRadialGradient(28, 40, 5, 32, 40, 15)
    bodyGradient.addColorStop(0, vaseHighlight)
    bodyGradient.addColorStop(0.3, vaseLight)
    bodyGradient.addColorStop(0.6, vasePink)
    bodyGradient.addColorStop(1, vaseDark)
    ctx.fillStyle = bodyGradient
    ctx.beginPath()
    ctx.moveTo(22, 54)
    ctx.quadraticCurveTo(18, 40, 22, 26)
    ctx.lineTo(42, 26)
    ctx.quadraticCurveTo(46, 40, 42, 54)
    ctx.fill()

    // Vase texture (subtle ceramic pattern)
    ctx.strokeStyle = vaseDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.1
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      ctx.arc(32, 30 + i * 3, 8 - i * 0.5, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.globalAlpha = 1.0

    // Vase neck with gradient
    const neckGradient = ctx.createLinearGradient(26, 18, 38, 18)
    neckGradient.addColorStop(0, vaseDark)
    neckGradient.addColorStop(0.3, vasePink)
    neckGradient.addColorStop(0.7, vasePink)
    neckGradient.addColorStop(1, vaseDark)
    ctx.fillStyle = neckGradient
    ctx.fillRect(26, 18, 12, 8)

    // Vase rim with depth
    ctx.fillStyle = vaseDark
    ctx.fillRect(24, 16, 16, 2)

    // Rim highlight
    ctx.fillStyle = vaseLight
    ctx.globalAlpha = 0.6
    ctx.fillRect(24, 16, 16, 1)
    ctx.globalAlpha = 1.0

    // Prominent shine/highlight (ceramic reflection)
    const shineGradient = ctx.createRadialGradient(28, 32, 0, 28, 35, 10)
    shineGradient.addColorStop(0, white)
    shineGradient.addColorStop(0.3, vaseHighlight)
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = shineGradient
    ctx.beginPath()
    ctx.ellipse(28, 35, 5, 12, 0, 0, Math.PI * 2)
    ctx.fill()

    // Secondary smaller shine
    ctx.fillStyle = white
    ctx.globalAlpha = 0.4
    ctx.beginPath()
    ctx.ellipse(27, 30, 2, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Decorative pattern with shadow
    ctx.strokeStyle = white
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.arc(32, 42, 6, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Pattern shadow
    ctx.strokeStyle = vaseDark
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.2
    ctx.beginPath()
    ctx.arc(33, 43, 6, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Flowers in vase
    ctx.fillStyle = '#FF6347'
    ctx.beginPath()
    ctx.arc(28, 12, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(36, 10, 3, 0, Math.PI * 2)
    ctx.fill()

    // Flower highlights
    ctx.fillStyle = '#FF8C69'
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.arc(27, 11, 1.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(35, 9, 1.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Flower stems with thickness variation
    ctx.strokeStyle = '#228B22'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(28, 12)
    ctx.lineTo(28, 20)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(36, 10)
    ctx.lineTo(36, 20)
    ctx.stroke()

    // Leaves on stems
    ctx.fillStyle = '#32CD32'
    ctx.beginPath()
    ctx.ellipse(26, 16, 2, 3, -0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(38, 15, 2, 3, 0.5, 0, Math.PI * 2)
    ctx.fill()

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
    const bookRedDark = '#5C0000'
    const bookRedLight = '#A52A2A'
    const bookBrown = '#654321'
    const bookBrownDark = '#4a3419'
    const bookBrownLight = '#8B6F47'
    const bookBlue = '#191970'
    const bookBlueDark = '#0c0c38'
    const bookBlueLight = '#2C3E8C'
    const paper = '#FFF8DC'
    const paperDark = '#F5E6C8'
    const gold = '#FFD700'

    // Stack of 3 books with realistic gradients
    // Bottom book (brown)
    const brownBookGradient = ctx.createLinearGradient(12, 48, 52, 48)
    brownBookGradient.addColorStop(0, bookBrownDark)
    brownBookGradient.addColorStop(0.3, bookBrown)
    brownBookGradient.addColorStop(0.7, bookBrown)
    brownBookGradient.addColorStop(1, bookBrownDark)
    ctx.fillStyle = brownBookGradient
    ctx.fillRect(12, 48, 40, 10)

    // Book cover depth/shadow
    ctx.fillStyle = bookBrownDark
    ctx.globalAlpha = 0.4
    ctx.fillRect(12, 56, 40, 2)
    ctx.globalAlpha = 1.0

    // Pages with gradient
    const pagesGradient = ctx.createLinearGradient(52, 48, 54, 48)
    pagesGradient.addColorStop(0, paperDark)
    pagesGradient.addColorStop(1, paper)
    ctx.fillStyle = pagesGradient
    ctx.fillRect(52, 48, 2, 10)

    // Page lines
    ctx.strokeStyle = paperDark
    ctx.lineWidth = 0.5
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.moveTo(52, 49 + i * 2)
      ctx.lineTo(54, 49 + i * 2)
      ctx.stroke()
    }

    // Spine with gradient
    const brownSpineGradient = ctx.createLinearGradient(12, 48, 16, 48)
    brownSpineGradient.addColorStop(0, bookBrownDark)
    brownSpineGradient.addColorStop(1, bookBrown)
    ctx.fillStyle = brownSpineGradient
    ctx.fillRect(12, 48, 4, 10)

    // Spine highlights
    ctx.fillStyle = bookBrownLight
    ctx.globalAlpha = 0.3
    ctx.fillRect(13, 49, 1, 8)
    ctx.globalAlpha = 1.0

    // Title line with shadow
    ctx.fillStyle = gold
    ctx.fillRect(20, 52, 24, 2)
    ctx.fillStyle = '#DAA520' // darker gold
    ctx.fillRect(20, 53, 24, 1)

    // Cover texture
    ctx.fillStyle = bookBrownDark
    ctx.globalAlpha = 0.1
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(14 + Math.random() * 36, 49 + Math.random() * 8, 1, 1)
    }
    ctx.globalAlpha = 1.0

    // Middle book (blue)
    const blueBookGradient = ctx.createLinearGradient(16, 38, 52, 38)
    blueBookGradient.addColorStop(0, bookBlueDark)
    blueBookGradient.addColorStop(0.3, bookBlue)
    blueBookGradient.addColorStop(0.7, bookBlue)
    blueBookGradient.addColorStop(1, bookBlueDark)
    ctx.fillStyle = blueBookGradient
    ctx.fillRect(16, 38, 36, 10)

    // Book cover depth/shadow
    ctx.fillStyle = bookBlueDark
    ctx.globalAlpha = 0.4
    ctx.fillRect(16, 46, 36, 2)
    ctx.globalAlpha = 1.0

    // Pages
    const pagesGradient2 = ctx.createLinearGradient(52, 38, 54, 38)
    pagesGradient2.addColorStop(0, paperDark)
    pagesGradient2.addColorStop(1, paper)
    ctx.fillStyle = pagesGradient2
    ctx.fillRect(52, 38, 2, 10)

    // Page lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = paperDark
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(52, 39 + i * 2)
      ctx.lineTo(54, 39 + i * 2)
      ctx.stroke()
    }

    // Spine
    const blueSpineGradient = ctx.createLinearGradient(16, 38, 20, 38)
    blueSpineGradient.addColorStop(0, bookBlueDark)
    blueSpineGradient.addColorStop(1, bookBlue)
    ctx.fillStyle = blueSpineGradient
    ctx.fillRect(16, 38, 4, 10)

    // Spine highlights
    ctx.fillStyle = bookBlueLight
    ctx.globalAlpha = 0.3
    ctx.fillRect(17, 39, 1, 8)
    ctx.globalAlpha = 1.0

    // Title
    ctx.fillStyle = gold
    ctx.fillRect(24, 42, 20, 2)
    ctx.fillStyle = '#DAA520'
    ctx.fillRect(24, 43, 20, 1)

    // Cover texture
    ctx.fillStyle = bookBlueDark
    ctx.globalAlpha = 0.1
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(18 + Math.random() * 32, 39 + Math.random() * 8, 1, 1)
    }
    ctx.globalAlpha = 1.0

    // Top book (red)
    const redBookGradient = ctx.createLinearGradient(20, 28, 52, 28)
    redBookGradient.addColorStop(0, bookRedDark)
    redBookGradient.addColorStop(0.3, bookRed)
    redBookGradient.addColorStop(0.7, bookRed)
    redBookGradient.addColorStop(1, bookRedDark)
    ctx.fillStyle = redBookGradient
    ctx.fillRect(20, 28, 32, 10)

    // Book cover depth/shadow
    ctx.fillStyle = bookRedDark
    ctx.globalAlpha = 0.4
    ctx.fillRect(20, 36, 32, 2)
    ctx.globalAlpha = 1.0

    // Pages
    const pagesGradient3 = ctx.createLinearGradient(52, 28, 54, 28)
    pagesGradient3.addColorStop(0, paperDark)
    pagesGradient3.addColorStop(1, paper)
    ctx.fillStyle = pagesGradient3
    ctx.fillRect(52, 28, 2, 10)

    // Page lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = paperDark
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(52, 29 + i * 2)
      ctx.lineTo(54, 29 + i * 2)
      ctx.stroke()
    }

    // Spine
    const redSpineGradient = ctx.createLinearGradient(20, 28, 24, 28)
    redSpineGradient.addColorStop(0, bookRedDark)
    redSpineGradient.addColorStop(1, bookRed)
    ctx.fillStyle = redSpineGradient
    ctx.fillRect(20, 28, 4, 10)

    // Spine highlights
    ctx.fillStyle = bookRedLight
    ctx.globalAlpha = 0.3
    ctx.fillRect(21, 29, 1, 8)
    ctx.globalAlpha = 1.0

    // Title
    ctx.fillStyle = gold
    ctx.fillRect(28, 32, 16, 2)
    ctx.fillStyle = '#DAA520'
    ctx.fillRect(28, 33, 16, 1)

    // Cover texture and wear marks
    ctx.fillStyle = bookRedDark
    ctx.globalAlpha = 0.1
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(22 + Math.random() * 28, 29 + Math.random() * 8, 1, 1)
    }
    ctx.globalAlpha = 1.0

    // Wear corner
    ctx.fillStyle = bookRedLight
    ctx.globalAlpha = 0.3
    ctx.beginPath()
    ctx.moveTo(52, 28)
    ctx.lineTo(48, 28)
    ctx.lineTo(52, 32)
    ctx.fill()
    ctx.globalAlpha = 1.0

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
    const frameLight = '#FFED4E'
    const picture = '#87CEEB'
    const pictureDark = '#4682B4'
    const pictureLight = '#B0E0E6'
    const white = '#FFFFFF'

    // Frame shadow (behind)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(10, 10, 48, 48)

    // Frame outer border (ornate gold) with gradient
    const outerFrameGradient = ctx.createRadialGradient(32, 32, 15, 32, 32, 30)
    outerFrameGradient.addColorStop(0, frameLight)
    outerFrameGradient.addColorStop(0.5, frameGold)
    outerFrameGradient.addColorStop(1, frameDark)
    ctx.fillStyle = outerFrameGradient
    ctx.fillRect(8, 8, 48, 48)

    // Frame 3D effect (beveled edges)
    // Top bevel
    ctx.fillStyle = frameLight
    ctx.beginPath()
    ctx.moveTo(8, 8)
    ctx.lineTo(56, 8)
    ctx.lineTo(52, 12)
    ctx.lineTo(12, 12)
    ctx.fill()

    // Left bevel
    ctx.beginPath()
    ctx.moveTo(8, 8)
    ctx.lineTo(12, 12)
    ctx.lineTo(12, 52)
    ctx.lineTo(8, 56)
    ctx.fill()

    // Bottom bevel (darker)
    ctx.fillStyle = frameDark
    ctx.beginPath()
    ctx.moveTo(8, 56)
    ctx.lineTo(56, 56)
    ctx.lineTo(52, 52)
    ctx.lineTo(12, 52)
    ctx.fill()

    // Right bevel (darker)
    ctx.beginPath()
    ctx.moveTo(56, 8)
    ctx.lineTo(56, 56)
    ctx.lineTo(52, 52)
    ctx.lineTo(52, 12)
    ctx.fill()

    // Frame inner (darker)
    const innerFrameGradient = ctx.createRadialGradient(32, 32, 10, 32, 32, 20)
    innerFrameGradient.addColorStop(0, frameDark)
    innerFrameGradient.addColorStop(1, frameGold)
    ctx.fillStyle = innerFrameGradient
    ctx.fillRect(10, 10, 44, 44)

    // Frame decorative corners with highlights
    // Top-left corner ornament
    ctx.fillStyle = frameLight
    ctx.beginPath()
    ctx.arc(12, 12, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = frameGold
    ctx.beginPath()
    ctx.arc(12, 12, 2, 0, Math.PI * 2)
    ctx.fill()

    // Top-right corner
    ctx.fillStyle = frameLight
    ctx.beginPath()
    ctx.arc(52, 12, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = frameGold
    ctx.beginPath()
    ctx.arc(52, 12, 2, 0, Math.PI * 2)
    ctx.fill()

    // Bottom-left corner
    ctx.fillStyle = frameLight
    ctx.beginPath()
    ctx.arc(12, 52, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = frameGold
    ctx.beginPath()
    ctx.arc(12, 52, 2, 0, Math.PI * 2)
    ctx.fill()

    // Bottom-right corner
    ctx.fillStyle = frameLight
    ctx.beginPath()
    ctx.arc(52, 52, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = frameGold
    ctx.beginPath()
    ctx.arc(52, 52, 2, 0, Math.PI * 2)
    ctx.fill()

    // Picture inside (landscape with gradient sky)
    const skyGradient = ctx.createLinearGradient(14, 14, 14, 50)
    skyGradient.addColorStop(0, pictureLight)
    skyGradient.addColorStop(0.5, picture)
    skyGradient.addColorStop(1, pictureDark)
    ctx.fillStyle = skyGradient
    ctx.fillRect(14, 14, 36, 36)

    // Mountains with shading
    // Back mountain (darker)
    ctx.fillStyle = pictureDark
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.moveTo(14, 42)
    ctx.lineTo(26, 24)
    ctx.lineTo(38, 42)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Mountain highlight
    ctx.fillStyle = picture
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(24, 28)
    ctx.lineTo(26, 24)
    ctx.lineTo(28, 30)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Front mountain
    ctx.fillStyle = pictureDark
    ctx.beginPath()
    ctx.moveTo(28, 42)
    ctx.lineTo(38, 28)
    ctx.lineTo(50, 42)
    ctx.fill()

    // Front mountain highlight
    ctx.fillStyle = '#6495ED'
    ctx.globalAlpha = 0.4
    ctx.beginPath()
    ctx.moveTo(36, 32)
    ctx.lineTo(38, 28)
    ctx.lineTo(40, 34)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Sun with glow
    const sunGradient = ctx.createRadialGradient(42, 20, 2, 42, 20, 6)
    sunGradient.addColorStop(0, '#FFFFCC')
    sunGradient.addColorStop(0.5, '#FFFF00')
    sunGradient.addColorStop(1, 'rgba(255, 255, 0, 0)')
    ctx.fillStyle = sunGradient
    ctx.beginPath()
    ctx.arc(42, 20, 6, 0, Math.PI * 2)
    ctx.fill()

    // Sun core
    ctx.fillStyle = white
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.arc(42, 20, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Glass reflection effect
    ctx.fillStyle = white
    ctx.globalAlpha = 0.1
    ctx.fillRect(14, 14, 36, 18)
    ctx.globalAlpha = 0.2
    ctx.beginPath()
    ctx.moveTo(14, 14)
    ctx.lineTo(50, 14)
    ctx.lineTo(14, 50)
    ctx.fill()
    ctx.globalAlpha = 1.0

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
    const potLight = '#A0653C'
    const leafGreen = '#228B22'
    const leafDark = '#006400'
    const leafLight = '#32CD32'
    const soil = '#3d2817'
    const soilLight = '#5a3a25'

    // Pot shadow underneath
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(19, 57, 26, 4)

    // Pot with gradient for roundness
    const potGradient = ctx.createRadialGradient(32, 48, 5, 32, 48, 14)
    potGradient.addColorStop(0, potLight)
    potGradient.addColorStop(0.5, potRed)
    potGradient.addColorStop(1, potDark)
    ctx.fillStyle = potGradient
    ctx.beginPath()
    ctx.moveTo(22, 54)
    ctx.quadraticCurveTo(20, 48, 22, 42)
    ctx.lineTo(42, 42)
    ctx.quadraticCurveTo(44, 48, 42, 54)
    ctx.fill()

    // Pot side shadows
    ctx.fillStyle = potDark
    ctx.globalAlpha = 0.4
    ctx.beginPath()
    ctx.moveTo(22, 54)
    ctx.quadraticCurveTo(20, 48, 22, 42)
    ctx.lineTo(24, 42)
    ctx.quadraticCurveTo(23, 48, 24, 54)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Pot highlights
    ctx.fillStyle = potLight
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.ellipse(28, 46, 3, 6, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0

    // Pot rim with depth
    const rimGradient = ctx.createLinearGradient(20, 40, 44, 40)
    rimGradient.addColorStop(0, potDark)
    rimGradient.addColorStop(0.3, potRed)
    rimGradient.addColorStop(0.7, potRed)
    rimGradient.addColorStop(1, potDark)
    ctx.fillStyle = rimGradient
    ctx.fillRect(20, 40, 24, 2)

    // Rim highlight
    ctx.fillStyle = potLight
    ctx.globalAlpha = 0.6
    ctx.fillRect(20, 40, 24, 1)
    ctx.globalAlpha = 1.0

    // Soil with texture
    const soilGradient = ctx.createLinearGradient(22, 40, 42, 40)
    soilGradient.addColorStop(0, potDark)
    soilGradient.addColorStop(0.3, soil)
    soilGradient.addColorStop(0.7, soil)
    soilGradient.addColorStop(1, potDark)
    ctx.fillStyle = soilGradient
    ctx.fillRect(22, 40, 20, 4)

    // Soil texture (particles)
    ctx.fillStyle = soilLight
    ctx.globalAlpha = 0.4
    for (let i = 0; i < 15; i++) {
      ctx.fillRect(23 + Math.random() * 18, 40 + Math.random() * 3, 1, 1)
    }
    ctx.globalAlpha = 1.0

    // Plant stem with thickness variation and shading
    const stemGradient = ctx.createLinearGradient(32, 40, 34, 40)
    stemGradient.addColorStop(0, leafDark)
    stemGradient.addColorStop(1, leafGreen)
    ctx.strokeStyle = stemGradient
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(32, 40)
    ctx.lineTo(32, 20)
    ctx.stroke()

    // Stem highlight
    ctx.strokeStyle = leafLight
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(31, 38)
    ctx.lineTo(31, 22)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Leaves (multiple) with gradients and veins
    // Left leaves
    // Bottom left leaf
    const leaf1Gradient = ctx.createRadialGradient(24, 32, 1, 24, 32, 6)
    leaf1Gradient.addColorStop(0, leafLight)
    leaf1Gradient.addColorStop(0.5, leafGreen)
    leaf1Gradient.addColorStop(1, leafDark)
    ctx.fillStyle = leaf1Gradient
    ctx.beginPath()
    ctx.ellipse(24, 32, 6, 3, -0.5, 0, Math.PI * 2)
    ctx.fill()

    // Leaf vein
    ctx.strokeStyle = leafDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(28, 32)
    ctx.lineTo(20, 32)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Middle left leaf
    const leaf2Gradient = ctx.createRadialGradient(22, 26, 1, 22, 26, 7)
    leaf2Gradient.addColorStop(0, leafLight)
    leaf2Gradient.addColorStop(0.5, leafGreen)
    leaf2Gradient.addColorStop(1, leafDark)
    ctx.fillStyle = leaf2Gradient
    ctx.beginPath()
    ctx.ellipse(22, 26, 7, 4, -0.7, 0, Math.PI * 2)
    ctx.fill()

    // Leaf vein
    ctx.strokeStyle = leafDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(27, 26)
    ctx.lineTo(17, 26)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Top left leaf
    const leaf3Gradient = ctx.createRadialGradient(24, 20, 1, 24, 20, 6)
    leaf3Gradient.addColorStop(0, leafLight)
    leaf3Gradient.addColorStop(0.5, leafGreen)
    leaf3Gradient.addColorStop(1, leafDark)
    ctx.fillStyle = leaf3Gradient
    ctx.beginPath()
    ctx.ellipse(24, 20, 6, 3, -0.4, 0, Math.PI * 2)
    ctx.fill()

    // Leaf vein
    ctx.strokeStyle = leafDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(28, 20)
    ctx.lineTo(20, 20)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Right leaves
    // Bottom right leaf
    const leaf4Gradient = ctx.createRadialGradient(40, 34, 1, 40, 34, 6)
    leaf4Gradient.addColorStop(0, leafLight)
    leaf4Gradient.addColorStop(0.5, leafGreen)
    leaf4Gradient.addColorStop(1, leafDark)
    ctx.fillStyle = leaf4Gradient
    ctx.beginPath()
    ctx.ellipse(40, 34, 6, 3, 0.5, 0, Math.PI * 2)
    ctx.fill()

    // Leaf vein
    ctx.strokeStyle = leafDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(36, 34)
    ctx.lineTo(44, 34)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Middle right leaf
    const leaf5Gradient = ctx.createRadialGradient(42, 28, 1, 42, 28, 7)
    leaf5Gradient.addColorStop(0, leafLight)
    leaf5Gradient.addColorStop(0.5, leafGreen)
    leaf5Gradient.addColorStop(1, leafDark)
    ctx.fillStyle = leaf5Gradient
    ctx.beginPath()
    ctx.ellipse(42, 28, 7, 4, 0.7, 0, Math.PI * 2)
    ctx.fill()

    // Leaf vein
    ctx.strokeStyle = leafDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(37, 28)
    ctx.lineTo(47, 28)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Top right leaf
    const leaf6Gradient = ctx.createRadialGradient(40, 22, 1, 40, 22, 6)
    leaf6Gradient.addColorStop(0, leafLight)
    leaf6Gradient.addColorStop(0.5, leafGreen)
    leaf6Gradient.addColorStop(1, leafDark)
    ctx.fillStyle = leaf6Gradient
    ctx.beginPath()
    ctx.ellipse(40, 22, 6, 3, 0.4, 0, Math.PI * 2)
    ctx.fill()

    // Leaf vein
    ctx.strokeStyle = leafDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(36, 22)
    ctx.lineTo(44, 22)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Top center leaves
    const leaf7Gradient = ctx.createRadialGradient(32, 16, 1, 32, 16, 5)
    leaf7Gradient.addColorStop(0, leafLight)
    leaf7Gradient.addColorStop(0.5, leafGreen)
    leaf7Gradient.addColorStop(1, leafDark)
    ctx.fillStyle = leaf7Gradient
    ctx.beginPath()
    ctx.ellipse(32, 16, 5, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // Main vein
    ctx.strokeStyle = leafDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(32, 10)
    ctx.lineTo(32, 22)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Leaf shine/highlights on various leaves
    ctx.fillStyle = leafLight
    ctx.globalAlpha = 0.4
    ctx.beginPath()
    ctx.ellipse(23, 25, 2, 3, -0.7, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(41, 27, 2, 3, 0.7, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(31, 14, 2, 3, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0

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
    const carpetHighlight = '#BB5665'

    // Base carpet color with subtle gradient
    const baseGradient = ctx.createRadialGradient(32, 32, 10, 32, 32, 40)
    baseGradient.addColorStop(0, carpetLight)
    baseGradient.addColorStop(0.6, carpetRed)
    baseGradient.addColorStop(1, carpetDark)
    ctx.fillStyle = baseGradient
    ctx.fillRect(0, 0, size, size)

    // Carpet pattern (diamond/square pattern) with depth
    ctx.strokeStyle = carpetDark
    ctx.lineWidth = 2

    // Diamond pattern with shadows
    for (let x = -size; x < size * 2; x += 16) {
      for (let y = -size; y < size * 2; y += 16) {
        // Shadow diamond (offset)
        ctx.strokeStyle = carpetDark
        ctx.globalAlpha = 0.4
        ctx.beginPath()
        ctx.moveTo(x + 1, y + 1)
        ctx.lineTo(x + 9, y + 9)
        ctx.lineTo(x + 1, y + 17)
        ctx.lineTo(x - 7, y + 9)
        ctx.closePath()
        ctx.stroke()
        ctx.globalAlpha = 1.0

        // Main diamond
        ctx.strokeStyle = carpetDark
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + 8, y + 8)
        ctx.lineTo(x, y + 16)
        ctx.lineTo(x - 8, y + 8)
        ctx.closePath()
        ctx.stroke()

        // Highlight diamond (inner)
        ctx.strokeStyle = carpetLight
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.moveTo(x, y + 2)
        ctx.lineTo(x + 6, y + 8)
        ctx.lineTo(x, y + 14)
        ctx.lineTo(x - 6, y + 8)
        ctx.closePath()
        ctx.stroke()
        ctx.globalAlpha = 1.0
        ctx.lineWidth = 2
      }
    }

    // Add carpet fibers/texture with depth
    ctx.strokeStyle = carpetLight
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.3
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const length = 1 + Math.random() * 2
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + length, y + length)
      ctx.stroke()
    }
    ctx.globalAlpha = 1.0

    // Darker fibers for contrast
    ctx.strokeStyle = carpetDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.2
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const length = 1 + Math.random()
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + length, y + length)
      ctx.stroke()
    }
    ctx.globalAlpha = 1.0

    // Pile texture highlights (carpet nap)
    ctx.fillStyle = carpetHighlight
    ctx.globalAlpha = 0.15
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      ctx.fillRect(x, y, 2, 2)
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

  static createTileFloorTile() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    const tileWhite = '#E8E8E8'
    const tileGray = '#D0D0D0'
    const tileLight = '#F5F5F5'
    const tileDark = '#C0C0C0'
    const grout = '#A0A0A0'
    const groutDark = '#808080'

    // Draw 2x2 tiles with depth
    const tileSize = size / 2

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const x = col * tileSize
        const y = row * tileSize

        // Grout base (full tile area)
        ctx.fillStyle = grout
        ctx.fillRect(x, y, tileSize, tileSize)

        // Grout shadow
        ctx.fillStyle = groutDark
        ctx.fillRect(x, y + tileSize - 1, tileSize, 1)
        ctx.fillRect(x + tileSize - 1, y, 1, tileSize)

        // Tile with gradient for shine
        const isWhite = (row + col) % 2 === 0
        const tileGradient = ctx.createRadialGradient(
          x + tileSize / 2, y + tileSize / 2, 2,
          x + tileSize / 2, y + tileSize / 2, tileSize * 0.7
        )
        if (isWhite) {
          tileGradient.addColorStop(0, tileLight)
          tileGradient.addColorStop(0.6, tileWhite)
          tileGradient.addColorStop(1, tileGray)
        } else {
          tileGradient.addColorStop(0, tileWhite)
          tileGradient.addColorStop(0.6, tileGray)
          tileGradient.addColorStop(1, tileDark)
        }

        ctx.fillStyle = tileGradient
        ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2)

        // Tile shine (ceramic gloss)
        ctx.fillStyle = tileLight
        ctx.globalAlpha = 0.4
        ctx.beginPath()
        ctx.ellipse(
          x + tileSize * 0.35, y + tileSize * 0.35,
          tileSize * 0.25, tileSize * 0.2,
          -0.3, 0, Math.PI * 2
        )
        ctx.fill()
        ctx.globalAlpha = 1.0

        // Tile texture (subtle specks)
        ctx.fillStyle = isWhite ? tileDark : tileWhite
        ctx.globalAlpha = 0.1
        for (let i = 0; i < 8; i++) {
          const tx = x + 2 + Math.random() * (tileSize - 4)
          const ty = y + 2 + Math.random() * (tileSize - 4)
          ctx.fillRect(tx, ty, 1, 1)
        }
        ctx.globalAlpha = 1.0

        // Grout lines with depth
        ctx.strokeStyle = groutDark
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, tileSize, tileSize)

        // Grout highlight (beveled effect)
        ctx.strokeStyle = grout
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.moveTo(x + 1, y + tileSize)
        ctx.lineTo(x + 1, y + 1)
        ctx.lineTo(x + tileSize, y + 1)
        ctx.stroke()
        ctx.globalAlpha = 1.0
      }
    }

    // Overall floor texture variation
    ctx.fillStyle = tileDark
    ctx.globalAlpha = 0.05
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      ctx.fillRect(x, y, 1, 1)
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

  static createWallpaperTile() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    // Muted, neutral colors - much less saturated
    const wallBase = '#5A6A7A'
    const wallDark = '#4A5A6A'
    const wallLight = '#6A7A8A'

    // Solid base with very subtle gradient
    const baseGradient = ctx.createLinearGradient(0, 0, 0, size)
    baseGradient.addColorStop(0, wallLight)
    baseGradient.addColorStop(0.5, wallBase)
    baseGradient.addColorStop(1, wallDark)
    ctx.fillStyle = baseGradient
    ctx.fillRect(0, 0, size, size)

    // Very subtle paper texture (minimal noise)
    ctx.fillStyle = wallDark
    ctx.globalAlpha = 0.03
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1)
    }
    ctx.globalAlpha = 1.0

    // Extremely subtle vertical lines (barely visible)
    ctx.strokeStyle = wallDark
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.05
    for (let x = 0; x < size; x += 16) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, size)
      ctx.stroke()
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

  static createBrickWallTile() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    // Muted, neutral brick colors
    const brickBase = '#6A5A5A'
    const brickDark = '#5A4A4A'
    const brickLight = '#7A6A6A'
    const mortar = '#8A8A8A'
    const mortarDark = '#7A7A7A'

    // Draw bricks in offset pattern - simplified
    const brickHeight = 16
    const brickWidth = 32

    for (let row = 0; row < 4; row++) {
      const offsetX = row % 2 === 0 ? 0 : brickWidth / 2

      for (let col = -1; col < 3; col++) {
        const x = col * brickWidth + offsetX
        const y = row * brickHeight

        // Simple mortar
        ctx.fillStyle = mortar
        ctx.fillRect(x, y, brickWidth, brickHeight)

        // Brick with subtle gradient
        const brickGradient = ctx.createLinearGradient(x, y, x + brickWidth, y)
        brickGradient.addColorStop(0, brickDark)
        brickGradient.addColorStop(0.5, brickBase)
        brickGradient.addColorStop(1, brickDark)
        ctx.fillStyle = brickGradient
        ctx.fillRect(x + 1, y + 1, brickWidth - 2, brickHeight - 2)

        // Subtle brick highlight
        ctx.fillStyle = brickLight
        ctx.globalAlpha = 0.2
        ctx.fillRect(x + 1, y + 1, brickWidth - 2, 1)
        ctx.globalAlpha = 1.0

        // Minimal texture
        ctx.fillStyle = brickDark
        ctx.globalAlpha = 0.1
        for (let i = 0; i < 2; i++) {
          const tx = x + 3 + Math.random() * (brickWidth - 6)
          const ty = y + 3 + Math.random() * (brickHeight - 6)
          ctx.fillRect(tx, ty, 2, 1)
        }
        ctx.globalAlpha = 1.0
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
