# Stealth Cat - Technical Architecture

## Overview
This document outlines the technical architecture for implementing a 2.5D sidescrolling stealth game using Three.js, building upon the existing WebGL foundation.

**Core Approach**: Use Three.js with orthographic camera for 2D gameplay while leveraging 3D capabilities for parallax depth, lighting, and atmospheric effects.

---

## Tech Stack

### Core Framework
- **Three.js 0.166.1**: 3D rendering engine
- **Vite 5.2.0**: Build tool and dev server
- **GLSL Shaders**: Custom visual effects (vision cones, lighting)
- **ES6 Modules**: Modern JavaScript architecture

### Additional Libraries (To Add)
- **Tweakpane** (optional): Debug controls during development
- **Stats.js** (optional): Performance monitoring

---

## Project Structure

```
/home/vibecode/workspace/
├── index.html                    # Entry point
├── style.css                     # Minimal styling
├── main.js                       # Scene initialization & game loop
├── src/
│   ├── core/
│   │   ├── Game.js              # Main game manager (singleton)
│   │   ├── SceneManager.js      # Three.js scene setup
│   │   ├── CameraController.js  # Orthographic camera with follow
│   │   ├── InputManager.js      # Keyboard/gamepad input
│   │   ├── TimeManager.js       # Delta time, game speed
│   │   └── StateManager.js      # Game state machine
│   ├── entities/
│   │   ├── Entity.js            # Base entity class
│   │   ├── Player.js            # Cat player controller
│   │   ├── Enemy.js             # Base enemy class
│   │   ├── Human.js             # Human patrol enemy
│   │   ├── Dog.js               # Dog enemy
│   │   ├── Camera.js            # Security camera
│   │   └── MotionSensor.js      # Motion sensor beam
│   ├── systems/
│   │   ├── DetectionSystem.js   # Vision cone & detection logic
│   │   ├── CollisionSystem.js   # AABB collision detection
│   │   ├── PhysicsSystem.js     # Gravity, jumping, movement
│   │   ├── AnimationSystem.js   # Sprite animation manager
│   │   ├── SoundSystem.js       # Sound propagation
│   │   └── AISystem.js          # Enemy patrol & behavior
│   ├── rendering/
│   │   ├── SpriteRenderer.js    # Sprite rendering using planes
│   │   ├── VisionConeRenderer.js# Vision cone shader
│   │   ├── LightingSystem.js    # Dynamic lighting
│   │   └── ParallaxManager.js   # Background layer management
│   ├── level/
│   │   ├── Level.js             # Level data structure
│   │   ├── LevelLoader.js       # Load level JSON
│   │   ├── Tilemap.js           # Tile-based collision
│   │   └── Checkpoint.js        # Save points
│   ├── ui/
│   │   ├── HUD.js               # In-game UI (lives, detection)
│   │   ├── Menu.js              # Menu system
│   │   └── UIManager.js         # UI state management
│   ├── utils/
│   │   ├── AssetLoader.js       # Texture & JSON loading
│   │   ├── Math.js              # Vector math helpers
│   │   ├── Raycaster.js         # Line-of-sight checks
│   │   └── Config.js            # Game constants
│   └── data/
│       ├── animations.json      # Animation definitions
│       └── levels/
│           ├── tutorial.json
│           ├── level1.json
│           └── ...
├── shaders/
│   ├── visionCone/
│   │   ├── vertex.glsl
│   │   └── fragment.glsl
│   └── lighting/
│       ├── vertex.glsl
│       └── fragment.glsl
└── public/
    ├── sprites/
    │   ├── cat/
    │   ├── enemies/
    │   ├── environment/
    │   └── vfx/
    └── audio/
        ├── music/
        └── sfx/
```

---

## Core Architecture

### 1. Game.js (Main Manager)

**Responsibilities**:
- Initialize all systems
- Manage game loop
- Coordinate between systems
- Handle game state transitions

```javascript
class Game {
  constructor() {
    this.scene = null
    this.camera = null
    this.renderer = null

    // Systems
    this.inputManager = new InputManager()
    this.stateManager = new StateManager()
    this.collisionSystem = new CollisionSystem()
    this.detectionSystem = new DetectionSystem()
    this.physicsSystem = new PhysicsSystem()
    this.animationSystem = new AnimationSystem()
    this.aiSystem = new AISystem()

    // Current level
    this.currentLevel = null
    this.player = null
    this.enemies = []

    // Game state
    this.paused = false
    this.lives = 9
  }

  init() {
    this.setupScene()
    this.setupCamera()
    this.setupRenderer()
    this.loadAssets()
    this.startGameLoop()
  }

  update(deltaTime) {
    if (this.paused) return

    // Update in order
    this.inputManager.update()
    this.player.update(deltaTime)
    this.aiSystem.update(deltaTime)
    this.physicsSystem.update(deltaTime)
    this.collisionSystem.update()
    this.detectionSystem.update(deltaTime)
    this.animationSystem.update(deltaTime)
    this.cameraController.update(deltaTime)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}
```

---

### 2. Camera System (Orthographic 2D)

**Key Features**:
- Orthographic projection (no perspective distortion)
- Smooth camera follow with lerping
- Camera bounds (don't show outside level)
- Look-ahead when moving

```javascript
class CameraController {
  constructor(camera, target) {
    this.camera = camera
    this.target = target // Player entity

    // Orthographic camera setup
    this.frustumSize = 20 // Units visible vertically
    this.aspect = window.innerWidth / window.innerHeight

    this.camera.left = -this.frustumSize * this.aspect / 2
    this.camera.right = this.frustumSize * this.aspect / 2
    this.camera.top = this.frustumSize / 2
    this.camera.bottom = -this.frustumSize / 2
    this.camera.near = 0.1
    this.camera.far = 1000
    this.camera.position.z = 10

    // Follow settings
    this.smoothness = 0.1
    this.lookAheadDistance = 3
    this.bounds = { minX: 0, maxX: 100, minY: 0, maxY: 20 }
  }

  update(deltaTime) {
    if (!this.target) return

    // Calculate desired position
    const targetPos = this.target.position.clone()

    // Add look-ahead based on player velocity
    const lookAhead = this.target.velocity.clone()
      .normalize()
      .multiplyScalar(this.lookAheadDistance)
    targetPos.add(lookAhead)

    // Smooth lerp
    this.camera.position.x = THREE.MathUtils.lerp(
      this.camera.position.x,
      targetPos.x,
      this.smoothness
    )
    this.camera.position.y = THREE.MathUtils.lerp(
      this.camera.position.y,
      targetPos.y,
      this.smoothness
    )

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

    this.camera.updateProjectionMatrix()
  }
}
```

---

### 3. Entity System

**Base Entity Class**:
All game objects (player, enemies, props) inherit from Entity.

```javascript
class Entity {
  constructor(scene) {
    this.scene = scene
    this.sprite = null // THREE.Mesh with sprite texture
    this.position = new THREE.Vector3(0, 0, 0)
    this.velocity = new THREE.Vector3(0, 0, 0)
    this.size = { width: 1, height: 1 }

    // Animation
    this.currentAnimation = null
    this.animationFrame = 0
    this.animationTime = 0

    // Collision
    this.collider = {
      offset: new THREE.Vector2(0, 0),
      size: new THREE.Vector2(1, 1)
    }

    // State
    this.isGrounded = false
    this.facing = 1 // 1 = right, -1 = left
  }

  createSprite(texture, width, height) {
    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.1
    })
    this.sprite = new THREE.Mesh(geometry, material)
    this.sprite.position.z = 1 // Layer for rendering order
    this.scene.add(this.sprite)
  }

  update(deltaTime) {
    // Override in subclasses
  }

  setAnimation(animName) {
    if (this.currentAnimation !== animName) {
      this.currentAnimation = animName
      this.animationFrame = 0
      this.animationTime = 0
    }
  }

  getBounds() {
    return {
      x: this.position.x + this.collider.offset.x,
      y: this.position.y + this.collider.offset.y,
      width: this.collider.size.x,
      height: this.collider.size.y
    }
  }
}
```

---

### 4. Player Controller

**Features**:
- Input-driven movement
- Platformer physics (gravity, jumping)
- Animation state machine
- Interaction with objects

```javascript
class Player extends Entity {
  constructor(scene, inputManager) {
    super(scene)
    this.input = inputManager

    // Movement stats
    this.walkSpeed = 4
    this.runSpeed = 8
    this.crouchSpeed = 2
    this.jumpForce = 12
    this.gravity = -30

    // State
    this.isCrouching = false
    this.isHiding = false
    this.isDetected = false

    // Sound detection radius
    this.soundRadius = 0
  }

  update(deltaTime) {
    if (this.isHiding) {
      this.updateHiding()
      return
    }

    // Horizontal movement
    let speed = this.walkSpeed
    if (this.input.isKeyDown('Shift')) {
      speed = this.runSpeed
      this.soundRadius = 5
    } else if (this.input.isKeyDown('Control')) {
      this.isCrouching = true
      speed = this.crouchSpeed
      this.soundRadius = 0
    } else {
      this.isCrouching = false
      this.soundRadius = 0
    }

    if (this.input.isKeyDown('ArrowLeft')) {
      this.velocity.x = -speed
      this.facing = -1
    } else if (this.input.isKeyDown('ArrowRight')) {
      this.velocity.x = speed
      this.facing = 1
    } else {
      this.velocity.x = 0
    }

    // Jump
    if (this.input.isKeyPressed('Space') && this.isGrounded) {
      this.velocity.y = this.jumpForce
      this.isGrounded = false
    }

    // Apply gravity
    if (!this.isGrounded) {
      this.velocity.y += this.gravity * deltaTime
    }

    // Update animation
    this.updateAnimation()

    // Update sprite position
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime))
    this.sprite.position.copy(this.position)
    this.sprite.scale.x = this.facing // Flip sprite
  }

  updateAnimation() {
    if (!this.isGrounded) {
      this.setAnimation('jump')
    } else if (this.velocity.x !== 0) {
      if (this.isCrouching) {
        this.setAnimation('crouch')
      } else if (Math.abs(this.velocity.x) > this.walkSpeed + 1) {
        this.setAnimation('run')
      } else {
        this.setAnimation('walk')
      }
    } else {
      this.setAnimation('idle')
    }
  }

  hide() {
    this.isHiding = true
    this.setAnimation('hide_peek')
    this.soundRadius = 0
  }

  exitHiding() {
    this.isHiding = false
  }
}
```

---

### 5. Detection System

**Responsibilities**:
- Check vision cones (raycasting)
- Sound propagation
- Detection state machine
- Alert nearby enemies

```javascript
class DetectionSystem {
  constructor(scene, player, enemies) {
    this.scene = scene
    this.player = player
    this.enemies = enemies
    this.raycaster = new THREE.Raycaster()
  }

  update(deltaTime) {
    this.enemies.forEach(enemy => {
      if (enemy.detectionState === 'alert') {
        this.updateChase(enemy, deltaTime)
      } else {
        this.checkVisionDetection(enemy, deltaTime)
        this.checkSoundDetection(enemy)
      }
    })
  }

  checkVisionDetection(enemy, deltaTime) {
    // Calculate angle to player
    const toPlayer = new THREE.Vector2(
      this.player.position.x - enemy.position.x,
      this.player.position.y - enemy.position.y
    )
    const distance = toPlayer.length()
    const angle = Math.atan2(toPlayer.y, toPlayer.x)

    // Check if in vision cone
    const enemyAngle = enemy.facing === 1 ? 0 : Math.PI
    const angleDiff = Math.abs(angle - enemyAngle)
    const inCone = angleDiff < enemy.visionAngle / 2 &&
                   distance < enemy.visionRange

    if (!inCone) {
      enemy.detectionLevel = Math.max(0, enemy.detectionLevel - deltaTime)
      return
    }

    // Raycast for line of sight
    const origin = new THREE.Vector3(enemy.position.x, enemy.position.y, 1)
    const target = new THREE.Vector3(this.player.position.x, this.player.position.y, 1)
    const direction = target.sub(origin).normalize()

    this.raycaster.set(origin, direction)
    const intersects = this.raycaster.intersectObjects(this.scene.children, true)

    // Filter for walls/obstacles
    const blocked = intersects.some(hit => {
      return hit.distance < distance && hit.object.userData.blocksVision
    })

    if (blocked) {
      enemy.detectionLevel = Math.max(0, enemy.detectionLevel - deltaTime)
      return
    }

    // Player is visible - increase detection
    let detectionSpeed = 1.0

    // Modify by player state
    if (this.player.isHiding) {
      detectionSpeed = 0
    } else if (this.player.isCrouching) {
      detectionSpeed *= 0.5
    }

    // Modify by distance
    detectionSpeed *= (1 - distance / enemy.visionRange)

    // Modify by lighting
    const lightLevel = this.getLightLevel(this.player.position)
    detectionSpeed *= lightLevel

    enemy.detectionLevel += detectionSpeed * deltaTime

    // Update state based on detection level
    if (enemy.detectionLevel >= 1.0) {
      enemy.detectionState = 'alert'
      this.triggerAlert(enemy)
    } else if (enemy.detectionLevel > 0.3) {
      enemy.detectionState = 'suspicious'
    } else {
      enemy.detectionState = 'unaware'
    }
  }

  checkSoundDetection(enemy) {
    const distance = this.player.position.distanceTo(enemy.position)

    if (distance < this.player.soundRadius) {
      enemy.investigatePosition = this.player.position.clone()
      enemy.detectionState = 'suspicious'
    }
  }

  triggerAlert(enemy) {
    // Alert nearby enemies
    this.enemies.forEach(other => {
      const distance = enemy.position.distanceTo(other.position)
      if (distance < 15) {
        other.detectionState = 'alert'
        other.chaseTarget = this.player
      }
    })

    // Trigger game over or life loss
    this.player.onDetected()
  }
}
```

---

### 6. Sprite Animation System

**Handles**:
- Sprite sheet texture updates
- Frame timing
- Direction management

```javascript
class AnimationSystem {
  constructor() {
    this.animations = {} // Loaded from animations.json
    this.entities = []
  }

  loadAnimations(json) {
    this.animations = json
  }

  registerEntity(entity) {
    this.entities.push(entity)
  }

  update(deltaTime) {
    this.entities.forEach(entity => {
      if (!entity.currentAnimation) return

      const anim = this.animations[entity.type][entity.currentAnimation]
      if (!anim) return

      entity.animationTime += deltaTime

      if (entity.animationTime >= anim.frameDuration) {
        entity.animationTime = 0
        entity.animationFrame++

        if (entity.animationFrame >= anim.frameCount) {
          if (anim.loop) {
            entity.animationFrame = 0
          } else {
            entity.animationFrame = anim.frameCount - 1
            entity.onAnimationComplete?.()
          }
        }

        this.updateSpriteTexture(entity, anim)
      }
    })
  }

  updateSpriteTexture(entity, anim) {
    // Calculate texture offset for sprite sheet
    const offsetX = (entity.animationFrame % anim.framesPerRow) * anim.frameWidth
    const offsetY = Math.floor(entity.animationFrame / anim.framesPerRow) * anim.frameHeight

    // Update UV coordinates
    entity.sprite.material.map.offset.x = offsetX / anim.sheetWidth
    entity.sprite.material.map.offset.y = offsetY / anim.sheetHeight
    entity.sprite.material.map.repeat.x = anim.frameWidth / anim.sheetWidth
    entity.sprite.material.map.repeat.y = anim.frameHeight / anim.sheetHeight
  }
}
```

---

### 7. Collision System (AABB)

**Simple 2D collision detection**:

```javascript
class CollisionSystem {
  constructor(tilemap, entities) {
    this.tilemap = tilemap
    this.entities = entities
  }

  update() {
    // Check entity vs tilemap
    this.entities.forEach(entity => {
      this.checkTilemapCollision(entity)
    })

    // Check entity vs entity
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        if (this.checkAABB(this.entities[i], this.entities[j])) {
          this.resolveCollision(this.entities[i], this.entities[j])
        }
      }
    }
  }

  checkAABB(a, b) {
    const boundsA = a.getBounds()
    const boundsB = b.getBounds()

    return boundsA.x < boundsB.x + boundsB.width &&
           boundsA.x + boundsA.width > boundsB.x &&
           boundsA.y < boundsB.y + boundsB.height &&
           boundsA.y + boundsA.height > boundsB.y
  }

  checkTilemapCollision(entity) {
    const bounds = entity.getBounds()

    // Get tiles in range
    const tiles = this.tilemap.getTilesInBounds(bounds)

    tiles.forEach(tile => {
      if (!tile.solid) return

      if (this.checkAABB(entity, tile)) {
        // Resolve collision
        const overlapX = Math.min(
          bounds.x + bounds.width - tile.x,
          tile.x + tile.width - bounds.x
        )
        const overlapY = Math.min(
          bounds.y + bounds.height - tile.y,
          tile.y + tile.height - bounds.y
        )

        // Push out of collision on smallest axis
        if (overlapX < overlapY) {
          if (bounds.x < tile.x) {
            entity.position.x -= overlapX
          } else {
            entity.position.x += overlapX
          }
          entity.velocity.x = 0
        } else {
          if (bounds.y < tile.y) {
            entity.position.y -= overlapY
            entity.isGrounded = false
          } else {
            entity.position.y += overlapY
            entity.isGrounded = true
          }
          entity.velocity.y = 0
        }
      }
    })
  }
}
```

---

### 8. AI System (Patrol & Investigation)

```javascript
class AISystem {
  constructor(enemies) {
    this.enemies = enemies
  }

  update(deltaTime) {
    this.enemies.forEach(enemy => {
      switch (enemy.detectionState) {
        case 'unaware':
          this.updatePatrol(enemy, deltaTime)
          break
        case 'suspicious':
          this.updateInvestigate(enemy, deltaTime)
          break
        case 'alert':
          this.updateChase(enemy, deltaTime)
          break
        case 'search':
          this.updateSearch(enemy, deltaTime)
          break
      }
    })
  }

  updatePatrol(enemy, deltaTime) {
    if (!enemy.patrolPath || enemy.patrolPath.length === 0) return

    const target = enemy.patrolPath[enemy.currentWaypoint]
    const direction = new THREE.Vector2(
      target.x - enemy.position.x,
      target.y - enemy.position.y
    )
    const distance = direction.length()

    if (distance < 0.5) {
      // Reached waypoint
      enemy.currentWaypoint = (enemy.currentWaypoint + 1) % enemy.patrolPath.length
      enemy.waitTimer = enemy.waypointWaitTime
    } else if (enemy.waitTimer <= 0) {
      // Move toward waypoint
      direction.normalize()
      enemy.velocity.x = direction.x * enemy.walkSpeed
      enemy.facing = direction.x > 0 ? 1 : -1
    } else {
      // Waiting at waypoint
      enemy.waitTimer -= deltaTime
      enemy.velocity.x = 0
    }
  }

  updateInvestigate(enemy, deltaTime) {
    if (!enemy.investigatePosition) {
      enemy.detectionState = 'unaware'
      return
    }

    const direction = new THREE.Vector2(
      enemy.investigatePosition.x - enemy.position.x,
      enemy.investigatePosition.y - enemy.position.y
    )
    const distance = direction.length()

    if (distance < 1) {
      // Reached investigation point
      enemy.investigateTimer = 3 // Look around for 3 seconds
      enemy.detectionState = 'search'
    } else {
      // Move toward sound source
      direction.normalize()
      enemy.velocity.x = direction.x * enemy.walkSpeed * 1.5
      enemy.facing = direction.x > 0 ? 1 : -1
    }
  }

  updateChase(enemy, deltaTime) {
    if (!enemy.chaseTarget) {
      enemy.detectionState = 'search'
      return
    }

    const direction = new THREE.Vector2(
      enemy.chaseTarget.position.x - enemy.position.x,
      enemy.chaseTarget.position.y - enemy.position.y
    )

    direction.normalize()
    enemy.velocity.x = direction.x * enemy.runSpeed
    enemy.facing = direction.x > 0 ? 1 : -1

    // If player is hidden, lose sight
    if (enemy.chaseTarget.isHiding) {
      enemy.detectionState = 'search'
      enemy.lastKnownPosition = enemy.chaseTarget.position.clone()
    }
  }

  updateSearch(enemy, deltaTime) {
    enemy.investigateTimer -= deltaTime

    if (enemy.investigateTimer <= 0) {
      // Give up search
      enemy.detectionState = 'unaware'
      enemy.detectionLevel = 0
      enemy.investigatePosition = null
    } else {
      // Look around (rotate facing direction)
      enemy.facing *= -1 // Simple back and forth
    }
  }
}
```

---

### 9. Vision Cone Renderer (Shader)

**Custom shader for vision cones**:

**vertex.glsl**:
```glsl
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

**fragment.glsl**:
```glsl
uniform float detectionState; // 0=unaware, 1=suspicious, 2=alert
uniform float detectionLevel; // 0.0 to 1.0
uniform vec3 coneColor;
uniform float time;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Radial gradient from center
  float dist = length(vUv - vec2(0.5, 0.0));
  float alpha = 1.0 - smoothstep(0.0, 1.0, dist);

  // Add scanning line effect
  float scan = sin(vPosition.x * 10.0 + time * 2.0) * 0.1 + 0.9;
  alpha *= scan;

  // Pulse based on detection level
  float pulse = sin(time * 3.0 * (1.0 + detectionState)) * 0.1 + 0.9;
  alpha *= pulse * (0.3 + detectionLevel * 0.5);

  gl_FragColor = vec4(coneColor, alpha);
}
```

**VisionConeRenderer.js**:
```javascript
class VisionConeRenderer {
  constructor(scene) {
    this.scene = scene
    this.cones = []
  }

  createVisionCone(enemy) {
    const geometry = new THREE.ConeGeometry(
      enemy.visionRange,
      enemy.visionRange,
      32,
      1,
      true,
      0,
      enemy.visionAngle
    )
    geometry.rotateX(Math.PI / 2)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        detectionState: { value: 0 },
        detectionLevel: { value: 0 },
        coneColor: { value: new THREE.Color(0x06ffa5) },
        time: { value: 0 }
      },
      vertexShader: visionVertexShader,
      fragmentShader: visionFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const cone = new THREE.Mesh(geometry, material)
    cone.position.z = 0.5 // Just above floor
    this.scene.add(cone)

    this.cones.push({ mesh: cone, enemy: enemy })
  }

  update(time) {
    this.cones.forEach(({ mesh, enemy }) => {
      // Update position
      mesh.position.x = enemy.position.x
      mesh.position.y = enemy.position.y

      // Update rotation (facing direction)
      mesh.rotation.z = enemy.facing === 1 ? 0 : Math.PI

      // Update shader uniforms
      mesh.material.uniforms.time.value = time
      mesh.material.uniforms.detectionLevel.value = enemy.detectionLevel

      // Update color based on state
      let color
      switch (enemy.detectionState) {
        case 'unaware':
          color = new THREE.Color(0x06ffa5) // Green
          mesh.material.uniforms.detectionState.value = 0
          break
        case 'suspicious':
          color = new THREE.Color(0xf4d35e) // Yellow
          mesh.material.uniforms.detectionState.value = 1
          break
        case 'alert':
          color = new THREE.Color(0xe63946) // Red
          mesh.material.uniforms.detectionState.value = 2
          break
      }
      mesh.material.uniforms.coneColor.value = color
    })
  }
}
```

---

## Level Data Format

**JSON structure for levels**:

```json
{
  "name": "The Living Room",
  "width": 100,
  "height": 20,
  "cameraBounds": {
    "minX": 0,
    "maxX": 100,
    "minY": 0,
    "maxY": 20
  },
  "playerStart": { "x": 5, "y": 2 },
  "objective": {
    "type": "reach",
    "position": { "x": 95, "y": 2 },
    "text": "Reach the kitchen"
  },
  "tilemap": {
    "tileSize": 1,
    "layers": [
      {
        "name": "floor",
        "data": [...]
      },
      {
        "name": "walls",
        "data": [...]
      }
    ]
  },
  "entities": [
    {
      "type": "human",
      "position": { "x": 30, "y": 2 },
      "patrolPath": [
        { "x": 30, "y": 2 },
        { "x": 40, "y": 2 },
        { "x": 40, "y": 5 },
        { "x": 30, "y": 5 }
      ],
      "waypointWaitTime": 2
    },
    {
      "type": "camera",
      "position": { "x": 50, "y": 8 },
      "rotation": 0,
      "sweepAngle": 90,
      "sweepDuration": 4
    },
    {
      "type": "hidingSpot",
      "position": { "x": 35, "y": 2 },
      "subtype": "box"
    }
  ],
  "lightingZones": [
    {
      "type": "shadow",
      "bounds": { "x": 0, "y": 0, "width": 10, "height": 20 },
      "intensity": 0.2
    },
    {
      "type": "roomLight",
      "position": { "x": 50, "y": 15 },
      "radius": 15,
      "intensity": 1.0
    }
  ],
  "collectibles": [
    {
      "type": "yarn",
      "position": { "x": 75, "y": 8 }
    }
  ]
}
```

---

## Performance Optimization

### Sprite Batching
- Use sprite atlases (texture packing)
- Batch static sprites into single geometry
- Use instanced rendering for particles

### Culling
- Frustum culling (only render visible objects)
- Update only nearby enemies (spatial partitioning)

### Object Pooling
- Reuse particle objects
- Pool VFX sprites

### LOD (Level of Detail)
- Reduce far background detail
- Simplify animations for distant enemies

---

## Development Roadmap

### Phase 1: Core Systems ✅ (To Implement)
1. Convert camera to orthographic
2. Set up sprite rendering system
3. Implement basic player movement
4. Create simple level with collision

### Phase 2: Player Mechanics
1. Animation system integration
2. Jump and crouch mechanics
3. Hiding spots interaction
4. Sound generation system

### Phase 3: Enemy AI
1. Patrol system with waypoints
2. Vision cone rendering
3. Detection gradual increase
4. Alert state and chase behavior

### Phase 4: Game Systems
1. Lives and checkpoint system
2. Level loading from JSON
3. UI (HUD, menus)
4. Level transitions

### Phase 5: Polish
1. Lighting and atmosphere
2. Particle effects
3. Sound effects and music
4. Additional levels

---

## Debug Tools

Useful debug visualizations:

```javascript
class DebugRenderer {
  drawColliders(entities) {
    entities.forEach(entity => {
      const bounds = entity.getBounds()
      // Draw wireframe box
    })
  }

  drawVisionCones(enemies) {
    // Already handled by VisionConeRenderer
  }

  drawSoundRadius(player) {
    // Draw circle showing sound range
  }

  drawPatrolPaths(enemies) {
    enemies.forEach(enemy => {
      // Draw lines between waypoints
    })
  }
}
```

---

*This architecture provides a solid foundation for building the stealth cat game using Three.js in 2.5D mode.*