/**
 * ProgressBar - Shows player progress towards goal
 */

import * as THREE from 'three'

export class ProgressBar {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.startX = 0
    this.goalX = 100
    this.currentX = 0

    this.createProgressBar()
  }

  createProgressBar() {
    // Create a group for the progress bar UI
    this.group = new THREE.Group()

    // Bar dimensions (in screen space)
    const barWidth = 18
    const barHeight = 0.7
    const barY = 0 // We'll position the whole group at the bottom

    // Background bar (dark with high contrast)
    const bgGeometry = new THREE.PlaneGeometry(barWidth, barHeight)
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
      depthWrite: false
    })
    this.backgroundBar = new THREE.Mesh(bgGeometry, bgMaterial)
    this.backgroundBar.position.set(0, barY, 0)
    this.backgroundBar.renderOrder = 1000 // Force render on top
    this.group.add(this.backgroundBar)

    // Progress bar (bright green)
    const progressGeometry = new THREE.PlaneGeometry(barWidth, barHeight)
    const progressMaterial = new THREE.MeshBasicMaterial({
      color: 0x00FF00,
      transparent: true,
      opacity: 1.0,
      depthTest: false,
      depthWrite: false
    })
    this.progressBar = new THREE.Mesh(progressGeometry, progressMaterial)
    this.progressBar.position.set(0, barY, 0.01)
    this.progressBar.renderOrder = 1001
    this.group.add(this.progressBar)

    // Player marker (bright orange)
    const markerGeometry = new THREE.PlaneGeometry(0.5, 0.5)
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF6600,
      transparent: true,
      opacity: 1,
      depthTest: false,
      depthWrite: false
    })
    this.playerMarker = new THREE.Mesh(markerGeometry, markerMaterial)
    this.playerMarker.position.set(-barWidth / 2, barY, 0.02)
    this.playerMarker.renderOrder = 1002
    this.group.add(this.playerMarker)

    // Goal marker (bright gold)
    const goalGeometry = new THREE.PlaneGeometry(0.5, 0.5)
    const goalMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 1,
      depthTest: false,
      depthWrite: false
    })
    this.goalMarker = new THREE.Mesh(goalGeometry, goalMaterial)
    this.goalMarker.position.set(barWidth / 2, barY, 0.02)
    this.goalMarker.renderOrder = 1002
    this.group.add(this.goalMarker)

    // Border for the bar (bright white)
    const borderGeometry = new THREE.BufferGeometry()
    const borderVertices = new Float32Array([
      -barWidth / 2, barY - barHeight / 2, 0.03,
      barWidth / 2, barY - barHeight / 2, 0.03,
      barWidth / 2, barY + barHeight / 2, 0.03,
      -barWidth / 2, barY + barHeight / 2, 0.03,
      -barWidth / 2, barY - barHeight / 2, 0.03
    ])
    borderGeometry.setAttribute('position', new THREE.BufferAttribute(borderVertices, 3))
    const borderMaterial = new THREE.LineBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 1.0,
      depthTest: false,
      linewidth: 2
    })
    this.border = new THREE.Line(borderGeometry, borderMaterial)
    this.border.renderOrder = 1003
    this.group.add(this.border)

    this.scene.add(this.group)
    console.log('📊 Progress bar created with bright colors')
  }

  setRange(startX, goalX) {
    this.startX = startX
    this.goalX = goalX
  }

  update(playerX) {
    this.currentX = playerX

    // Calculate progress (0 to 1)
    const progress = Math.max(0, Math.min(1, (playerX - this.startX) / (this.goalX - this.startX)))

    // Update progress bar width (must match createProgressBar)
    const barWidth = 18
    this.progressBar.scale.x = progress
    this.progressBar.position.x = -barWidth / 2 + (barWidth * progress / 2)

    // Update player marker position
    this.playerMarker.position.x = -barWidth / 2 + (barWidth * progress)

    // Position the entire UI at bottom of screen
    // Camera frustum is 20 units tall, so bottom is at camera.y - 10
    this.group.position.x = this.camera.position.x
    this.group.position.y = this.camera.position.y - 8.5 // Near bottom of screen
    this.group.position.z = 25 // In front of everything
  }

  destroy() {
    if (this.group) {
      this.scene.remove(this.group)
      this.backgroundBar.geometry.dispose()
      this.backgroundBar.material.dispose()
      this.progressBar.geometry.dispose()
      this.progressBar.material.dispose()
      this.playerMarker.geometry.dispose()
      this.playerMarker.material.dispose()
      this.goalMarker.geometry.dispose()
      this.goalMarker.material.dispose()
    }
  }
}
