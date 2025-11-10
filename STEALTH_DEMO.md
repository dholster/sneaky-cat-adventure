# Stealth Cat - Stealth Mechanics Demo

## 🎮 Core Stealth Gameplay Working!

This prototype now features the **complete stealth detection system** - the heart of Stealth Cat!

---

## ✅ Implemented Stealth Features

### 🔦 Vision Cone System
**Working Features**:
- ✅ Animated vision cones using custom GLSL shaders
- ✅ Color-coded detection states:
  - 🟢 **Green**: Unaware (safe)
  - 🟡 **Yellow**: Suspicious (heard sound, investigating)
  - 🟠 **Orange**: Searching (lost sight, looking around)
  - 🔴 **Red**: Alert! (fully detected, chasing)
- ✅ Scanning line animation effect
- ✅ Pulsing intensity based on detection level
- ✅ Vision cones follow enemy facing direction

### 🕵️ Enemy AI - Humans
**Patrol Behavior**:
- ✅ Waypoint-based patrol routes
- ✅ Wait at each waypoint before continuing
- ✅ Face direction of movement
- ✅ Smooth walking animation

**Detection States**:
1. **Unaware** (Green): Normal patrol, hasn't spotted you
2. **Suspicious** (Yellow): Heard a sound, moving to investigate
3. **Alert** (Red): Fully spotted you, chasing!
4. **Search** (Orange): Lost sight, looking around for 3 seconds

**AI Features**:
- ✅ Gradual detection (0-100% fill over ~1 second)
- ✅ Line-of-sight raycasting (platforms block vision!)
- ✅ Sound detection (running creates noise radius)
- ✅ Investigation behavior (moves to sound source)
- ✅ Chase behavior (runs toward player)
- ✅ Give-up timer (returns to patrol after 3s searching)

### 👁️ Detection System
**Vision Detection**:
- ✅ 120° vision cone (configurable)
- ✅ 10-unit vision range
- ✅ Raycasting for line-of-sight
- ✅ Platforms/walls block vision
- ✅ Distance-based detection speed (further = slower)
- ✅ Crouching reduces detection speed by 50%
- ✅ Hiding makes you invisible

**Sound Detection**:
- ✅ Running (Shift) creates 5-unit sound radius
- ✅ Walking is silent
- ✅ Crouching is silent
- ✅ Enemies investigate sound sources

### 📦 Hiding Spots
**Types Available**:
- 📦 **Box** (brown): Classic cardboard hiding spot
- 🪑 **Furniture** (gray): Hide under tables/beds
- 🎭 **Curtain** (purple): Hide behind curtains
- 🌑 **Shadow** (dark): Hide in dark corners

**Hiding Mechanics**:
- ✅ Press **E** near hiding spot to enter
- ✅ Press **E** again to exit
- ✅ Completely invisible while hiding
- ✅ Detection stops immediately
- ✅ Enemies lose chase and enter search mode

### 🌙 Atmosphere
**Visual Atmosphere**:
- ✅ Dark blue nighttime color palette
- ✅ Atmospheric fog effect
- ✅ Dim ambient lighting (30% intensity)
- ✅ Moonlight directional light
- ✅ Darker platforms and environment

---

## 🎯 How to Play

### Your Goal
Get from the **left side** to the **right side** without being detected by the 2 patrolling humans!

### Controls
| Action | Keys | Effect |
|--------|------|--------|
| **Move** | ← → / A D | Walk silently |
| **Jump** | Space | Navigate platforms |
| **Run** | Hold Shift | ⚠️ Fast but **MAKES NOISE** - enemies will investigate! |
| **Crouch** | Hold Ctrl | Slower movement, 50% harder to detect |
| **Hide** | E (near spot) | Enter/exit hiding spot, become invisible |
| **Pause** | P | Pause game |
| **Debug** | I | Toggle debug info |

---

## 🧪 Test Scenarios

### Scenario 1: Stealth Walkthrough (Easy)
1. **Start on the left**
2. Watch the first human patrol between the platforms
3. Wait for them to walk away (vision cone turns away)
4. **Walk** (don't run!) behind them
5. Use the hiding spot (box) if needed
6. Proceed to the right side

### Scenario 2: Testing Detection (Medium)
1. Try **running** near an enemy
2. Watch their vision cone turn **YELLOW** (suspicious)
3. They'll investigate the sound
4. Quickly hide in a nearby spot
5. Wait for them to give up and turn **GREEN** again

### Scenario 3: Chase & Hide (Hard)
1. Deliberately get spotted (walk into vision cone)
2. Watch detection fill up to 100%
3. Vision cone turns **RED** - they're chasing!
4. Run to the nearest hiding spot
5. Press **E** to hide
6. Enemy will search (orange) for 3 seconds
7. Then give up and return to patrol

### Scenario 4: Platform Vision Blocking
1. Position yourself behind a platform
2. Enemy on other side can't see through it!
3. Use platforms as cover to sneak past

---

## 🕹️ Current Level Layout

```
        Human #2 Patrol
       (Rectangle route)
              ↓
    Wall  [Platform]  [Platform]  Wall
      |      🟦          🟦         |
      |   [Platform]  [Platform]   |
      |      🟦          🟦         |
      |                            |
  [Box]  Human #1    [Box]    [Shadow]
   📦  ←Patrol→      📦          🌑
═════════════════════════════════════  Ground
  START                           GOAL
  (You)                          (→→→)
```

### Enemy Locations
- **Human #1**: Patrols left-center area (x: -15 to -5)
- **Human #2**: Patrols right area in rectangle (x: 15 to 25, y: 1 to 5)

### Hiding Spots
- **Box 1**: Near start (x: -18)
- **Box 2**: Center area (x: -2)
- **Shadow**: Right side (x: 12)
- **Furniture**: Upper right (x: 28, y: 5)

---

## 🎨 Visual Indicators

### Vision Cone Colors
- 🟢 **Green**: Safe - enemy hasn't noticed you
- 🟡 **Yellow**: Suspicious - investigating sound
- 🟠 **Orange**: Searching - looking for you
- 🔴 **Red**: ALERT! - Spotted and chasing

### Enemy Sprites
- **Dark Purple Rectangle** (1×2): Human enemy
- **Orange Square** (1×1): You (the cat)

### Hiding Spots
- **Brown**: Cardboard box
- **Gray**: Furniture
- **Purple**: Curtain
- **Dark**: Shadow area

---

## 🐛 Debug Mode

Press **I** to enable debug mode. Console will show:
- Player position and state
- Enemy detection levels
- When hiding/exiting
- When detected
- Sound detection events

---

## 🎓 Stealth Tips

### Master Stealth
1. **Observe first**: Watch full patrol routes before moving
2. **Move when safe**: Wait for vision cone to face away
3. **Use hiding spots**: They're your safe zones
4. **Don't run unless necessary**: Running = noise = investigation
5. **Crouch in cone**: If spotted while crouching, you have more time to hide
6. **Platform cover**: Stand behind platforms to block vision

### Advanced Tactics
- **Sound distraction**: Run to create noise, hide before they arrive
- **Timing patrols**: Learn the patrol loops for perfect timing
- **Vertical evasion**: Jump to high platforms out of vision range
- **Wall usage**: Walls completely block vision

---

## 🧬 Technical Details

### Detection Algorithm
```
If player in vision cone AND line-of-sight clear:
  detectionSpeed = baseSpeed
  detectionSpeed *= distanceFactor (0-1)
  detectionSpeed *= 0.5 if crouching
  detectionSpeed *= 0 if hiding

  detectionLevel += detectionSpeed * deltaTime

  if detectionLevel >= 100%:
    STATE = ALERT (chase)
  else if detectionLevel >= 30%:
    STATE = SUSPICIOUS
```

### Sound Detection
```
If player running:
  soundRadius = 5 units

For each enemy:
  if distance < soundRadius:
    enemy.investigate(player.position)
    STATE = SUSPICIOUS
```

### Chase Behavior
```
When ALERT:
  - Move toward player at run speed
  - If player hides:
    - Lose sight
    - STATE = SEARCH
    - Search for 3 seconds
    - If not found: return to patrol
```

---

## 🚀 What's Working vs What's Next

### ✅ Working Now
- Vision cone rendering with shaders
- Human enemies with patrol AI
- Detection system with raycasting
- Hiding spots with interaction
- Sound detection
- All detection states (unaware, suspicious, alert, search)
- Atmospheric nighttime visuals

### 🔜 Coming Next
- Sprite animations (replace colored squares)
- More enemy types (dogs, cameras, motion sensors)
- Distraction objects (throw items)
- Light zones (lit areas = faster detection)
- Level complete/game over screens
- Multiple levels
- Sound effects and music

---

## 📊 Stats

**Current Demo**:
- 2 Human enemies with patrols
- 4 Hiding spots
- 1 Complete detection system
- 1 Vision cone renderer
- ~10 platforms for navigation

**Detection Parameters**:
- Vision Range: 10 units
- Vision Angle: 120°
- Detection Time: ~1.0 seconds (direct line of sight)
- Sound Radius: 5 units (when running)
- Search Duration: 3 seconds

---

## 🎮 Ready to Play!

The **stealth gameplay core** is complete! Run the dev server and try to sneak past the guards.

**Challenge**: Can you reach the right side without ever being detected? (No yellow or red vision cones!)

**Hard Mode**: Can you do it without using any hiding spots?

---

**Status**: 🟢 **Stealth Systems Fully Operational**

*"A good sneak never gets spotted. A great sneak makes the guards wonder if they imagined something." - Ancient Cat Proverb*