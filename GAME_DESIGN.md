# Stealth Cat - Game Design Document

## High Concept
A 2.5D sidescrolling stealth game where players control a cat sneaking through a house at night, avoiding detection by humans, dogs, cameras, and sensors to reach the end of each level.

---

## Core Gameplay Loop

1. **Navigate** through rooms and corridors
2. **Observe** patrol patterns and detection zones
3. **Plan** route using hiding spots and timing
4. **Execute** stealth movement to reach objective
5. **Adapt** when detected (hide, escape, or restart)

---

## Player Character: The Cat

### Movement Abilities
- **Walk**: Silent, slow movement (4 units/sec)
- **Run**: Fast but creates sound (8 units/sec, detection radius +50%)
- **Crouch**: Very slow, silent, can fit under furniture (2 units/sec)
- **Jump**: Standard platformer jump (can reach heights of 3-4 units)
- **Wall Jump**: Can jump between close parallel walls
- **Pounce**: Short dash that can knock over objects (creates distraction)

### Cat States
- **Idle**: Standing still, tail swishing
- **Alert**: Ears perked, crouched low (when near danger)
- **Hidden**: Inside hiding spot (under furniture, in boxes, behind curtains)
- **Detected**: Running animation with panic expression

### Special Mechanic: Nine Lives System
- Player has 9 lives (checkpoints) per level
- Getting fully detected costs 1 life and respawns at last checkpoint
- Adds risk/reward: speed through and lose lives, or careful and perfect run

---

## Detection System

### Detection States
1. **Unaware** (Green): Normal patrol, hasn't noticed player
2. **Suspicious** (Yellow): Heard sound or saw movement, investigating
3. **Alert** (Red): Fully detected player, chasing/sounding alarm
4. **Search** (Orange): Lost sight of player, searching area

### Detection Mechanics

#### Vision-Based Detection (Humans, Dogs)
- **Vision Cone**: 120° field of view, 10 units range
- **Gradual Detection**: 0-100% fill bar (takes 1.5 seconds)
- **Line of Sight**: Blocked by walls, furniture, obstacles
- **Light Levels**: Detection 3x faster in lit areas, slower in shadows
- **Distance Falloff**: Detection slower at edge of vision cone

#### Sound-Based Detection
- **Player Running**: Creates 5-unit detection radius
- **Knocked Objects**: Creates 8-unit radius, enemies investigate
- **Jump Landing**: Creates 3-unit radius on hard surfaces
- **Carpets/Rugs**: Reduce sound detection by 50%

#### Camera Detection
- **Fixed Rotation**: Sweeps 90° arc every 4 seconds
- **Instant Alert**: No gradual detection, triggers alarm immediately
- **Red Light**: Projects visible laser showing detection zone
- **Hackable**: Player can disable by interacting (takes 2 seconds, vulnerable)

#### Motion Sensors
- **Invisible Beams**: Between two wall-mounted nodes
- **Instant Detection**: Triggers alarm when beam broken
- **Visual Hint**: Small blinking red LEDs on nodes
- **Can't Disable**: Must avoid or find alternate route

---

## Enemy Types

### 1. Homeowner (Human Patrol)
- **Behavior**: Fixed patrol route, stops to check phone occasionally
- **Detection**: Vision cone + sound detection
- **Alert Response**: Chases player, calls other humans
- **Difficulty**: Medium (predictable but dangerous)

### 2. Guard Dog
- **Behavior**: Faster patrol, sniffs random spots
- **Detection**: Wider vision cone, enhanced sound detection (2x range)
- **Alert Response**: Barks (alerts nearby enemies), fast chase
- **Difficulty**: Hard (unpredictable, sensitive)

### 3. Security Camera
- **Behavior**: Sweeping rotation or fixed position
- **Detection**: Instant detection in laser zone
- **Alert Response**: Alarm, locks nearby doors for 5 seconds
- **Difficulty**: Easy (predictable, visible)

### 4. Motion Sensor
- **Behavior**: Static invisible beam
- **Detection**: Instant when beam broken
- **Alert Response**: Silent alarm, alerts nearby patrols
- **Difficulty**: Medium (requires observation to spot)

### 5. Roomba (Bonus Enemy)
- **Behavior**: Random wandering, bounces off walls
- **Detection**: Proximity sensor (2-unit radius)
- **Alert Response**: Beeps loudly, alerts nearby enemies
- **Difficulty**: Easy but unpredictable

---

## Level Design Philosophy

### Structure
- **Room-Based**: House divided into connected rooms
- **Linear Progression**: Clear start → objective → exit path
- **Multiple Routes**: 2-3 paths through each section (risk/reward)
- **Checkpoints**: Hidden cat beds/boxes save progress

### Environmental Elements

#### Interactive Objects
- **Hiding Spots**: Under beds, in closets, behind curtains, inside boxes
- **Distractions**: Vases (knock over), light switches (turn off lights), toys (throw)
- **Platforms**: Tables, counters, shelves (vertical traversal)
- **Doors**: Closed doors block vision but create sound when opened

#### Lighting Zones
- **Shadows** (Dark Blue): Slower detection, safer
- **Moonlight** (Pale Blue): Medium detection
- **Room Lights** (Warm Yellow): Fast detection, dangerous
- **Security Lights** (Harsh White): Very fast detection

#### Hazards
- **Noisy Floors**: Creaky wood creates sound when walked on
- **Glass Objects**: Knocked objects create loud noise
- **Water Bowls**: Leave wet paw prints (temporary trail visible to enemies)

---

## Level Progression

### Tutorial Level: "The Living Room"
**Objective**: Reach the kitchen to steal treats
- Introduce basic movement and jumping
- One sleeping homeowner (won't wake unless you run)
- One security camera (teaches observation)
- One obvious hiding spot demonstration

### Level 1: "Midnight Snack"
**Objective**: Navigate kitchen and dining room
- 2 patrolling humans
- 1 security camera
- Introduce sound detection with creaky floors
- Multiple hiding spots and distraction objects

### Level 2: "The Master Bedroom"
**Objective**: Reach the closet where toys are hidden
- 1 light-sleeping human in bed
- 1 guard dog
- Motion sensors protecting doorways
- Lighting zones (can turn off lamp)

### Level 3: "Security System"
**Objective**: Reach the study to knock papers off desk
- 3 security cameras
- 2 motion sensors
- 1 patrolling human
- Hackable cameras
- Multiple vertical routes

### Level 4: "The Dog's Domain"
**Objective**: Cross the backyard and return inside
- 2 guard dogs
- Motion-activated floodlights
- Fewer hiding spots (riskier)
- Time pressure (must complete before sunrise)

### Boss Level: "The Confrontation"
**Objective**: Escape through the front door
- All enemy types present
- Dynamic patrol routes
- Multiple objectives (disable alarm, unlock door)
- No checkpoints (one-shot level)

---

## Scoring & Replayability

### Rank System (Per Level)
- **S Rank**: No detections, under par time, all collectibles
- **A Rank**: 1 detection or missed collectibles
- **B Rank**: 2-3 detections
- **C Rank**: 4+ detections
- **D Rank**: Used more than 5 lives

### Collectibles
- **Yarn Balls** (3 per level): Hidden in risky spots
- **Milk Saucers** (1 per level): Very difficult to reach, secret areas
- **Paw Prints** (story collectibles): Unlock lore about the cat's past

### Unlockables
- **Cat Skins**: Tabby, Tuxedo, Calico, Ginger, Siamese
- **Speed Run Mode**: Timer display, ghost replay
- **Hard Mode**: Faster detection, smarter patrols, more enemies
- **Infinite Lives Mode**: For casual players

---

## UI/UX Elements

### HUD
- **Lives Remaining**: 9 cat head icons (top-left)
- **Detection Meter**: Circular meter around cat when being spotted
- **Sound Indicator**: Ripple effect showing sound radius
- **Objective Marker**: Subtle arrow pointing to goal
- **Minimap**: Optional (can be toggled off for immersion)

### Visual Feedback
- **Enemy Vision Cones**: Translucent colored overlays
  - Green: Unaware
  - Yellow: Suspicious
  - Orange: Searching
  - Red: Alert
- **Sound Visualization**: Concentric circles when noise is made
- **Hiding Indicator**: Eye icon with slash when fully hidden
- **Safe Shadows**: Subtle darkened overlay

---

## Audio Design Concepts

### Music
- **Exploration**: Jazzy, mellow piano (think "Sims" meets "Mark of the Ninja")
- **Suspicious**: Strings add tension, tempo increases
- **Chase**: Fast-paced drums, panic music
- **Success**: Triumphant cat-themed jingle

### Sound Effects
- **Cat**: Soft paw steps, purring (when hidden), hissing (detected), meow (victory)
- **Humans**: Footsteps, yawning, phone notifications, surprised shouts
- **Dogs**: Panting, growling, barking, running
- **Environment**: Creaking floors, breaking objects, doors opening, alarm beeps

---

## Technical Requirements Summary

### Core Systems Needed
1. Orthographic camera controller with smooth following
2. 2D sprite animation system (cat, enemies)
3. Vision cone raycasting with gradual detection
4. Sound propagation system
5. Collision detection (AABB for entities, tilemaps for environment)
6. Patrol AI with waypoints and investigation behavior
7. State machine for enemies (Unaware → Suspicious → Alert → Search)
8. Lighting system (dynamic shadows, light zones)
9. Checkpoint/save system
10. Particle effects (detection alerts, sound indicators)

### Asset Requirements
- Cat sprite sheets (8 directions × 6 animations = 48 sprites minimum)
- Enemy sprite sheets (humans, dogs, cameras, sensors)
- Environment tilesets (floors, walls, furniture, props)
- UI elements (HUD, menus, icons)
- VFX sprites (vision cones, sound ripples, detection alerts)

---

## Inspirations & References
- **Mark of the Ninja**: Detection system, 2D stealth mechanics
- **Gunpoint**: Vision cones, planning routes
- **Monaco**: Top-down stealth, multiple characters
- **Untitled Goose Game**: Animal protagonist causing mischief
- **Stray**: Cat movement and animation reference

---

*This design document is a living document and will be updated as development progresses.*