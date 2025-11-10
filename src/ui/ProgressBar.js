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
    const barHeight = 1
    const barY = -8 // Bottom of screen

    // Background bar (dark)
    const bgGeometry = new THREE.PlaneGeometry(barWidth, barHeight)
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x2a2a2a,
      transparent: true,
      opacity: 0.8
    })
    this.backgroundBar = new THREE.Mesh(bgGeometry, bgMaterial)
    this.backgroundBar.position.set(0, barY, 10)
    this.group.add(this.backgroundBar)

    // Progress bar (green)
    const progressGeometry = new THREE.PlaneGeometry(barWidth, barHeight)
    const progressMaterial = new THREE.MeshBasicMaterial({
      color: 0x4CAF50,
      transparent: true,
      opacity: 0.9
    })
    this.progressBar = new THREE.Mesh(progressGeometry, progressMaterial)
    this.progressBar.position.set(0, barY, 10.1)
    this.group.add(this.progressBar)

    // Player marker (cat icon)
    const markerGeometry = new THREE.PlaneGeometry(0.8, 0.8)
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xE07B39,
      transparent: true,
      opacity: 1
    })
    this.playerMarker = new THREE.Mesh(markerGeometry, markerMaterial)
    this.playerMarker.position.set(-barWidth / 2, barY, 10.2)
    this.group.add(this.playerMarker)

    // Goal marker (flag)
    const goalGeometry = new THREE.PlaneGeometry(0.8, 0.8)
    const goalMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 1
    })
    this.goalMarker = new THREE.Mesh(goalGeometry, goalMaterial)
    this.goalMarker.position.set(barWidth / 2, barY, 10.2)
    this.group.add(this.goalMarker)

    // Border for the bar
    const borderGeometry = new THREE.BufferGeometry()
    const borderVertices = new Float32Array([
      -barWidth / 2, barY - barHeight / 2, 10.3,
      barWidth / 2, barY - barHeight / 2, 10.3,
      barWidth / 2, barY + barHeight / 2, 10.3,
      -barWidth / 2, barY + barHeight / 2, 10.3,
      -barWidth / 2, barY - barHeight / 2, 10.3
    ])
    borderGeometry.setAttribute('position', new THREE.BufferAttribute(borderVertices, 3))
    const borderMaterial = new THREE.LineBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.6
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

    // Position the entire UI relative to camera
    this.group.position.x = this.camera.position.x
    this.group.position.y = this.camera.position.y
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
