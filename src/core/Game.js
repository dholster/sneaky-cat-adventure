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
import { UI } from '../rendering/UI.js'
import { AnimatedSprite } from '../rendering/AnimatedSprite.js'
import { SpriteSheet } from '../rendering/SpriteSheet.js'
import { TextureGenerator } from '../rendering/TextureGenerator.js'
import { Player } from '../entities/Player.js'
import { Platform } from '../entities/Platform.js'
import { Human } from '../entities/Human.js'
import { Dog } from '../entities/Dog.js'
import { Camera } from '../entities/Camera.js'
import { HidingSpot } from '../entities/HidingSpot.js'
import { Distraction } from '../entities/Distraction.js'
import { Config } from '../utils/Config.js'

import { Background } from '../entities/Background.js'
import { ProgressBar } from '../ui/ProgressBar.js'
import { LightingSystem } from '../rendering/LightingSystem.js'
import { ParallaxBackground } from '../rendering/ParallaxBackground.js'
import { LevelManager } from './LevelManager.js'
import { GlowEffect } from '../rendering/GlowEffect.js'
import { ParticleSystem } from '../rendering/ParticleSystem.js'
import { OutlineEffect } from '../rendering/OutlineEffect.js'
import { DynamicShadowSystem } from '../rendering/DynamicShadowSystem.js'

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
    this.ui = null // UI/HUD system
    this.progressBar = null // Progress bar showing distance to goal
    this.lightingSystem = null // Atmospheric lighting and effects
    this.parallaxBackground = null // Parallax background layers
    this.glowEffect = null // Glow effects for objects
    this.particleSystem = null // Particle effects system
    this.outlines = [] // Store outline meshes for sprites
    this.dynamicShadowSystem = null // Dynamic shadow casting system

    // Game entities
    this.player = null
    this.entities = []
    this.platforms = [] // Static platforms for collision
    this.backgrounds = [] // Background walls/surfaces
    this.enemies = [] // Human, dog, camera enemies
    this.hidingSpots = [] // Interactive hiding spots
    this.distractions = [] // Objects that can be knocked over for distraction
    this.goalMarker = null
    this.goalPosition = null
    this.goalReached = false

    // Game state
    this.paused = false
    this.lives = Config.GAME.LIVES
    this.isRestarting = false

    // Level management
    this.levelManager = new LevelManager()
    this.currentLevelData = null

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
    console.log('🎮 Game.init() called')

    try {
      console.log('  → Setting up scene...')
      this.setupScene()

      console.log('  → Setting up camera...')
      this.setupCamera()

      console.log('  → Setting up renderer...')
      this.setupRenderer()

      console.log('  → Setting up label system...')
      this.setupLabelSystem()

      console.log('  → Setting up UI...')
      this.setupUI()

      console.log('  → Setting up player...')
      this.setupPlayer()

      console.log('  → Loading level...')
      this.loadLevel()

      console.log('  → Setting up progress bar...')
      this.setupProgressBar()

      console.log('  → Setting up event listeners...')
      this.setupEventListeners()

      console.log('✅ Game initialization complete!')
      console.log('🐱 Stealth Cat - Game Initialized')
      console.log('Controls:')
      console.log('  Move: Arrow Keys/WASD')
      console.log('  Jump: Space')
      console.log('  Drop Down: S/Down Arrow (while on platform)')
      console.log('  Run (Hold): Shift - ⚠️  Makes noise!')
      console.log('  Crouch (Hold): Ctrl')
      console.log('  Hide: E (near hiding spot)')
      console.log('  Pause: P')
      console.log('  Debug: I')
      console.log('  Toggle Labels: L')
    } catch (error) {
      console.error('❌ Error during game initialization:', error)
      throw error
    }
  }

  setupScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(Config.COLORS.NIGHT_BLUE)

    // Add fog for atmosphere
    this.scene.fog = new THREE.FogExp2(Config.COLORS.NIGHT_BLUE, 0.015)

    // Initialize visual effect systems
    this.glowEffect = new GlowEffect(this.scene)
    this.particleSystem = new ParticleSystem(this.scene)
    this.dynamicShadowSystem = new DynamicShadowSystem(this.scene)

    // Add overhead directional light (simulating room/warehouse lighting)
    const overheadLight = new THREE.DirectionalLight(0xffffff, 0.6)
    overheadLight.position.set(0.3, 10, 0.2) // Light from above at an angle
    this.scene.add(overheadLight)

    // Ambient light for base visibility
    const ambientLight = new THREE.AmbientLight(0x6688aa, 0.4)
    this.scene.add(ambientLight)
  }

  setupCamera() {
    // Create orthographic camera with slight 3D perspective
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

    // Position camera further back and higher for 3D perspective (raised for better centering)
    this.camera.position.set(0, 2.5, 20)

    // Tilt camera down to look at the scene at an angle (creates pseudo-3D effect)
    this.camera.rotation.x = -Math.PI / 12 // Tilt down ~15 degrees
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

  setupUI() {
    this.ui = new UI()
    console.log('📊 UI system initialized')
  }

  setupProgressBar() {
    // Create progress bar (will be positioned after goal is set)
    this.progressBar = new ProgressBar(this.scene, this.camera)
    console.log('📊 Progress bar initialized')
  }

  setupLighting() {
    // Create lighting system for atmospheric effects
    this.lightingSystem = new LightingSystem(this.scene, this.camera)
    console.log('💡 Lighting system initialized')
  }

  setupPlayer() {
    // Create player
    this.player = new Player(this.scene, this.inputManager)
    this.player.position.set(-15, 1, 0) // Start on left side

    // Inject particle system if available
    if (this.particleSystem) {
      this.player.setParticleSystem(this.particleSystem)
    }

    // Create animated sprite for player
    const catData = TextureGenerator.createCatSpriteSheet()
    const catSpriteSheet = new SpriteSheet(
      catData.texture,
      catData.frameSize,
      catData.frameSize,
      catData.columns,
      catData.rows
    )

    const catSprite = new AnimatedSprite(this.scene, catSpriteSheet, 2, 2)

    // Add animations
    catSprite.addAnimation('idle', [0, 1], 2, true) // Slow breathing
    catSprite.addAnimation('walk', [2, 3, 4, 5], 8, true) // Walking cycle
    catSprite.addAnimation('run', [6, 7, 8, 9], 12, true) // Fast run cycle
    catSprite.addAnimation('crouch', [10, 11], 4, true) // Crouch idle/sneak
    catSprite.addAnimation('jump', [12, 13, 14, 15], 10, false) // Jump sequence
    catSprite.addAnimation('land', [16, 17], 8, false) // Landing sequence

    // Set initial animation
    catSprite.play('idle')

    // Attach to player
    this.player.createAnimatedSprite(catSprite)

    // Add black outline to player sprite for cartoon look
    if (this.player.sprite) {
      const playerOutline = OutlineEffect.addOutline(this.player.sprite, 0.08, 0x000000)
      this.scene.add(playerOutline)
      this.player.outlineMesh = playerOutline
      this.outlines.push({ mesh: playerOutline, parent: this.player.sprite })
    }

    console.log('🎨 Player now using animated sprite!')

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
    this.cameraController.setBounds(-20, 130, 0, 15) // Extended bounds for longer level

    console.log('🐱 Player created at position:', this.player.position)
  }

  /**
   * Load a level from the level manager
   */
  loadLevel() {
    // Clear existing level content
    this.clearLevel()

    // Get level data
    this.currentLevelData = this.levelManager.getCurrentLevel()
    const level = this.currentLevelData

    console.log(`📍 Loading Level ${this.levelManager.currentLevel}: ${level.name}`)

    // Set background color and fog
    this.scene.background = new THREE.Color(level.backgroundColor)
    this.scene.fog = new THREE.FogExp2(level.backgroundColor, 0.015)

    // Set camera bounds
    this.cameraController.setBounds(
      level.cameraBounds.minX,
      level.cameraBounds.maxX,
      level.cameraBounds.minY,
      level.cameraBounds.maxY
    )

    // Position player at start
    this.player.position.set(level.playerStart.x, level.playerStart.y, 0)
    this.initialPositions.player = { ...level.playerStart }

    // Setup lighting
    this.setupLighting()

    // Setup parallax background
    this.parallaxBackground = ParallaxBackground.createDefault(this.scene, this.camera)

    // Create platforms
    level.platforms.forEach(p => {
      this.createPlatform(p.x, p.y, p.width, p.height, p.type)
    })

    // Initialize detection system
    if (!this.detectionSystem) {
      this.detectionSystem = new DetectionSystem(
        this.scene,
        this.player,
        (enemy) => this.onPlayerDetected(enemy)
      )
    }

    // Initialize vision cone renderer
    if (!this.visionConeRenderer) {
      this.visionConeRenderer = new VisionConeRenderer(this.scene, this.detectionSystem, this.player)
    }

    // Create enemies
    level.enemies.forEach(e => {
      if (e.type === 'human') {
        this.createHuman(e.x, e.y, e.patrol)
      } else if (e.type === 'dog') {
        this.createDog(e.x, e.y, e.patrol)
      } else if (e.type === 'camera') {
        this.createCamera(e.x, e.y, e.rotationSpeed, e.rotationRange)
      }
    })

    // Create hiding spots
    level.hidingSpots.forEach(h => {
      this.createHidingSpot(h.x, h.y, h.type)
    })

    // Create distractions
    level.distractions.forEach(d => {
      this.createDistraction(d.x, d.y, d.type)
    })

    // Create goal
    this.createGoal(level.goalPosition.x, level.goalPosition.y)

    // Register platforms as obstacles
    this.platforms.forEach(platform => {
      this.detectionSystem.registerObstacle(platform)
    })

    // Store initial enemy positions for restart
    this.initialPositions.enemies = []
    this.enemies.forEach(enemy => {
      this.initialPositions.enemies.push({
        position: { x: enemy.position.x, y: enemy.position.y },
        patrol: enemy.patrolPath || null
      })
    })

    console.log(`✅ Level loaded: ${this.enemies.length} enemies, ${this.hidingSpots.length} hiding spots, ${this.distractions.length} distractions`)
  }

  /**
   * Clear current level content
   */
  clearLevel() {
    // Remove all outlines
    this.outlines.forEach(outline => {
      if (outline.mesh) {
        this.scene.remove(outline.mesh)
        outline.mesh.geometry?.dispose()
        outline.mesh.material?.dispose()
      }
    })
    this.outlines = []

    // Remove all enemies
    this.enemies.forEach(enemy => {
      if (enemy.sprite) {
        this.scene.remove(enemy.sprite)
        enemy.sprite.geometry?.dispose()
        enemy.sprite.material?.dispose()
      }
      if (enemy.animatedSprite) {
        this.scene.remove(enemy.animatedSprite.mesh)
        enemy.animatedSprite.mesh.geometry?.dispose()
        enemy.animatedSprite.mesh.material?.dispose()
      }
      if (enemy.label) {
        this.scene.remove(enemy.label)
      }
      if (enemy.spotlight) {
        this.scene.remove(enemy.spotlight)
      }
    })
    this.enemies = []

    // Remove vision cones
    if (this.visionConeRenderer) {
      this.visionConeRenderer.dispose()
    }

    // Remove hiding spots
    this.hidingSpots.forEach(spot => {
      if (spot.sprite) {
        this.scene.remove(spot.sprite)
        spot.sprite.geometry?.dispose()
        spot.sprite.material?.dispose()
      }
      if (spot.label) {
        this.scene.remove(spot.label)
      }
    })
    this.hidingSpots = []

    // Remove distractions
    this.distractions.forEach(dist => {
      if (dist.sprite) {
        this.scene.remove(dist.sprite)
        dist.sprite.geometry?.dispose()
        dist.sprite.material?.dispose()
      }
      if (dist.label) {
        this.scene.remove(dist.label)
      }
    })
    this.distractions = []

    // Remove platforms
    this.platforms.forEach(platform => {
      if (platform.sprite) {
        this.scene.remove(platform.sprite)
        platform.sprite.geometry?.dispose()
        platform.sprite.material?.dispose()
      }
    })
    this.platforms = []

    // Remove goal
    if (this.goalMarker) {
      this.scene.remove(this.goalMarker)
      this.goalMarker.geometry?.dispose()
      this.goalMarker.material?.dispose()
      this.goalMarker = null
    }
    if (this.goalGlowMesh) {
      this.glowEffect.removeGlow(this.goalGlowMesh)
      this.goalGlowMesh = null
    }
    if (this.goalLabel) {
      this.scene.remove(this.goalLabel)
      this.goalLabel = null
    }

    // Clear parallax background
    if (this.parallaxBackground) {
      this.parallaxBackground.layers.forEach(layer => {
        this.scene.remove(layer.mesh)
        layer.mesh.geometry?.dispose()
        layer.mesh.material?.dispose()
      })
      this.parallaxBackground = null
    }

    this.goalReached = false
  }

  setupStealthSystems() {
    // Initialize detection system with callback
    this.detectionSystem = new DetectionSystem(
      this.scene,
      this.player,
      (enemy) => this.onPlayerDetected(enemy)
    )

    // Initialize vision cone renderer with detection system and player for occlusion
    this.visionConeRenderer = new VisionConeRenderer(this.scene, this.detectionSystem, this.player)

    // PHASE 2 LEVEL: Multi-path with all enemy types!

    // === AREA 1: HUMAN PATROL (Easy Start) ===
    console.log('🏠 Creating Phase 2 Level: The House')

    // Human guard patrolling entrance area
    const humanPatrol = [
      { x: 0, y: 1 },
      { x: 8, y: 1 }
    ]
    this.createHuman(4, 1, humanPatrol)

    // Hiding spots for Area 1
    this.createHidingSpot(-8, 1, 'box')
    this.createHidingSpot(10, 1, 'shadow')

    // Distraction to lure guard away
    this.createDistraction(2, 4, 'vase')

    // === AREA 2: DOG PATROL (Medium difficulty) ===
    // Dog patrolling middle area - more sensitive to sound!
    const dogPatrol = [
      { x: 15, y: 1 },
      { x: 22, y: 1 }
    ]
    this.createDog(18, 1, dogPatrol)

    // Hiding spots for Area 2
    this.createHidingSpot(14, 1, 'furniture')
    this.createHidingSpot(23, 1, 'shadow')

    // More distractions to confuse the dog
    this.createDistraction(17, 4, 'book')
    this.createDistraction(20, 4, 'plant')

    // === AREA 3: CAMERA + HUMAN (Hard) ===
    // Rotating camera watching narrow corridor
    this.createCamera(32, 6, 0.8, Math.PI / 1.5) // Slow sweep, wide angle

    // Human guard in same area
    const endGuardPatrol = [
      { x: 28, y: 1 },
      { x: 36, y: 1 }
    ]
    this.createHuman(32, 1, endGuardPatrol)

    // Hiding spots for Area 3
    this.createHidingSpot(29, 1, 'box')
    this.createHidingSpot(35, 1, 'curtain')

    // Distraction
    this.createDistraction(33, 4, 'frame')

    // === AREA 4: NEW EXTENDED AREA (Dog + Camera) ===
    // Dog patrol in new area
    const dogPatrol2 = [
      { x: 45, y: 1 },
      { x: 56, y: 1 }
    ]
    this.createDog(50, 1, dogPatrol2)

    // Camera watching area 4
    this.createCamera(58, 6, 1.0, Math.PI / 2)

    // Hiding spots for Area 4
    this.createHidingSpot(42, 1, 'shadow')
    this.createHidingSpot(53, 1, 'furniture')
    this.createHidingSpot(60, 1, 'box')

    // Distractions
    this.createDistraction(55, 4, 'vase')
    this.createDistraction(72, 4, 'plant')

    // === AREA 5: FINAL CHALLENGE (Multiple Enemies) ===
    // Human guard patrolling final stretch
    const finalHumanPatrol = [
      { x: 68, y: 1 },
      { x: 80, y: 1 }
    ]
    this.createHuman(74, 1, finalHumanPatrol)

    // Another dog patrol
    const dogPatrol3 = [
      { x: 85, y: 1 },
      { x: 95, y: 1 }
    ]
    this.createDog(90, 1, dogPatrol3)

    // Final camera
    this.createCamera(100, 6, 0.7, Math.PI / 1.8)

    // Hiding spots for Area 5
    this.createHidingSpot(70, 1, 'curtain')
    this.createHidingSpot(82, 1, 'shadow')
    this.createHidingSpot(92, 1, 'furniture')
    this.createHidingSpot(105, 1, 'box')

    // Final distractions
    this.createDistraction(88, 4, 'book')
    this.createDistraction(98, 4, 'frame')

    // === GOAL ===
    this.createGoal(115, 1)

    // Register platforms as obstacles for vision blocking
    this.platforms.forEach(platform => {
      this.detectionSystem.registerObstacle(platform)
    })

    // Store initial positions for restart
    this.initialPositions.enemies = []
    this.enemies.forEach(enemy => {
      this.initialPositions.enemies.push({
        position: { x: enemy.position.x, y: enemy.position.y },
        patrol: enemy.patrolPath || null
      })
    })

    console.log(`🕵️  Created ${this.enemies.length} enemies (humans, dogs, cameras)`)
    console.log(`📦 Created ${this.hidingSpots.length} hiding spots`)
    console.log(`💥 Created ${this.distractions.length} distractions`)
    console.log(`🎯 Goal is at x=45 - Navigate through all areas!`)
    console.log(`💡 TIP: Use distractions to lure enemies away!`)
  }

  createHuman(x, y, patrolPath) {
    const human = new Human(this.scene, patrolPath)
    human.position.set(x, y, 0)

    // Create animated sprite for guard
    const guardData = TextureGenerator.createGuardSpriteSheet()
    const guardSpriteSheet = new SpriteSheet(
      guardData.texture,
      guardData.frameSize,
      guardData.frameSize,
      guardData.columns,
      guardData.rows
    )

    const guardSprite = new AnimatedSprite(this.scene, guardSpriteSheet, 2, 2.5)

    // Add animations
    guardSprite.addAnimation('idle', [0], 1, true)
    guardSprite.addAnimation('walk', [0, 1, 2, 3], 6, true)
    guardSprite.addAnimation('alert', [4, 5], 8, true)
    guardSprite.addAnimation('search', [6, 7], 4, true)

    guardSprite.play('walk')
    human.createAnimatedSprite(guardSprite)

    // Add black outline to guard sprite
    if (human.sprite) {
      const guardOutline = OutlineEffect.addOutline(human.sprite, 0.08, 0x000000)
      this.scene.add(guardOutline)
      human.outlineMesh = guardOutline
      this.outlines.push({ mesh: guardOutline, parent: human.sprite })
    }

    console.log('🎨 Guard now using animated sprite!')

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

  createDog(x, y, patrolPath) {
    const dog = new Dog(this.scene, patrolPath)
    dog.position.set(x, y, 0)

    // Create animated sprite for dog
    const dogData = TextureGenerator.createDogSpriteSheet()
    const dogSpriteSheet = new SpriteSheet(
      dogData.texture,
      dogData.frameSize,
      dogData.frameSize,
      dogData.columns,
      dogData.rows
    )

    const dogSprite = new AnimatedSprite(this.scene, dogSpriteSheet, 2, 1.5)

    // Add animations
    dogSprite.addAnimation('walk', [0, 1, 2, 3], 8, true)
    dogSprite.addAnimation('run', [0, 1, 2, 3], 12, true)

    dogSprite.play('walk')
    dog.createAnimatedSprite(dogSprite)

    // Add black outline to dog sprite
    if (dog.sprite) {
      const dogOutline = OutlineEffect.addOutline(dog.sprite, 0.08, 0x000000)
      this.scene.add(dogOutline)
      dog.outlineMesh = dogOutline
      this.outlines.push({ mesh: dogOutline, parent: dog.sprite })
    }

    console.log('🎨 Dog now using animated sprite!')

    // Add label
    dog.label = this.labelSystem.createLabel(
      'DOG (Sound Sensitive)',
      new THREE.Vector3(x, y + 2.5, 0),
      '#ff8800',
      36
    )

    // Register with systems
    this.enemies.push(dog)
    this.detectionSystem.registerEnemy(dog)

    // Create vision cone
    this.visionConeRenderer.createVisionCone(dog)

    return dog
  }

  createCamera(x, y, rotationSpeed = 1.0, rotationRange = Math.PI / 2) {
    const camera = new Camera(this.scene, x, y, rotationSpeed, rotationRange)

    // Create visual representation (dark gray box for camera)
    camera.createColorSprite(0x333333, camera.size.width, camera.size.height)

    // Add black outline to camera sprite
    if (camera.sprite) {
      const cameraOutline = OutlineEffect.addOutline(camera.sprite, 0.08, 0x000000)
      this.scene.add(cameraOutline)
      camera.outlineMesh = cameraOutline
      this.outlines.push({ mesh: cameraOutline, parent: camera.sprite })
    }

    // Add spotlight effect if lighting system is available
    if (this.lightingSystem) {
      // Spotlight shines downward from camera
      camera.spotlight = this.lightingSystem.createSpotlight(
        x,
        y,
        2, // direction = down
        60, // wide angle
        8, // distance
        0xFFFFCC // warm white light
      )
    }

    // Add label
    camera.label = this.labelSystem.createLabel(
      'CAMERA (Rotating)',
      new THREE.Vector3(x, y + 2, 0),
      '#00AAFF',
      36
    )

    // Register with systems
    this.enemies.push(camera)
    this.detectionSystem.registerEnemy(camera)

    // Create vision cone
    this.visionConeRenderer.createVisionCone(camera)

    return camera
  }

  createDistraction(x, y, type) {
    const distraction = new Distraction(this.scene, x, y, type)

    // Add label
    let labelText = `${type.toUpperCase()} - Press E`
    distraction.label = this.labelSystem.createLabel(
      labelText,
      new THREE.Vector3(x, y + 2, 0),
      '#FFD700',
      28
    )

    // Add glow effect to make distractions visible
    if (distraction.sprite && this.glowEffect) {
      distraction.glowMesh = this.glowEffect.addGlow(distraction.sprite, 0xFFD700, 1.3, 2.0)
    }

    this.distractions.push(distraction)
    console.log(`💥 Created ${type} distraction at x=${x}, y=${y}`)
    return distraction
  }

  createHidingSpot(x, y, type) {
    const spot = new HidingSpot(this.scene, x, y, type)

    // Add label
    let labelText = 'HIDING SPOT'
    if (type === 'box') labelText = 'HIDING (Box) - Press E'
    if (type === 'shadow') labelText = 'HIDING (Shadow) - Press E'
    if (type === 'furniture') labelText = 'HIDING (Furniture) - Press E'
    if (type === 'curtain') labelText = 'HIDING (Curtain) - Press E'

    spot.label = this.labelSystem.createLabel(
      labelText,
      new THREE.Vector3(x, y + 2.5, 0),
      '#44ff44',
      32
    )

    // Add glow effect to make it more visible
    if (spot.sprite && this.glowEffect) {
      spot.glowMesh = this.glowEffect.addGlow(spot.sprite, 0x44ff44, 1.2, 1.5)
    }

    this.hidingSpots.push(spot)
    console.log(`📦 Created ${type} hiding spot at x=${x}, y=${y}`)
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
    this.goalMarker.rotation.x = Math.PI / 12 // Tilt back for 3D perspective
    this.scene.add(this.goalMarker)

    // Add bright glow effect to make goal stand out
    if (this.glowEffect) {
      this.goalGlowMesh = this.glowEffect.addGlow(this.goalMarker, 0x00ff00, 2.0, 3.0)
    }

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

    // Setup progress bar range if it exists
    if (this.progressBar && this.player) {
      this.progressBar.setRange(this.player.position.x, x)
    }

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

    // Create parallax background for depth
    this.parallaxBackground = ParallaxBackground.createDefault(this.scene, this.camera)

    // Phase 2 Level - "The House" - Extended!
    // Long main floor with wood tiles
    this.createPlatform(50, 0, 150, 1, 'wood')

    // Upper platforms for distractions (wood shelves)
    this.createPlatform(2, 3.5, 4, 0.5, 'wood') // Platform for vase
    this.createPlatform(17, 3.5, 4, 0.5, 'wood') // Platform for book
    this.createPlatform(20, 3.5, 3, 0.5, 'wood') // Platform for plant
    this.createPlatform(33, 3.5, 4, 0.5, 'wood') // Platform for frame
    this.createPlatform(55, 3.5, 4, 0.5, 'wood') // New platform
    this.createPlatform(72, 3.5, 4, 0.5, 'wood') // New platform
    this.createPlatform(88, 3.5, 4, 0.5, 'wood') // New platform

    // Cover platforms (can hide behind/use for navigation) - carpet for variety
    this.createPlatform(6, 3, 2, 0.5, 'carpet')
    this.createPlatform(12, 3, 2, 0.5, 'wood')
    this.createPlatform(25, 3, 2, 0.5, 'carpet')
    this.createPlatform(38, 3, 2, 0.5, 'wood')
    this.createPlatform(48, 3, 2, 0.5, 'carpet')
    this.createPlatform(62, 3, 2, 0.5, 'wood')
    this.createPlatform(78, 3, 2, 0.5, 'carpet')
    this.createPlatform(95, 3, 2, 0.5, 'wood')

    console.log(`🏗️  Created Phase 2 level: The House (Extended with Parallax)`)
  }

  createPlatform(x, y, width, height, tileType = 'wood') {
    const platform = new Platform(this.scene, x, y, width, height, tileType)
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

    // Update player
    this.player.update(deltaTime)

    // Check platform collisions
    this.checkPlatformCollisions()

    // Check if player fell off the map
    this.checkFallDeath()

    // Update enemies
    this.enemies.forEach(enemy => enemy.update(deltaTime))

    // Update player alert markers based on nearby enemies
    this.updatePlayerAlerts()

    // Update hiding spots (syncs sprite positions)
    this.hidingSpots.forEach(spot => spot.update(deltaTime))

    // Update distractions
    this.distractions.forEach(dist => dist.update(deltaTime))

    // Update platforms (syncs sprite positions)
    this.platforms.forEach(platform => platform.update(deltaTime))

    // Update detection system
    this.detectionSystem.update(deltaTime)

    // Update vision cone renderer
    this.visionConeRenderer.update(elapsedTime)

    // Check hiding spot interactions (BEFORE clearing input!)
    const hidingSpotsHandledInteraction = this.checkHidingSpots()

    // Check distraction interactions (only if hiding spots didn't handle it)
    if (!this.player.isHiding && !hidingSpotsHandledInteraction) {
      this.checkDistractions()
    }

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

    // Update visual effects
    if (this.glowEffect) {
      this.glowEffect.update(deltaTime)
    }
    if (this.particleSystem) {
      this.particleSystem.update(deltaTime)
    }

    // Update all sprite outlines to match their parent sprites
    this.outlines.forEach(outline => {
      if (outline.mesh && outline.parent) {
        OutlineEffect.updateOutline(outline.mesh, outline.parent, 0.08)
      }
    })

    // Update parallax background
    if (this.parallaxBackground) {
      this.parallaxBackground.update(deltaTime)
    }

    // Update progress bar
    if (this.progressBar) {
      this.progressBar.update(this.player.position.x)
    }

    // Update UI with highest detection level from all enemies
    let maxDetectionLevel = 0
    this.enemies.forEach(enemy => {
      if (enemy.detectionLevel > maxDetectionLevel) {
        maxDetectionLevel = enemy.detectionLevel
      }
    })
    this.ui.updateDetectionLevel(maxDetectionLevel)

    // Update lighting system
    if (this.lightingSystem) {
      this.lightingSystem.update(deltaTime)

      // Set danger level based on detection (0 = safe, 1 = fully detected)
      const dangerLevel = maxDetectionLevel
      this.lightingSystem.setDanger(dangerLevel)
    }

    // Debug info
    if (this.debugMode) {
      this.showDebugInfo()
    }

    // Update input manager at the END (clears pressed/released states for next frame)
    this.inputManager.update()
  }

  checkHidingSpots() {
    // Check if player wants to exit via movement
    if (this.player.isHiding) {
      const wantsToMove = this.inputManager.left || this.inputManager.right ||
                          this.inputManager.jump || this.inputManager.run

      if (wantsToMove) {
        // Exit hiding via movement
        console.log('🚪 Exiting hiding via movement...')
        this.hidingSpots.forEach(spot => {
          if (spot.occupant === this.player) {
            spot.exit(this.player)
          }
        })
        return true // Handled interaction
      }
    }

    // Find nearest hiding spot
    let nearestSpot = null
    let nearestDistance = Infinity

    this.hidingSpots.forEach(spot => {
      const distance = spot.position.distanceTo(this.player.position)

      // Visual feedback: Make hiding spot pulse white when nearby
      if (distance < spot.interactionRange && spot.sprite) {
        // Change to bright white when in range (SUPER visible!)
        spot.sprite.material.color.setHex(0xFFFFFF)
      } else if (spot.sprite) {
        // Reset to original color
        if (spot.type === 'box') {
          spot.sprite.material.color.setHex(0xFF8800) // Bright orange
        } else if (spot.type === 'shadow') {
          spot.sprite.material.color.setHex(0x00FFFF) // Bright cyan
        }
      }

      if (spot.canInteract(this.player)) {
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestSpot = spot
        }
      }
    })

    // Handle interaction
    if (this.inputManager.interact) {
      console.log('🔑 E key pressed!')
      console.log('   Player position:', this.player.position.x.toFixed(2), this.player.position.y.toFixed(2))
      console.log('   Player is hiding:', this.player.isHiding)
      console.log('   Nearest spot:', nearestSpot ? `${nearestSpot.type} at distance ${nearestDistance.toFixed(2)}` : 'none')

      if (this.player.isHiding) {
        // Exit hiding
        console.log('🚪 Trying to exit hiding...')
        this.hidingSpots.forEach(spot => {
          if (spot.occupant === this.player) {
            spot.exit(this.player)
          }
        })
        return true // Handled interaction
      } else if (nearestSpot) {
        // Enter hiding
        console.log('📦 Entering hiding spot!')
        nearestSpot.enter(this.player)
        return true // Handled interaction
      } else {
        console.log('❌ No hiding spot nearby!')
        console.log(`   Interaction range: 1.5 units`)
        console.log(`   All hiding spots:`)
        this.hidingSpots.forEach((spot, i) => {
          const dist = spot.position.distanceTo(this.player.position)
          console.log(`   ${i+1}. ${spot.type} at x=${spot.position.x}, distance: ${dist.toFixed(2)} units`)
        })
      }
    }

    // Store nearest spot for potential UI prompts later
    this.nearestHidingSpot = nearestSpot
    return false // Did not handle interaction
  }

  checkDistractions() {
    // Find nearest distraction
    let nearestDist = null
    let nearestDistance = Infinity

    this.distractions.forEach(dist => {
      if (dist.hasBeenKnocked) return

      const distance = dist.position.distanceTo(this.player.position)

      // Visual feedback: Make distraction brighter when nearby
      if (distance < dist.interactionRange && dist.sprite) {
        dist.sprite.material.color.setHex(0xFFFFFF) // White when in range
      } else if (dist.sprite) {
        // Reset to original bright color based on type
        switch (dist.type) {
          case 'vase':
            dist.sprite.material.color.setHex(0xFF1493) // Bright pink
            break
          case 'book':
            dist.sprite.material.color.setHex(0xFF4500) // Bright orange
            break
          case 'frame':
            dist.sprite.material.color.setHex(0xFFD700) // Gold
            break
          case 'plant':
            dist.sprite.material.color.setHex(0x00FF00) // Bright green
            break
        }
      }

      if (dist.canInteract(this.player)) {
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestDist = dist
        }
      }
    })

    // Handle interaction - separate from checking
    if (this.inputManager.interact) {
      console.log('🔑 E pressed - checking distractions')
      console.log('   Player hiding?', this.player.isHiding)
      console.log('   Nearest distraction:', nearestDist ? nearestDist.type : 'none')

      if (!this.player.isHiding && nearestDist) {
        try {
          console.log(`💥 Knocking over ${nearestDist.type}...`)
          const soundEvent = nearestDist.knockOver(this.player)

          if (soundEvent) {
            console.log('   Sound event created:', soundEvent)

            // Notify all enemies of the noise (with safety checks)
            let enemiesNotified = 0
            this.enemies.forEach((enemy, index) => {
              try {
                if (enemy && enemy.onSoundHeard && typeof enemy.onSoundHeard === 'function') {
                  console.log(`   Notifying enemy ${index} (${enemy.constructor.name})`)
                  enemy.onSoundHeard(soundEvent.position, soundEvent.radius)
                  enemiesNotified++
                } else {
                  console.log(`   Skipping enemy ${index} - no sound hearing`)
                }
              } catch (err) {
                console.error(`   Error notifying enemy ${index}:`, err)
              }
            })

            console.log(`   Notified ${enemiesNotified} enemies`)

            // Hide the label
            if (nearestDist.label) {
              nearestDist.label.visible = false
            }
          }
        } catch (error) {
          console.error('❌ Error in distraction interaction:', error)
          console.error('Stack:', error.stack)
        }
      }
    }
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

    // Update hiding spot labels (in case they moved or weren't positioned correctly)
    this.hidingSpots.forEach(spot => {
      if (spot.label) {
        this.labelSystem.updateLabelPosition(spot.label, spot.position, 2.5)
      }
    })

    // Update distraction labels
    this.distractions.forEach(dist => {
      if (dist.label && !dist.hasBeenKnocked) {
        this.labelSystem.updateLabelPosition(dist.label, dist.position, 2)
      }
    })

    // Update goal label position (in case it's animating)
    if (this.goalLabel) {
      this.labelSystem.updateLabelPosition(this.goalLabel,
        new THREE.Vector3(this.goalPosition.x, this.goalPosition.y + 2.5, 0),
        0)
    }
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

      // Check if there's a next level
      if (this.levelManager.hasNextLevel()) {
        const nextLevelNum = this.levelManager.currentLevel + 1
        this.ui.showStatus(`LEVEL ${this.levelManager.currentLevel} COMPLETE! Loading Level ${nextLevelNum}...`, '#44ff44', 3000)

        // Load next level after short delay
        setTimeout(() => {
          this.levelManager.nextLevel()
          this.loadLevel()
          this.paused = false
        }, 3000)
      } else {
        // No more levels - game complete!
        this.ui.showStatus('🎊 GAME COMPLETE! ALL LEVELS FINISHED! 🎊', '#44ff44', 5000)

        // Pause game after short delay
        setTimeout(() => {
          this.paused = true
          console.log('🎊 Congratulations! You completed all levels!')
        }, 3000)
      }
    }
  }

  /**
   * Check if player fell below the map
   */
  checkFallDeath() {
    if (this.isRestarting) return

    // Death threshold - if player falls below this, they die
    const deathY = -5

    if (this.player.position.y < deathY) {
      console.log('💀 Player fell off the map!')
      this.ui.showStatus('FELL! Restarting...', '#ff4444', 2000)
      this.isRestarting = true

      // Wait 2 seconds then restart
      setTimeout(() => {
        this.restartLevel()
      }, 2000)
    }
  }

  /**
   * Update player alert markers based on nearby enemy detection
   */
  updatePlayerAlerts() {
    if (!this.player) return

    // Find maximum detection level from all enemies
    let maxDetection = 0
    let enemySearching = false
    const searchRadius = 15 // Distance to consider enemy "nearby"

    this.enemies.forEach(enemy => {
      // Check if enemy is nearby
      const distance = Math.abs(enemy.position.x - this.player.position.x)

      // Check if enemy has detected player or is searching
      if (enemy.detectionLevel > maxDetection) {
        maxDetection = enemy.detectionLevel
      }

      // Check if enemy is close and searching (for dogs running, guards searching)
      if (distance < searchRadius) {
        // Dogs in CHASING state or guards in SEARCHING state
        if (enemy.state === 'CHASING' || enemy.state === 'SEARCHING') {
          enemySearching = true
        }
      }
    })

    // Update player's detection state for alert markers
    this.player.detectionLevel = maxDetection
    this.player.enemyNearby = enemySearching
  }

  checkPlatformCollisions() {
    // Simple AABB collision detection with edge tolerance
    const playerBounds = this.player.getBounds()

    // Check if player is trying to drop through platforms
    const wantsToDropThrough = this.inputManager.down && this.player.isGrounded

    // If player wants to drop through, unground them immediately
    if (wantsToDropThrough) {
      this.player.isGrounded = false
      this.player.velocity.y = -1.0 // Stronger downward velocity
      console.log('🔽 Dropping through platform - velocity:', this.player.velocity.y)
    }

    // Track if player is actually on a platform
    let onPlatform = false

    this.platforms.forEach(platform => {
      const platformBounds = platform.getBounds()

      // Skip platforms if player is trying to drop through
      // Check if player is above or approximately on top of this platform
      const playerBottom = this.player.position.y - playerBounds.height / 2
      const platformTop = platformBounds.y + platformBounds.height
      const onTopOfThisPlatform = Math.abs(playerBottom - platformTop) < 1.0

      if (wantsToDropThrough && onTopOfThisPlatform) {
        console.log(`   Skipping platform at y=${platformBounds.y} (on top of it)`)
        return // Don't collide with platforms we're standing on
      }

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

        // Edge tolerance - ignore tiny side collisions when falling
        const edgeTolerance = 0.3

        // Resolve collision on the side with minimum overlap
        if (minOverlap === overlapTop && this.player.velocity.y <= 0) {
          // Landing on top of platform
          this.player.position.y = platformBounds.y + platformBounds.height + playerBounds.height / 2
          this.player.velocity.y = 0
          this.player.isGrounded = true
          onPlatform = true
        } else if (minOverlap === overlapBottom && this.player.velocity.y > 0) {
          // Hitting bottom of platform (bonking head)
          this.player.position.y = platformBounds.y - playerBounds.height / 2
          this.player.velocity.y = 0
        } else if (minOverlap === overlapLeft && overlapLeft > edgeTolerance) {
          // Hitting from the left - only if overlap is significant
          // AND player is actually moving into the platform
          if (this.player.velocity.x > 0) {
            this.player.position.x = platformBounds.x - playerBounds.width / 2
            this.player.velocity.x = 0
          }
        } else if (minOverlap === overlapRight && overlapRight > edgeTolerance) {
          // Hitting from the right - only if overlap is significant
          // AND player is actually moving into the platform
          if (this.player.velocity.x < 0) {
            this.player.position.x = platformBounds.x + platformBounds.width + playerBounds.width / 2
            this.player.velocity.x = 0
          }
        }
      }
    })

    // If player was grounded but is no longer on any platform, unground them (fixes floating)
    if (this.player.isGrounded && !onPlatform && !wantsToDropThrough) {
      // Check if player is truly over a platform (small tolerance for edge walking)
      const centerX = this.player.position.x
      const feetY = this.player.position.y - playerBounds.height / 2

      let overPlatform = false
      this.platforms.forEach(platform => {
        const platformBounds = platform.getBounds()
        const platLeft = platformBounds.x
        const platRight = platformBounds.x + platformBounds.width
        const platTop = platformBounds.y + platformBounds.height

        // Check if player's feet are near the platform top and horizontally aligned
        if (centerX > platLeft && centerX < platRight &&
            Math.abs(feetY - platTop) < 0.5) {
          overPlatform = true
        }
      })

      if (!overPlatform) {
        this.player.isGrounded = false
        console.log('🌊 Player walked off platform edge')
      }
    }
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

    this.ui.showStatus('DETECTED! Restarting...', '#ff4444', 2000)
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
