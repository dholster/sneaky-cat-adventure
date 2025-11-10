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

    // Add fog for atmosphere
    this.scene.fog = new THREE.FogExp2(Config.COLORS.NIGHT_BLUE, 0.015)
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

  setupStealthSystems() {
    // Initialize detection system
    this.detectionSystem = new DetectionSystem(this.scene, this.player)

    // Initialize vision cone renderer
    this.visionConeRenderer = new VisionConeRenderer(this.scene)

    // Create ONE human enemy for tutorial
    this.createHuman(5, 1, [
      { x: 0, y: 1 },
      { x: 10, y: 1 }
    ])

    // Create hiding spots along the path
    this.createHidingSpot(-5, 1, 'box')
    this.createHidingSpot(5, 1, 'shadow')
    this.createHidingSpot(15, 1, 'box')

    // Create goal marker
    this.createGoal(25, 1)

    // Register platforms as obstacles for vision blocking
    this.platforms.forEach(platform => {
      this.detectionSystem.registerObstacle(platform)
    })

    console.log(`🕵️  Created ${this.enemies.length} human enemy`)
    console.log(`📦 Created ${this.hidingSpots.length} hiding spots`)
    console.log(`🎯 Goal is at x=25 - Try to reach it without being detected!`)
  }

  createHuman(x, y, patrolPath) {
    const human = new Human(this.scene, patrolPath)
    human.position.set(x, y, 0)

    // Create visual representation (dark gray rectangle for now)
    human.createColorSprite(0x4a4a6a, 1, 2)

    // Register with systems
    this.enemies.push(human)
    this.detectionSystem.registerEnemy(human)

    // Create vision cone
    this.visionConeRenderer.createVisionCone(human)

    return human
  }

  createHidingSpot(x, y, type) {
    const spot = new HidingSpot(this.scene, x, y, type)
    this.hidingSpots.push(spot)
    return spot
  }

  createGoal(x, y) {
    // Create a bright glowing goal marker
    const geometry = new THREE.PlaneGeometry(2, 3)
    const material = new THREE.MeshBasicMaterial({
      color: Config.COLORS.SAFE_GREEN,
      transparent: true,
      opacity: 0.8
    })

    this.goalMarker = new THREE.Mesh(geometry, material)
    this.goalMarker.position.set(x, y + 1.5, 1)
    this.scene.add(this.goalMarker)

    // Store goal position
    this.goalPosition = new THREE.Vector2(x, y)
    this.goalReached = false

    console.log('🎯 Goal created at:', x, y)
  }

  setupEnvironment() {
    // Dim ambient light for nighttime atmosphere
    const ambientLight = new THREE.AmbientLight(Config.COLORS.MOONLIGHT_BLUE, 0.3)
    this.scene.add(ambientLight)

    // Add moonlight (directional light)
    const moonlight = new THREE.DirectionalLight(0xaabbcc, 0.4)
    moonlight.position.set(10, 20, 5)
    this.scene.add(moonlight)

    // Simple straight ground - tutorial level
    this.createPlatform(0, 0, 50, 1, 0x1a1a2e)

    // A few platforms for cover/navigation
    this.createPlatform(3, 3, 3, 0.5, Config.COLORS.SHADOW_BLUE)
    this.createPlatform(8, 3, 3, 0.5, Config.COLORS.SHADOW_BLUE)
    this.createPlatform(18, 3, 3, 0.5, Config.COLORS.SHADOW_BLUE)

    console.log(`🏗️  Created simple tutorial level`)
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

    // Update enemies
    this.enemies.forEach(enemy => enemy.update(deltaTime))

    // Update detection system
    this.detectionSystem.update(deltaTime)

    // Update vision cone renderer
    this.visionConeRenderer.update(elapsedTime)

    // Check hiding spot interactions
    this.checkHidingSpots()

    // Check if goal is reached
    this.checkGoal()

    // Animate goal marker
    if (this.goalMarker && !this.goalReached) {
      this.goalMarker.material.opacity = 0.6 + Math.sin(elapsedTime * 3) * 0.2
      this.goalMarker.position.y = 2.5 + Math.sin(elapsedTime * 2) * 0.3
    }

    // Update camera
    this.cameraController.update(deltaTime)

    // Debug info
    if (this.debugMode) {
      this.showDebugInfo()
    }
  }

  checkHidingSpots() {
    // Find nearest hiding spot
    let nearestSpot = null
    let nearestDistance = Infinity

    this.hidingSpots.forEach(spot => {
      if (spot.canInteract(this.player)) {
        const distance = spot.position.distanceTo(this.player.position)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestSpot = spot
        }
      }
    })

    // Handle interaction
    if (this.inputManager.interact) {
      if (this.player.isHiding) {
        // Exit hiding
        this.hidingSpots.forEach(spot => {
          if (spot.occupant === this.player) {
            spot.exit(this.player)
          }
        })
      } else if (nearestSpot) {
        // Enter hiding
        nearestSpot.enter(this.player)
      }
    }

    // Store nearest spot for potential UI prompts later
    this.nearestHidingSpot = nearestSpot
  }

  checkGoal() {
    if (this.goalReached || !this.goalPosition) return

    // Check if player is near goal
    const distance = this.player.position.distanceTo(
      new THREE.Vector3(this.goalPosition.x, this.goalPosition.y, 0)
    )

    if (distance < 3) {
      this.goalReached = true
      console.log('🎉🎉🎉 LEVEL COMPLETE! 🎉🎉🎉')
      console.log('You successfully reached the goal!')

      // Make goal marker brighter
      if (this.goalMarker) {
        this.goalMarker.material.opacity = 1.0
        this.goalMarker.scale.set(1.5, 1.5, 1.5)
      }

      // Pause game after short delay
      setTimeout(() => {
        this.paused = true
        console.log('🎊 Well done! Press P to continue or refresh to try again.')
      }, 1000)
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
