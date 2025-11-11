/**
 * CameraController - Manages orthographic camera with smooth following
 */

import * as THREE from 'three'
import { Config } from '../utils/Config.js'

export class CameraController {
  constructor(camera, target) {
    this.camera = camera
    this.target = target // Player entity

    // Orthographic camera settings
    this.frustumSize = Config.CAMERA.FRUSTUM_SIZE
    this.aspect = window.innerWidth / window.innerHeight

    // Follow settings
    this.smoothness = Config.CAMERA.SMOOTHNESS
    this.lookAheadDistance = Config.CAMERA.LOOK_AHEAD_DISTANCE

    // Camera bounds (will be set by level)
    this.bounds = {
      minX: -100,
      maxX: 100,
      minY: 0,
      maxY: 20
    }

    this.setupOrthographicCamera()
  }

  setupOrthographicCamera() {
    // Set up orthographic projection
    this.camera.left = -this.frustumSize * this.aspect / 2
    this.camera.right = this.frustumSize * this.aspect / 2
    this.camera.top = this.frustumSize / 2
    this.camera.bottom = -this.frustumSize / 2
    this.camera.near = 0.1
    this.camera.far = 1000

    // Position camera for 3D perspective (lowered for better view)
    this.camera.position.set(0, 1, 20)
    this.camera.rotation.x = -Math.PI / 12 // Tilt down ~15 degrees

    this.camera.updateProjectionMatrix()
  }

  setBounds(minX, maxX, minY, maxY) {
    this.bounds = { minX, maxX, minY, maxY }
  }

  update(deltaTime) {
    if (!this.target) return

    // Calculate desired position
    const targetPos = this.target.position.clone()

    // Add look-ahead based on player velocity
    const lookAhead = this.target.velocity.clone()
      .normalize()
      .multiplyScalar(this.lookAheadDistance)

    // Only apply look-ahead if velocity is significant
    if (this.target.velocity.length() > 0.5) {
      // Reduce vertical look-ahead by 50% when jumping/in air
      if (!this.target.isGrounded) {
        lookAhead.y *= 0.5
      }
      targetPos.add(lookAhead)
    }

    // Smooth lerp to target position (only x and y, keep z for 3D perspective)
    this.camera.position.x = THREE.MathUtils.lerp(
      this.camera.position.x,
      targetPos.x,
      this.smoothness
    )

    // Raise camera view by 50% for better centering (was +1, now +2.5)
    // When jumping/in air, reduce vertical camera movement by 50%
    let verticalOffset = 2.5
    let verticalSmoothness = this.smoothness

    if (!this.target.isGrounded) {
      // Much slower vertical follow when in air (reduces jump camera movement)
      verticalSmoothness = this.smoothness * 0.5
    }

    this.camera.position.y = THREE.MathUtils.lerp(
      this.camera.position.y,
      targetPos.y + verticalOffset,
      verticalSmoothness
    )

    // Keep z position fixed for 3D perspective
    this.camera.position.z = 20

    // Apply bounds
    this.camera.position.x = THREE.MathUtils.clamp(
      this.camera.position.x,
      this.bounds.minX,
      this.bounds.maxX
    )

    this.camera.position.y = THREE.MathUtils.clamp(
      this.camera.position.y,
      this.bounds.minY,
      this.bounds.maxY
    )

    // Keep rotation fixed for 3D tilt
    this.camera.rotation.x = -Math.PI / 12
  }

  onResize(width, height) {
    // Update aspect ratio
    this.aspect = width / height

    // Update camera projection
    this.camera.left = -this.frustumSize * this.aspect / 2
    this.camera.right = this.frustumSize * this.aspect / 2
    this.camera.top = this.frustumSize / 2
    this.camera.bottom = -this.frustumSize / 2

    this.camera.updateProjectionMatrix()
  }
}
