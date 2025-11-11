/**
 * GlowEffect - Adds glowing visual effects to objects
 */

import * as THREE from 'three'

export class GlowEffect {
  constructor(scene) {
    this.scene = scene
    this.glowObjects = []
    this.time = 0
  }

  /**
   * Add a pulsing glow effect to a mesh
   */
  addGlow(mesh, color = 0x44ff44, intensity = 1.5, pulseSpeed = 2.0) {
    // Create glow geometry (slightly larger than original)
    const geometry = mesh.geometry.clone()

    // Create glow material with additive blending
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const glowMesh = new THREE.Mesh(geometry, glowMaterial)
    glowMesh.position.copy(mesh.position)
    glowMesh.rotation.copy(mesh.rotation)
    glowMesh.scale.copy(mesh.scale).multiplyScalar(1.1) // Slightly larger
    glowMesh.renderOrder = mesh.renderOrder - 1

    this.scene.add(glowMesh)

    this.glowObjects.push({
      mesh: glowMesh,
      parentMesh: mesh,
      baseIntensity: intensity,
      pulseSpeed: pulseSpeed,
      material: glowMaterial,
      baseScale: mesh.scale.clone()
    })

    return glowMesh
  }

  /**
   * Update all glow effects (pulsing animation)
   */
  update(deltaTime) {
    this.time += deltaTime

    this.glowObjects.forEach(glow => {
      // Pulse effect
      const pulse = Math.sin(this.time * glow.pulseSpeed) * 0.5 + 0.5
      glow.material.opacity = 0.3 + pulse * 0.4

      // Scale pulsing
      const scalePulse = 1.1 + pulse * 0.05
      glow.mesh.scale.copy(glow.baseScale).multiplyScalar(scalePulse)

      // Sync position with parent
      glow.mesh.position.copy(glow.parentMesh.position)
      glow.mesh.rotation.copy(glow.parentMesh.rotation)
    })
  }

  /**
   * Remove a glow effect
   */
  removeGlow(glowMesh) {
    const index = this.glowObjects.findIndex(g => g.mesh === glowMesh)
    if (index !== -1) {
      this.scene.remove(this.glowObjects[index].mesh)
      this.glowObjects[index].mesh.geometry.dispose()
      this.glowObjects[index].material.dispose()
      this.glowObjects.splice(index, 1)
    }
  }

  /**
   * Clean up all glows
   */
  dispose() {
    this.glowObjects.forEach(glow => {
      this.scene.remove(glow.mesh)
      glow.mesh.geometry.dispose()
      glow.material.dispose()
    })
    this.glowObjects = []
  }
}
