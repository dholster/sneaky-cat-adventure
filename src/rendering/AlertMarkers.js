/**
 * AlertMarkers - Cartoon exclamation marks that appear above the player
 * Shows detection risk level with 1-3 marks in an arch
 */

import * as THREE from 'three'

export class AlertMarkers {
  constructor(scene) {
    this.scene = scene
    this.markers = []
    this.maxMarkers = 3
    this.currentLevel = 0
  }

  /**
   * Create the alert marker system
   */
  create() {
    // Create 3 exclamation mark sprites
    for (let i = 0; i < this.maxMarkers; i++) {
      const texture = this.createExclamationTexture()

      const geometry = new THREE.PlaneGeometry(0.4, 0.6)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthTest: false,
        side: THREE.DoubleSide
      })

      const marker = new THREE.Mesh(geometry, material)
      marker.renderOrder = 100 // Render on top
      marker.visible = false
      marker.rotation.x = Math.PI / 12 // Tilt back for 3D perspective

      this.scene.add(marker)
      this.markers.push({
        mesh: marker,
        targetOpacity: 0,
        currentOpacity: 0,
        bobOffset: i * 0.3, // Stagger the bobbing animation
        baseY: 0
      })
    }
  }

  /**
   * Create a cartoon exclamation mark texture with watery/sweat effect
   */
  createExclamationTexture() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.clearRect(0, 0, size, size)

    const centerX = size / 2
    const centerY = size / 2

    // Draw watery/sweat drop shape around the exclamation
    ctx.save()

    // Outer glow (light blue/white watery effect)
    const outerGlow = ctx.createRadialGradient(centerX, centerY - 4, 0, centerX, centerY - 4, 28)
    outerGlow.addColorStop(0, 'rgba(180, 220, 255, 0.6)')
    outerGlow.addColorStop(0.5, 'rgba(150, 200, 255, 0.3)')
    outerGlow.addColorStop(1, 'rgba(120, 180, 255, 0)')
    ctx.fillStyle = outerGlow
    ctx.fillRect(0, 0, size, size)

    // Main exclamation mark body (blue instead of red)
    const bodyGradient = ctx.createLinearGradient(centerX - 6, 10, centerX + 6, 10)
    bodyGradient.addColorStop(0, '#4488FF')
    bodyGradient.addColorStop(0.5, '#66AAFF')
    bodyGradient.addColorStop(1, '#4488FF')
    ctx.fillStyle = bodyGradient

    // Exclamation vertical bar
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetY = 2
    ctx.beginPath()
    ctx.roundRect(centerX - 5, 12, 10, 28, 3)
    ctx.fill()

    // Exclamation dot
    ctx.beginPath()
    ctx.arc(centerX, 46, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowColor = 'transparent'

    // White highlights for cartoon effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.beginPath()
    ctx.ellipse(centerX - 2, 18, 3, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(centerX - 1.5, 44, 2, 0, Math.PI * 2)
    ctx.fill()

    // Watery droplets around the mark
    ctx.fillStyle = 'rgba(180, 220, 255, 0.6)'
    const droplets = [
      [centerX - 14, 20, 2.5],
      [centerX + 14, 24, 2],
      [centerX - 16, 35, 1.5],
      [centerX + 15, 38, 2]
    ]

    droplets.forEach(([x, y, r]) => {
      const dropGradient = ctx.createRadialGradient(x, y, 0, x, y, r)
      dropGradient.addColorStop(0, 'rgba(220, 240, 255, 0.8)')
      dropGradient.addColorStop(0.7, 'rgba(180, 220, 255, 0.4)')
      dropGradient.addColorStop(1, 'rgba(150, 200, 255, 0)')
      ctx.fillStyle = dropGradient
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }

  /**
   * Update alert level (0-3)
   * @param {number} level - Alert level (0 = no marks, 1-3 = number of marks)
   * @param {Vector3} position - Entity position
   * @param {number} entityHeight - Entity height for positioning above
   */
  update(level, position, entityHeight = 1, deltaTime = 0.016) {
    this.currentLevel = Math.min(this.maxMarkers, Math.max(0, Math.floor(level)))

    // Position markers just above the entity's head (not in an arch)
    const baseHeight = entityHeight + 0.8 // Just above the head
    const spacing = 0.5 // Horizontal spacing between marks
    const time = Date.now() * 0.003 // For bobbing animation

    this.markers.forEach((marker, index) => {
      const shouldShow = index < this.currentLevel

      // Update target opacity
      marker.targetOpacity = shouldShow ? 1.0 : 0.0

      // Smooth opacity transition
      const transitionSpeed = shouldShow ? 8 : 4 // Fade in faster than fade out
      marker.currentOpacity += (marker.targetOpacity - marker.currentOpacity) * transitionSpeed * deltaTime

      marker.mesh.material.opacity = marker.currentOpacity
      marker.mesh.visible = marker.currentOpacity > 0.01

      if (marker.mesh.visible) {
        // Position in a straight horizontal line above head
        // Single mark: center
        // Two marks: left and right of center
        // Three marks: left, center, right
        let xOffset = 0
        if (this.currentLevel === 1) {
          xOffset = 0 // Center
        } else if (this.currentLevel === 2) {
          xOffset = (index === 0) ? -spacing : spacing
        } else if (this.currentLevel === 3) {
          xOffset = (index - 1) * spacing
        }

        // Bobbing animation
        const bob = Math.sin(time + marker.bobOffset) * 0.08

        marker.mesh.position.x = position.x + xOffset
        marker.mesh.position.y = position.y + baseHeight + bob
        marker.mesh.position.z = position.z + 2

        // Scale pulse based on urgency
        const pulse = 1.0 + Math.sin(time * 3 + marker.bobOffset) * 0.08 * (this.currentLevel / 3)
        marker.mesh.scale.set(pulse, pulse, 1)
      }
    })
  }

  /**
   * Set alert level from noise/detection state
   * @param {boolean} isMoving - Is entity moving
   * @param {boolean} isRunning - Is entity running
   * @param {boolean} enemyNearby - Is an enemy searching nearby
   * @param {number} detectionLevel - Detection percentage (0-1)
   */
  setFromState(isMoving, isRunning, enemyNearby, detectionLevel = 0) {
    let level = 0

    // Only show marks if there's actual danger
    // Base level on movement BUT only if enemy is nearby or detecting
    const inDanger = enemyNearby || detectionLevel > 0.1

    if (!inDanger) {
      // No marks if no enemies nearby
      return 0
    }

    // Show marks based on noise level when in danger
    if (isMoving && !isRunning) {
      level = 1 // Walking = 1 mark (only when enemy nearby)
    } else if (isRunning) {
      level = 2 // Running = 2 marks
    }

    // Add mark if enemy is actively searching nearby or high detection
    if (enemyNearby || detectionLevel > 0.3) {
      level = Math.min(3, level + 1)
    }

    return level
  }

  /**
   * Destroy markers
   */
  destroy() {
    this.markers.forEach(marker => {
      this.scene.remove(marker.mesh)
      marker.mesh.geometry.dispose()
      marker.mesh.material.map?.dispose()
      marker.mesh.material.dispose()
    })
    this.markers = []
  }
}
