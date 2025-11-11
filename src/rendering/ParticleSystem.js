/**
 * ParticleSystem - Creates various particle effects
 */

import * as THREE from 'three'

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene
    this.particles = []
  }

  /**
   * Create a burst of particles (for landing, running, etc)
   */
  createBurst(x, y, count = 8, color = 0xffffff, speed = 3) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const particleSpeed = speed * (0.5 + Math.random() * 0.5)

      const geometry = new THREE.PlaneGeometry(0.15, 0.15)
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1.0,
        depthTest: false,
        blending: THREE.AdditiveBlending
      })

      const particle = new THREE.Mesh(geometry, material)
      particle.position.set(x, y, 2)
      particle.rotation.x = Math.PI / 12 // Match 3D tilt

      this.scene.add(particle)

      this.particles.push({
        mesh: particle,
        velocity: {
          x: Math.cos(angle) * particleSpeed,
          y: Math.sin(angle) * particleSpeed
        },
        life: 1.0,
        decay: 2.0 + Math.random()
      })
    }
  }

  /**
   * Create dust trail particles (for running)
   */
  createDustTrail(x, y, direction = 1) {
    const count = 2
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.PlaneGeometry(0.2, 0.1)
      const material = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.6,
        depthTest: false
      })

      const particle = new THREE.Mesh(geometry, material)
      particle.position.set(
        x + (Math.random() - 0.5) * 0.5,
        y + Math.random() * 0.3,
        2
      )
      particle.rotation.x = Math.PI / 12

      this.scene.add(particle)

      this.particles.push({
        mesh: particle,
        velocity: {
          x: -direction * (0.5 + Math.random()),
          y: 0.5 + Math.random() * 0.5
        },
        life: 1.0,
        decay: 3.0
      })
    }
  }

  /**
   * Create sparkle effect (for collecting items, interacting)
   */
  createSparkle(x, y, color = 0xffff00) {
    const count = 6
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const distance = 0.3 + Math.random() * 0.2

      const geometry = new THREE.PlaneGeometry(0.1, 0.1)
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1.0,
        depthTest: false,
        blending: THREE.AdditiveBlending
      })

      const particle = new THREE.Mesh(geometry, material)
      particle.position.set(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance,
        2
      )
      particle.rotation.x = Math.PI / 12

      this.scene.add(particle)

      this.particles.push({
        mesh: particle,
        velocity: {
          x: Math.cos(angle) * 2,
          y: Math.sin(angle) * 2
        },
        life: 1.0,
        decay: 4.0,
        sparkle: true
      })
    }
  }

  /**
   * Update all particles
   */
  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]

      // Update position
      p.mesh.position.x += p.velocity.x * deltaTime
      p.mesh.position.y += p.velocity.y * deltaTime

      // Apply gravity (except for sparkles)
      if (!p.sparkle) {
        p.velocity.y -= 9.8 * deltaTime
      }

      // Fade out
      p.life -= p.decay * deltaTime
      p.mesh.material.opacity = Math.max(0, p.life)

      // Scale down sparkles
      if (p.sparkle) {
        const scale = Math.max(0.1, p.life)
        p.mesh.scale.set(scale, scale, 1)
      }

      // Remove dead particles
      if (p.life <= 0) {
        this.scene.remove(p.mesh)
        p.mesh.geometry.dispose()
        p.mesh.material.dispose()
        this.particles.splice(i, 1)
      }
    }
  }

  /**
   * Clean up all particles
   */
  dispose() {
    this.particles.forEach(p => {
      this.scene.remove(p.mesh)
      p.mesh.geometry.dispose()
      p.mesh.material.dispose()
    })
    this.particles = []
  }
}
