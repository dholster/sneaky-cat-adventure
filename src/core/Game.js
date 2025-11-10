/**
 * Game - Main game manager coordinating all systems
 */

import * as THREE from 'three'
import { InputManager } from './InputManager.js'
import { CameraController } from './CameraController.js'
import { PhysicsSystem } from '../systems/PhysicsSystem.js'
import { DetectionSystem } from '../systems/DetectionSystem.js'
import { VisionConeRenderer } from '../rendering/VisionConeRenderer.js'
import { LabelSystem } from '../rendering/LabelSystem.js'
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
    this.labelSystem = null

    // Game entities
    this.player = null
    this.entities = []
    this.platforms = [] // Static platforms for collision
    this.enemies = [] // Human, dog enemies
    this.hidingSpots = [] // Interactive hiding spots
    this.goalMarker = null
    this.goalPosition = null
    this.goalReached = false

    // Game state
    this.paused = false
    this.lives = Config.GAME.LIVES
    this.isRestarting = false

    // Store initial positions for restart
    this.initialPositions = {
      player: { x: -15, y: 1 },
      enemies: []
    }

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
    this.setupLabelSystem()
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
    console.log('  Toggle Labels: L')
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

  setupLabelSystem() {
    this.labelSystem = new LabelSystem(this.scene)
    this.labelsVisible = true
    console.log('🏷️  Label system initialized (Press L to toggle)')
  }

  setupPlayer() {
    // Create player
    this.player = new Player(this.scene, this.inputManager)
    this.player.position.set(-15, 1, 0) // Start on left side

    // Create a temporary colored sprite for the player (cat)
    this.player.createColorSprite(0xffaa66, 1, 1) // Orange color for cat

    // Add label
    this.player.label = this.labelSystem.createLabel(
      'YOU (CAT)',
      new THREE.Vector3(-15, 3, 0),
      '#ffaa66',
      48
    )

    // Register with physics system
    this.physicsSystem.registerEntity(this.player)

    // Setup camera controller to follow player
    this.cameraController = new CameraController(this.camera, this.player)
    this.cameraController.setBounds(-20, 30, 0, 15)

    console.log('🐱 Player created at position:', this.player.position)
  }

  setupStealthSystems() {
    // Initialize detection system with callback
    this.detectionSystem = new DetectionSystem(
      this.scene,
      this.player,
      (enemy) => this.onPlayerDetected(enemy)
    )

    // Initialize vision cone renderer
    this.visionConeRenderer = new VisionConeRenderer(this.scene)

    // Create ONE human enemy for tutorial
    const enemyPatrol = [
      { x: 0, y: 1 },
      { x: 10, y: 1 }
    ]
    this.createHuman(5, 1, enemyPatrol)

    // Store initial enemy position for restart
    this.initialPositions.enemies.push({
      position: { x: 5, y: 1 },
      patrol: enemyPatrol
    })

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

    // Add label
    human.label = this.labelSystem.createLabel(
      'GUARD (Vision Cone)',
      new THREE.Vector3(x, y + 3, 0),
      '#ff4444',
      40
    )

    // Register with systems
    this.enemies.push(human)
    this.detectionSystem.registerEnemy(human)

    // Create vision cone
    this.visionConeRenderer.createVisionCone(human)

    return human
  }

  createHidingSpot(x, y, type) {
    const spot = new HidingSpot(this.scene, x, y, type)

    // Add label
    let labelText = 'HIDING SPOT'
    if (type === 'box') labelText = 'HIDING (Box) - Press E'
    if (type === 'shadow') labelText = 'HIDING (Shadow) - Press E'
    if (type === 'furniture') labelText = 'HIDING (Furniture) - Press E'

    spot.label = this.labelSystem.createLabel(
      labelText,
      new THREE.Vector3(x, y + 2.5, 0),
      '#44ff44',
      32
    )

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

    // Add label
    this.goalLabel = this.labelSystem.createLabel(
      '🎯 GOAL - Reach Here! 🎯',
      new THREE.Vector3(x, y + 4, 0),
      '#00ff00',
      56
    )

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
      if (e.code === 'KeyL') {
        this.labelsVisible = !this.labelsVisible
        this.toggleLabels()
        console.log('Labels:', this.labelsVisible ? 'Visible' : 'Hidden')
      }
    })
  }

  toggleLabels() {
    // Toggle all label visibility
    if (this.player.label) {
      this.player.label.visible = this.labelsVisible
    }
    this.enemies.forEach(enemy => {
      if (enemy.label) enemy.label.visible = this.labelsVisible
    })
    this.hidingSpots.forEach(spot => {
      if (spot.label) spot.label.visible = this.labelsVisible
    })
    if (this.goalLabel) {
      this.goalLabel.visible = this.labelsVisible
    }
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

    if (this.paused || this.isRestarting) return

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

    // Update labels to follow objects
    this.updateLabels()

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
      const distance = spot.position.distanceTo(this.player.position)

      // Visual feedback: Make hiding spot glow when nearby
      if (distance < spot.interactionRange && spot.sprite) {
        spot.sprite.material.emissive = new THREE.Color(0x44ff44)
        spot.sprite.material.emissiveIntensity = 0.5
      } else if (spot.sprite) {
        spot.sprite.material.emissive = new THREE.Color(0x000000)
        spot.sprite.material.emissiveIntensity = 0
      }

      if (spot.canInteract(this.player)) {
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestSpot = spot
        }
      }
    })

    // Debug: Show if near any hiding spot
    if (nearestSpot) {
      console.log(`✅ Near hiding spot! Press E to hide. Distance: ${nearestDistance.toFixed(2)}`)
    }

    // Handle interaction
    if (this.inputManager.interact) {
      console.log('🔑 E key pressed!')

      if (this.player.isHiding) {
        // Exit hiding
        console.log('🚪 Trying to exit hiding...')
        this.hidingSpots.forEach(spot => {
          if (spot.occupant === this.player) {
            spot.exit(this.player)
          }
        })
      } else if (nearestSpot) {
        // Enter hiding
        console.log('📦 Trying to enter hiding spot...')
        nearestSpot.enter(this.player)
      } else {
        console.log('❌ No hiding spot nearby to interact with')
        console.log(`   Player position: (${this.player.position.x.toFixed(1)}, ${this.player.position.y.toFixed(1)})`)
        console.log(`   Hiding spots:`)
        this.hidingSpots.forEach((spot, i) => {
          const dist = spot.position.distanceTo(this.player.position)
          console.log(`   ${i+1}. (${spot.position.x.toFixed(1)}, ${spot.position.y.toFixed(1)}) - distance: ${dist.toFixed(2)}`)
        })
      }
    }

    // Store nearest spot for potential UI prompts later
    this.nearestHidingSpot = nearestSpot
  }

  updateLabels() {
    // Update player label
    if (this.player.label) {
      this.labelSystem.updateLabelPosition(this.player.label, this.player.position, 2)
    }

    // Update enemy labels
    this.enemies.forEach(enemy => {
      if (enemy.label) {
        this.labelSystem.updateLabelPosition(enemy.label, enemy.position, 3.5)
      }
    })

    // Hiding spot labels are static, no need to update
    // Goal label is static too
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

  onPlayerDetected(enemy) {
    console.log('🚨🚨🚨 DETECTED BY GUARD! 🚨🚨🚨')
    console.log('⏱️  Restarting in 2 seconds...')

    this.isRestarting = true

    // Wait 2 seconds then restart
    setTimeout(() => {
      this.restartLevel()
    }, 2000)
  }

  restartLevel() {
    console.log('🔄 Restarting level...')

    // Reset player position and state
    this.player.position.set(
      this.initialPositions.player.x,
      this.initialPositions.player.y,
      0
    )
    this.player.velocity.set(0, 0, 0)
    this.player.isGrounded = false
    this.player.isHiding = false
    this.player.isCrouching = false
    this.player.isDetected = false
    this.player.facing = 1

    // Exit all hiding spots
    this.hidingSpots.forEach(spot => {
      spot.isOccupied = false
      spot.occupant = null
    })

    // Reset enemies
    this.enemies.forEach((enemy, index) => {
      const initialData = this.initialPositions.enemies[index]
      if (initialData) {
        enemy.position.set(initialData.position.x, initialData.position.y, 0)
        enemy.velocity.set(0, 0, 0)
        enemy.detectionLevel = 0
        enemy.detectionState = 'unaware'
        enemy.currentWaypoint = 0
        enemy.waitTimer = 0
        enemy.investigatePosition = null
        enemy.chaseTarget = null
        enemy.facing = 1
      }
    })

    // Reset goal
    this.goalReached = false

    // Resume game
    this.isRestarting = false

    console.log('✅ Level restarted! Try again.')
    console.log('💡 Tip: Wait for the guard to walk away before moving!')
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
