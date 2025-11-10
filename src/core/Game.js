/**
 * Game - Main game manager coordinating all systems
 */

import * as THREE from 'three'
import { InputManager } from './InputManager.js'
import { CameraController } from './CameraController.js'
import { PhysicsSystem } from '../systems/PhysicsSystem.js'
import { Player } from '../entities/Player.js'
import { Platform } from '../entities/Platform.js'
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

    // Game entities
    this.player = null
    this.entities = []
    this.platforms = [] // Static platforms for collision

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
    this.setupEnvironment()
    this.setupEventListeners()

    console.log('🐱 Stealth Cat - Game Initialized')
    console.log('Controls: Arrow Keys/WASD = Move, Space = Jump, Shift = Run, Ctrl = Crouch')
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
    this.player.position.set(0, 5, 0) // Start position

    // Create a temporary colored sprite for the player (cat)
    this.player.createColorSprite(0xffaa66, 1, 1) // Orange color for cat

    // Register with physics system
    this.physicsSystem.registerEntity(this.player)

    // Setup camera controller to follow player
    this.cameraController = new CameraController(this.camera, this.player)
    this.cameraController.setBounds(-50, 50, 0, 20)
  }

  setupEnvironment() {
    // Add simple ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
    this.scene.add(ambientLight)

    // Create a simple ground plane for visual reference
    const groundGeometry = new THREE.PlaneGeometry(100, 1)
    const groundMaterial = new THREE.MeshBasicMaterial({
      color: Config.COLORS.SHADOW_BLUE
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.position.y = -0.5
    ground.position.z = 0
    this.scene.add(ground)

    // Add some reference walls/platforms
    this.createPlatform(-10, 3, 5, 0.5, Config.COLORS.MOONLIGHT_BLUE)
    this.createPlatform(10, 5, 5, 0.5, Config.COLORS.MOONLIGHT_BLUE)
    this.createPlatform(0, 8, 3, 0.5, Config.COLORS.MOONLIGHT_BLUE)
  }

  createPlatform(x, y, width, height, color) {
    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.MeshBasicMaterial({ color })
    const platform = new THREE.Mesh(geometry, material)
    platform.position.set(x, y, 0)
    this.scene.add(platform)
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

    // Update physics
    // Note: Physics is currently integrated in Player.update()
    // Will be refactored to use PhysicsSystem in next phase
    // this.physicsSystem.update(deltaTime)

    // Update camera
    this.cameraController.update(deltaTime)

    // Debug info
    if (this.debugMode) {
      this.showDebugInfo()
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
