/**
 * Game - Main game manager coordinating all systems
 */

import * as THREE from 'three'
import { InputManager } from './InputManager.js'
import { CameraController } from './CameraController.js'
import { PhysicsSystem } from '../systems/PhysicsSystem.js'
import { DetectionSystem } from '../systems/DetectionSystem.js'
import { VisionConeRenderer } from '../rendering/VisionConeRenderer.js'
import { Player } from '../entities/Player.js'
import { Platform } from '../entities/Platform.js'
import { Human } from '../entities/Human.js'
import { HidingSpot } from '../entities/HidingSpot.js'
import { Config } from '../utils/Config.js'

export class Game {
  constructor(canvas) {
    this.canvas = canvas

    // Core Three.js components
    this.scene = null
    this.camera = null
    this.renderer = null

    // Systems
    this.inputManager = new InputManager()
    this.cameraController = null
    this.physicsSystem = new PhysicsSystem()
    this.detectionSystem = null // Will be initialized after player
    this.visionConeRenderer = null

    // Game entities
    this.player = null
    this.entities = []
    this.platforms = [] // Static platforms for collision
    this.enemies = [] // Human, dog enemies
    this.hidingSpots = [] // Interactive hiding spots

    // Game state
    this.paused = false
    this.lives = Config.GAME.LIVES

    // Time tracking
    this.clock = new THREE.Clock()
    this.previousTime = 0

    // Debug
    this.debugMode = false
  }

  init() {
    this.setupScene()
    this.setupCamera()
    this.setupRenderer()
    this.setupPlayer()
    this.setupStealthSystems()
    this.setupEnvironment()
    this.setupEventListeners()

    console.log('🐱 Stealth Cat - Game Initialized')
    console.log('Controls:')
    console.log('  Move: Arrow Keys/WASD')
    console.log('  Jump: Space')
    console.log('  Run (Hold): Shift - ⚠️  Makes noise!')
    console.log('  Crouch (Hold): Ctrl')
    console.log('  Hide: E (near hiding spot)')
    console.log('  Pause: P')
    console.log('  Debug: I')
  }

  setupScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(Config.COLORS.NIGHT_BLUE)
  }

  setupCamera() {
    // Create orthographic camera (replaces perspective)
    const aspect = window.innerWidth / window.innerHeight
    const frustumSize = Config.CAMERA.FRUSTUM_SIZE

    this.camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    )

    this.camera.position.z = 10
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: Config.RENDER.ANTIALIAS
    })

    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Config.RENDER.PIXEL_RATIO)
    this.renderer.setClearColor(Config.RENDER.CLEAR_COLOR)
  }

  setupPlayer() {
    // Create player
    this.player = new Player(this.scene, this.inputManager)
    this.player.position.set(-20, 1, 0) // Start on ground with small offset

    // Create a temporary colored sprite for the player (cat)
    this.player.createColorSprite(0xffaa66, 1, 1) // Orange color for cat

    // Register with physics system
    this.physicsSystem.registerEntity(this.player)

    // Setup camera controller to follow player
    this.cameraController = new CameraController(this.camera, this.player)
    this.cameraController.setBounds(-60, 60, 0, 25)

    console.log('🐱 Player created at position:', this.player.position)
  }

  setupEnvironment() {
    // Add simple ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
    this.scene.add(ambientLight)

    // Create main ground platform
    this.createPlatform(-30, 0, 100, 1, Config.COLORS.SHADOW_BLUE)

    // Tutorial section - Easy jumps (left side)
    this.createPlatform(-25, 3, 4, 0.5, Config.COLORS.MOONLIGHT_BLUE)
    this.createPlatform(-20, 5, 4, 0.5, Config.COLORS.MOONLIGHT_BLUE)
    this.createPlatform(-15, 7, 4, 0.5, Config.COLORS.MOONLIGHT_BLUE)
    this.createPlatform(-10, 5, 4, 0.5, Config.COLORS.MOONLIGHT_BLUE)
    this.createPlatform(-5, 3, 4, 0.5, Config.COLORS.MOONLIGHT_BLUE)

    // Center platforms - Medium difficulty
    this.createPlatform(0, 8, 6, 0.5, Config.COLORS.SAFE_GREEN)
    this.createPlatform(-3, 11, 3, 0.5, Config.COLORS.ALERT_YELLOW)
    this.createPlatform(3, 11, 3, 0.5, Config.COLORS.ALERT_YELLOW)
    this.createPlatform(0, 14, 4, 0.5, Config.COLORS.ROOM_LIGHT)

    // Right side - Varied heights
    this.createPlatform(8, 2, 5, 0.5, Config.COLORS.MOONLIGHT_BLUE)
    this.createPlatform(14, 4, 4, 0.5, Config.COLORS.MOONLIGHT_BLUE)
    this.createPlatform(19, 6, 4, 0.5, Config.COLORS.MOONLIGHT_BLUE)
    this.createPlatform(24, 8, 5, 0.5, Config.COLORS.MOONLIGHT_BLUE)
    this.createPlatform(30, 10, 4, 0.5, Config.COLORS.SAFE_GREEN)

    // Floating platforms high up
    this.createPlatform(10, 16, 3, 0.5, Config.COLORS.SECURITY_RED)
    this.createPlatform(16, 18, 3, 0.5, Config.COLORS.SECURITY_RED)
    this.createPlatform(22, 20, 4, 0.5, Config.COLORS.SECURITY_RED)

    // Wall-like platforms (tall obstacles)
    this.createPlatform(35, 2, 1, 6, Config.COLORS.SHADOW_BLUE)
    this.createPlatform(40, 4, 1, 8, Config.COLORS.SHADOW_BLUE)

    // Far right landing area
    this.createPlatform(45, 0, 20, 1, Config.COLORS.SHADOW_BLUE)
    this.createPlatform(50, 5, 6, 0.5, Config.COLORS.ROOM_LIGHT)
    this.createPlatform(55, 8, 4, 0.5, Config.COLORS.SAFE_GREEN)

    console.log(`🏗️  Created ${this.platforms.length} platforms for testing`)
  }

  createPlatform(x, y, width, height, color) {
    const platform = new Platform(this.scene, x, y, width, height, color)
    this.platforms.push(platform)
    return platform
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize())

    // Debug toggle
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyP') {
        this.paused = !this.paused
        console.log(this.paused ? 'Game Paused' : 'Game Resumed')
      }
      if (e.code === 'KeyI') {
        this.debugMode = !this.debugMode
        console.log('Debug Mode:', this.debugMode)
      }
    })
  }

  onResize() {
    const width = window.innerWidth
    const height = window.innerHeight

    // Update camera
    this.cameraController.onResize(width, height)

    // Update renderer
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Config.RENDER.PIXEL_RATIO)
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.previousTime
    this.previousTime = elapsedTime

    if (this.paused) return

    // Update input manager (clears pressed/released states)
    this.inputManager.update()

    // Update player
    this.player.update(deltaTime)

    // Check platform collisions
    this.checkPlatformCollisions()

    // Update camera
    this.cameraController.update(deltaTime)

    // Debug info
    if (this.debugMode) {
      this.showDebugInfo()
    }
  }

  checkPlatformCollisions() {
    // Simple AABB collision detection
    const playerBounds = this.player.getBounds()

    this.platforms.forEach(platform => {
      const platformBounds = platform.getBounds()

      // Check if player overlaps platform
      if (
        playerBounds.x < platformBounds.x + platformBounds.width &&
        playerBounds.x + playerBounds.width > platformBounds.x &&
        playerBounds.y < platformBounds.y + platformBounds.height &&
        playerBounds.y + playerBounds.height > platformBounds.y
      ) {
        // Calculate overlap amounts
        const overlapLeft = (playerBounds.x + playerBounds.width) - platformBounds.x
        const overlapRight = (platformBounds.x + platformBounds.width) - playerBounds.x
        const overlapTop = (playerBounds.y + playerBounds.height) - platformBounds.y
        const overlapBottom = (platformBounds.y + platformBounds.height) - playerBounds.y

        // Find minimum overlap (this is the collision side)
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

        // Resolve collision on the side with minimum overlap
        if (minOverlap === overlapTop && this.player.velocity.y <= 0) {
          // Landing on top of platform
          this.player.position.y = platformBounds.y + platformBounds.height + playerBounds.height / 2
          this.player.velocity.y = 0
          this.player.isGrounded = true
        } else if (minOverlap === overlapBottom && this.player.velocity.y > 0) {
          // Hitting bottom of platform (bonking head)
          this.player.position.y = platformBounds.y - playerBounds.height / 2
          this.player.velocity.y = 0
        } else if (minOverlap === overlapLeft) {
          // Hitting from the left
          this.player.position.x = platformBounds.x - playerBounds.width / 2
          this.player.velocity.x = 0
        } else if (minOverlap === overlapRight) {
          // Hitting from the right
          this.player.position.x = platformBounds.x + platformBounds.width + playerBounds.width / 2
          this.player.velocity.x = 0
        }
      }
    })
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  showDebugInfo() {
    // Log debug info every 60 frames (approx 1 second)
    if (Math.floor(this.clock.getElapsedTime() * 60) % 60 === 0) {
      console.log('Player:', this.player.getDebugInfo())
    }
  }

  start() {
    const animate = () => {
      this.update()
      this.render()
      requestAnimationFrame(animate)
    }

    animate()
    console.log('🎮 Game Loop Started')
  }
}
