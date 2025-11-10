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
    const barWidth = 20
    const barHeight = 0.8
    const barY = -7 // Bottom of screen (adjusted to be within frustum)

    // Background bar (dark)
    const bgGeometry = new THREE.PlaneGeometry(barWidth, barHeight)
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x2a2a2a,
      transparent: true,
      opacity: 0.8,
      depthTest: false,
      depthWrite: false
    })
    this.backgroundBar = new THREE.Mesh(bgGeometry, bgMaterial)
    this.backgroundBar.position.set(0, barY, 20) // z=20 to be in front of vignette
    this.group.add(this.backgroundBar)

    // Progress bar (green)
    const progressGeometry = new THREE.PlaneGeometry(barWidth, barHeight)
    const progressMaterial = new THREE.MeshBasicMaterial({
      color: 0x4CAF50,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
      depthWrite: false
    })
    this.progressBar = new THREE.Mesh(progressGeometry, progressMaterial)
    this.progressBar.position.set(0, barY, 20.1)
    this.group.add(this.progressBar)

    // Player marker (cat icon)
    const markerGeometry = new THREE.PlaneGeometry(0.6, 0.6)
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xE07B39,
      transparent: true,
      opacity: 1,
      depthTest: false,
      depthWrite: false
    })
    this.playerMarker = new THREE.Mesh(markerGeometry, markerMaterial)
    this.playerMarker.position.set(-barWidth / 2, barY, 20.2)
    this.group.add(this.playerMarker)

    // Goal marker (flag)
    const goalGeometry = new THREE.PlaneGeometry(0.6, 0.6)
    const goalMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 1,
      depthTest: false,
      depthWrite: false
    })
    this.goalMarker = new THREE.Mesh(goalGeometry, goalMaterial)
    this.goalMarker.position.set(barWidth / 2, barY, 20.2)
    this.group.add(this.goalMarker)

    // Border for the bar
    const borderGeometry = new THREE.BufferGeometry()
    const borderVertices = new Float32Array([
      -barWidth / 2, barY - barHeight / 2, 20.3,
      barWidth / 2, barY - barHeight / 2, 20.3,
      barWidth / 2, barY + barHeight / 2, 20.3,
      -barWidth / 2, barY + barHeight / 2, 20.3,
      -barWidth / 2, barY - barHeight / 2, 20.3
    ])
    borderGeometry.setAttribute('position', new THREE.BufferAttribute(borderVertices, 3))
    const borderMaterial = new THREE.LineBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.6,
      depthTest: false
    })
    this.border = new THREE.Line(borderGeometry, borderMaterial)
    this.group.add(this.border)

    this.scene.add(this.group)
  }

  setRange(startX, goalX) {
    this.startX = startX
    this.goalX = goalX
  }

  update(playerX) {
    this.currentX = playerX

    // Calculate progress (0 to 1)
    const progress = Math.max(0, Math.min(1, (playerX - this.startX) / (this.goalX - this.startX)))

    // Update progress bar width
    const barWidth = 20
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
