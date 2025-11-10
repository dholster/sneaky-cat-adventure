# Stealth Cat - Project Summary

## Project Overview

**Title**: Stealth Cat
**Genre**: 2.5D Sidescrolling Stealth Platformer
**Concept**: Control a cat sneaking through a house at night, avoiding detection by humans, dogs, cameras, and sensors to reach objectives.

**Visual Style**: Modern pixel art (64x64+ sprites) with cinematic lighting and atmospheric 2.5D depth effects.

**Technical Approach**: Three.js WebGL with orthographic camera for 2D gameplay, leveraging 3D capabilities for parallax backgrounds, dynamic lighting, and shader effects.

---

## Documentation Complete ✓

You now have a complete design foundation across four comprehensive documents:

### 1. **GAME_DESIGN.md** - Core Gameplay Design
- ✓ Complete gameplay loop and mechanics
- ✓ Player abilities (walk, run, crouch, jump, hide, pounce)
- ✓ Detection system (vision, sound, gradual detection)
- ✓ Five enemy types (humans, dogs, cameras, sensors, roomba)
- ✓ Level progression (5 levels + boss)
- ✓ Scoring and replayability systems
- ✓ Nine Lives system

### 2. **VISUAL_STYLE_GUIDE.md** - Art Direction
- ✓ Complete color palette (night-time atmospheric)
- ✓ Sprite specifications for all characters
- ✓ Animation requirements (320+ cat frames)
- ✓ Environment tilesets and props
- ✓ VFX design (vision cones, particles, lighting)
- ✓ UI/UX mockups
- ✓ Parallax background layers (2.5D depth)

### 3. **ASSET_LIST.md** - Production Checklist
- ✓ Complete frame count: ~1,010 frames total
- ✓ Priority system (P0/P1/P2)
- ✓ Production schedule (6-week roadmap)
- ✓ File naming conventions
- ✓ Export settings and atlas organization
- ✓ Audio asset reference list

### 4. **ARCHITECTURE.md** - Technical Implementation
- ✓ Complete code architecture
- ✓ Entity system design
- ✓ Detection system algorithm
- ✓ AI patrol and investigation behavior
- ✓ Vision cone shader (GLSL)
- ✓ Level JSON format
- ✓ Development roadmap (5 phases)

### 5. **LEVEL_DESIGN.md** - Level Framework
- ✓ Level design principles
- ✓ Tutorial level complete walkthrough
- ✓ 4 additional level concepts
- ✓ Boss level design
- ✓ Level creation checklist
- ✓ Difficulty scaling guidelines

---

## Project Status

### ✅ Phase 1: Design Foundation (COMPLETE)
All design documents are finished and ready for implementation.

### 🔄 Phase 2: Core Implementation (READY TO START)
Next steps involve converting the Three.js boilerplate into a functional game prototype.

---

## Implementation Roadmap

### Immediate Next Steps (Week 1-2)

#### Step 1: Scene Refactoring
**Goal**: Convert 3D scene to 2.5D orthographic setup
**Tasks**:
- [ ] Replace PerspectiveCamera with OrthographicCamera
- [ ] Remove/comment out existing 3D objects (cube, fox, fireflies)
- [ ] Set up camera bounds and follow system
- [ ] Test orthographic rendering

**Files to Modify**:
- `main.js` (camera setup)
- Create `src/core/CameraController.js`

---

#### Step 2: Sprite Rendering System
**Goal**: Display 2D sprites in Three.js
**Tasks**:
- [ ] Create `SpriteRenderer.js` class
- [ ] Load test sprite texture
- [ ] Render sprite on plane geometry
- [ ] Test sprite flipping (facing direction)

**Files to Create**:
- `src/rendering/SpriteRenderer.js`
- `src/utils/AssetLoader.js`

**Test Asset**: Use a simple 64x64 cat sprite placeholder (can be drawn in any pixel art tool)

---

#### Step 3: Input System
**Goal**: Keyboard input for player control
**Tasks**:
- [ ] Create `InputManager.js` with key tracking
- [ ] Implement key down/up/pressed detection
- [ ] Test with console.log output

**Files to Create**:
- `src/core/InputManager.js`

---

#### Step 4: Basic Player Movement
**Goal**: Move cat sprite with arrow keys
**Tasks**:
- [ ] Create `Entity.js` base class
- [ ] Create `Player.js` extending Entity
- [ ] Implement horizontal movement
- [ ] Add sprite flipping on direction change
- [ ] Make camera follow player

**Files to Create**:
- `src/entities/Entity.js`
- `src/entities/Player.js`

**Milestone**: Cat moves left/right, camera follows smoothly

---

#### Step 5: Physics & Platforming
**Goal**: Gravity and jumping
**Tasks**:
- [ ] Create `PhysicsSystem.js`
- [ ] Apply gravity to player
- [ ] Implement jump mechanic
- [ ] Add simple ground collision (flat floor)

**Files to Create**:
- `src/systems/PhysicsSystem.js`

**Milestone**: Cat jumps and lands on floor

---

#### Step 6: Basic Animation
**Goal**: Sprite animation system
**Tasks**:
- [ ] Create `AnimationSystem.js`
- [ ] Load animation data from JSON
- [ ] Implement frame updating
- [ ] Switch animations based on player state (idle/walk/jump)

**Files to Create**:
- `src/systems/AnimationSystem.js`
- `src/data/animations.json`

**Milestone**: Cat animates while moving

---

### Week 3-4: Enemy & Detection Systems

#### Step 7: First Enemy (Static Human)
**Goal**: Place a human enemy in scene
**Tasks**:
- [ ] Create `Enemy.js` base class
- [ ] Create `Human.js` extending Enemy
- [ ] Render human sprite
- [ ] Add idle animation

**Files to Create**:
- `src/entities/Enemy.js`
- `src/entities/Human.js`

---

#### Step 8: Vision Cone Rendering
**Goal**: Visual representation of enemy sight
**Tasks**:
- [ ] Create vision cone shader (GLSL)
- [ ] Create `VisionConeRenderer.js`
- [ ] Attach cone to enemy
- [ ] Rotate cone with enemy facing

**Files to Create**:
- `shaders/visionCone/vertex.glsl`
- `shaders/visionCone/fragment.glsl`
- `src/rendering/VisionConeRenderer.js`

**Milestone**: Green cone appears in front of enemy

---

#### Step 9: Detection Logic
**Goal**: Detect player in vision cone
**Tasks**:
- [ ] Create `DetectionSystem.js`
- [ ] Implement raycasting for line-of-sight
- [ ] Add gradual detection (0-100%)
- [ ] Change cone color based on detection level

**Files to Create**:
- `src/systems/DetectionSystem.js`
- `src/utils/Raycaster.js`

**Milestone**: Cone turns yellow/red when player is spotted

---

#### Step 10: Patrol AI
**Goal**: Enemy walks patrol route
**Tasks**:
- [ ] Create `AISystem.js`
- [ ] Implement waypoint patrol
- [ ] Add wait timers at waypoints
- [ ] Enemy faces direction of movement

**Files to Create**:
- `src/systems/AISystem.js`

**Milestone**: Enemy walks back and forth on patrol

---

### Week 5-6: Level Loading & Core Gameplay

#### Step 11: Tilemap System
**Goal**: Load level from JSON
**Tasks**:
- [ ] Create `Level.js` class
- [ ] Create `LevelLoader.js`
- [ ] Create `Tilemap.js` for collision
- [ ] Load tutorial level JSON

**Files to Create**:
- `src/level/Level.js`
- `src/level/LevelLoader.js`
- `src/level/Tilemap.js`
- `src/data/levels/tutorial.json`

---

#### Step 12: Collision System
**Goal**: Collide with walls and obstacles
**Tasks**:
- [ ] Create `CollisionSystem.js`
- [ ] Implement AABB collision detection
- [ ] Resolve collisions (push out)
- [ ] Test with tilemap walls

**Files to Create**:
- `src/systems/CollisionSystem.js`

**Milestone**: Player can't walk through walls

---

#### Step 13: Hiding Spots
**Goal**: Player can hide in boxes/furniture
**Tasks**:
- [ ] Detect nearby hiding spots
- [ ] Trigger hide animation
- [ ] Disable detection while hiding
- [ ] Exit hiding on input

**Milestone**: Player can hide and avoid detection

---

#### Step 14: Game Over & Checkpoint
**Goal**: Respawn system
**Tasks**:
- [ ] Implement lives system (9 lives)
- [ ] Create checkpoint system
- [ ] Respawn at last checkpoint when detected
- [ ] Display lives in HUD

**Files to Create**:
- `src/level/Checkpoint.js`
- `src/ui/HUD.js`

**Milestone**: First playable prototype complete!

---

### Week 7-8: Polish & Additional Features

#### Step 15: Sound Effects
**Goal**: Audio feedback
**Tasks**:
- [ ] Add footstep sounds
- [ ] Add detection alert sound
- [ ] Add ambient background music

---

#### Step 16: UI & Menus
**Goal**: Menu system
**Tasks**:
- [ ] Main menu
- [ ] Pause menu
- [ ] Level complete screen
- [ ] Rank display (S/A/B/C)

**Files to Create**:
- `src/ui/Menu.js`
- `src/ui/UIManager.js`

---

#### Step 17: Additional Levels
**Goal**: Expand content
**Tasks**:
- [ ] Create Level 1 JSON
- [ ] Create Level 2 JSON
- [ ] Test difficulty curve

---

#### Step 18: Polish Pass
**Goal**: Visual enhancements
**Tasks**:
- [ ] Add particle effects (dust, alerts)
- [ ] Improve lighting (dynamic shadows)
- [ ] Add parallax background layers
- [ ] Improve animations (smoothness)

---

## Asset Production Priorities

### Phase 1: MVP Assets (Start Immediately)
Required for first playable prototype:

**Critical Sprites**:
- Cat: Idle, Walk, Run, Jump (4 directions minimum) = ~80 frames
- Human: Idle, Walk (2 directions) = ~24 frames
- Environment: Basic floor tile, wall tile, box prop = ~5 tiles

**Total**: ~110 frames for MVP

### Phase 2: Alpha Assets (Week 3-4)
Add gameplay variety:
- Cat: All animations, 8 directions = 320 frames
- Human: Complete animations = 120 frames
- Dog: Basic animations = 100 frames
- Camera, sensors = 40 frames
- Full tileset = 200 tiles

### Phase 3: Polish Assets (Week 5-6)
Complete the experience:
- VFX sprites
- UI elements
- Additional variants
- Particle effects

---

## Technical Stack Setup

### Dependencies to Add
```bash
# No additional dependencies required!
# Current stack is sufficient:
# - Three.js 0.166.1 ✓
# - Vite 5.2.0 ✓
# - GLSL shader support ✓
```

### Optional Dev Tools
```bash
# Performance monitoring
npm install --save-dev stats.js

# Debug UI
npm install --save-dev tweakpane
```

---

## Development Best Practices

### Code Organization
- Keep classes small and focused (Single Responsibility Principle)
- Use composition over inheritance where possible
- Comment complex algorithms (especially detection logic)

### Performance
- Use object pooling for particles
- Batch sprite rendering where possible
- Profile regularly with Stats.js

### Testing
- Test each system in isolation first
- Create debug visualizations (collision boxes, patrol paths)
- Playtest frequently (every major feature addition)

### Version Control
```bash
# Recommended git workflow
git checkout -b feature/player-movement
# Make changes
git commit -m "feat: implement player movement system"
git checkout main
git merge feature/player-movement
```

---

## Milestone Checklist

### ✅ Milestone 0: Design Complete
**Status**: DONE
- [x] Game design document
- [x] Visual style guide
- [x] Asset list
- [x] Technical architecture
- [x] Level design framework

### 🎯 Milestone 1: Tech Demo (Target: Week 2)
**Goal**: Movable character in 2D space
- [ ] Orthographic camera working
- [ ] Player sprite renders
- [ ] Player moves with keyboard
- [ ] Camera follows player
- [ ] Basic physics (gravity, jumping)

### 🎯 Milestone 2: Stealth Prototype (Target: Week 4)
**Goal**: Core stealth mechanics functional
- [ ] Enemy patrol working
- [ ] Vision cone visible
- [ ] Detection system working
- [ ] Player can hide
- [ ] Game over on detection

### 🎯 Milestone 3: First Playable (Target: Week 6)
**Goal**: Tutorial level fully playable
- [ ] Tutorial level loads from JSON
- [ ] Collision with walls
- [ ] Checkpoint system
- [ ] Level complete trigger
- [ ] Basic HUD (lives display)

### 🎯 Milestone 4: Vertical Slice (Target: Week 8)
**Goal**: One complete level with polish
- [ ] Tutorial level polished
- [ ] All enemy types present
- [ ] Sound effects integrated
- [ ] UI menus working
- [ ] Rank system functional

### 🎯 Milestone 5: Alpha (Target: Week 12)
**Goal**: 3-5 levels playable
- [ ] Multiple levels
- [ ] Full animation sets
- [ ] Complete asset pipeline
- [ ] Save/load system
- [ ] Settings menu

---

## Resource Links

### Learning Resources

**Three.js Documentation**:
- Orthographic Camera: https://threejs.org/docs/#api/en/cameras/OrthographicCamera
- Texture Loading: https://threejs.org/docs/#api/en/loaders/TextureLoader
- Raycasting: https://threejs.org/docs/#api/en/core/Raycaster

**Game Design References**:
- Mark of the Ninja (detection system)
- Gunpoint (vision cones)
- Celeste (platformer physics)

**Pixel Art Tools**:
- Aseprite (paid, best for animation)
- Piskel (free, browser-based)
- LibreSprite (free, Aseprite fork)

---

## FAQ

### Q: Why Three.js for a 2D game?
**A**: The 2.5D approach leverages Three.js for:
- Parallax depth layers (easy with 3D positioning)
- Dynamic lighting and shadows (WebGL shaders)
- Vision cone rendering (custom shaders)
- Smooth transitions and effects

The orthographic camera removes perspective distortion, giving us true 2D gameplay with 3D visual benefits.

---

### Q: How long will this take to build?
**A**: Estimated timeline:
- **Prototype**: 2 weeks (playable tech demo)
- **First Playable**: 6 weeks (tutorial level complete)
- **Alpha**: 12 weeks (3-5 polished levels)
- **Beta**: 16 weeks (all features, needs balance)
- **Release**: 20 weeks (polish, testing, deployment)

---

### Q: Can I make this game alone?
**A**: Yes, but consider:
- **Solo Dev**: Longer timeline (double estimates)
- **2-Person Team**: Ideal (1 programmer, 1 artist)
- **3+ Team**: Faster, but requires coordination

---

### Q: What's the hardest part to implement?
**A**: Top 3 challenges:
1. **Detection System**: Complex raycasting and gradual detection
2. **Enemy AI**: Patrol + investigation + chase state machine
3. **Collision Resolution**: AABB collision can be tricky

**Tip**: Build incrementally, test each system in isolation.

---

### Q: How do I get started RIGHT NOW?
**A**: Follow this order:
1. Read `ARCHITECTURE.md` sections 1-2 (Scene setup)
2. Backup current `main.js` (rename to `main_old.js`)
3. Start implementing Step 1 (orthographic camera)
4. Test frequently (run dev server after each change)
5. Move to Step 2 only when Step 1 works

---

## Conclusion

You now have a **complete game design** for Stealth Cat, including:
- Full gameplay mechanics and systems
- Comprehensive visual style guide
- Complete asset production list
- Technical architecture and code examples
- Level design framework and walkthroughs

**The foundation is solid.** Everything is planned, documented, and ready for implementation.

---

## Next Action

**Choose your starting point**:

### Option A: Start Implementation (Recommended)
Begin with the roadmap above:
1. Refactor Three.js scene to orthographic
2. Create sprite rendering system
3. Implement player movement

### Option B: Create Placeholder Assets
If you're an artist first:
1. Draw cat sprite (64x64, 4 frames idle)
2. Draw human sprite (96x128, basic idle)
3. Create simple tileset (32x32 floor/wall)

### Option C: Prototype in Simpler Tool First
Test gameplay in a 2D engine:
1. Build tutorial level in Godot/Construct
2. Validate detection mechanics
3. Then rebuild in Three.js with learnings

---

**The design work is done. Now it's time to build! 🐱**

*Good luck, and remember: Start small, test often, iterate quickly.*