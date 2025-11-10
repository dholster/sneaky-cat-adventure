# Stealth Cat - Asset Production List

## Overview
Complete checklist of all sprites, animations, tiles, and VFX needed for production.

**Priority Levels**:
- 🔴 **P0 - MVP**: Essential for first playable prototype
- 🟡 **P1 - Alpha**: Needed for complete gameplay experience
- 🟢 **P2 - Polish**: Nice-to-have, enhanced visuals

---

## Character Sprites

### Player Cat 🔴 P0

#### Core Animation Set (8 directions each)

| Animation | Frames | Duration | Loop | Dimensions | Priority | Notes |
|-----------|--------|----------|------|------------|----------|-------|
| **Idle** | 4 | 0.5s | Yes | 64x64 | 🔴 P0 | Tail swish, breathing |
| **Walk** | 8 | 0.8s | Yes | 64x64 | 🔴 P0 | Smooth gait cycle |
| **Run** | 6 | 0.4s | Yes | 80x64 | 🔴 P0 | Fast movement |
| **Jump** | 5 | Single | No | 64x80 | 🔴 P0 | Launch/mid-air/land |
| **Crouch** | 2 | 1.0s | Yes | 80x48 | 🔴 P0 | Low profile |
| **Hide_Enter** | 3 | 0.3s | No | 64x64 | 🟡 P1 | Enter hiding spot |
| **Hide_Peek** | 2 | 0.6s | Yes | 32x64 | 🟡 P1 | Peeking from spot |
| **Hide_Exit** | 3 | 0.3s | No | 64x64 | 🟡 P1 | Leave hiding spot |
| **Alert** | 3 | 0.3s | Yes | 64x64 | 🟡 P1 | Ears up, cautious |
| **Detected** | 4 | 0.3s | Yes | 80x64 | 🟡 P1 | Panic animation |
| **Pounce** | 6 | 0.4s | No | 96x64 | 🟢 P2 | Attack/dash move |
| **Wall_Climb** | 4 | 0.5s | Yes | 64x80 | 🟢 P2 | Wall jump prep |
| **Land_Hard** | 3 | 0.3s | No | 64x56 | 🟢 P2 | Impact landing |
| **Stretch** | 5 | 1.0s | No | 80x64 | 🟢 P2 | Idle variation |

**Subtotal**: ~320 base frames (8 directions × average 5 frames × 8 animations)

#### Cat Variant Skins 🟢 P2
Each skin is a palette swap - no new animation needed:
- Gray Tabby (default)
- Orange Tabby
- Tuxedo (black & white)
- Calico (tri-color)
- Siamese (cream & dark points)
- Black Cat
- White Cat
- Ginger Cat

**Production Note**: Create base sprites first, then apply palette swaps in post.

---

### Human Enemies 🔴 P0

#### Homeowner (Patroller)

| Animation | Frames | Duration | Loop | Dimensions | Priority | Directions |
|-----------|--------|----------|------|------------|----------|------------|
| **Idle_Phone** | 6 | 2.0s | Yes | 96x128 | 🔴 P0 | 4 (L/R/Front/Back) |
| **Walk** | 8 | 1.0s | Yes | 96x128 | 🔴 P0 | 4 |
| **Alert_Turn** | 4 | 0.4s | No | 96x128 | 🔴 P0 | 4 |
| **Chase** | 6 | 0.5s | Yes | 96x128 | 🟡 P1 | 4 |
| **Investigate** | 5 | 1.5s | Yes | 96x128 | 🟡 P1 | 4 |
| **Yawn** | 6 | 2.0s | No | 96x128 | 🟢 P2 | 2 (L/R) |

**Subtotal**: ~140 frames (4 directions × average 7 frames × 5 main animations)

#### Homeowner Variants 🟡 P1
- Male 1 (Pajamas - blue)
- Male 2 (Pajamas - gray)
- Female 1 (Nightgown - pink)
- Female 2 (Casual wear - green)

**Production Note**: All use same animation rig, different clothing/hair.

---

### Dog Enemies 🔴 P0

#### Guard Dog (German Shepherd)

| Animation | Frames | Duration | Loop | Dimensions | Priority | Directions |
|-----------|--------|----------|------|------------|----------|------------|
| **Idle_Pant** | 4 | 0.6s | Yes | 96x64 | 🔴 P0 | 4 (L/R/Front/Back) |
| **Walk** | 8 | 0.8s | Yes | 96x64 | 🔴 P0 | 4 |
| **Run** | 6 | 0.4s | Yes | 96x64 | 🔴 P0 | 4 |
| **Sniff** | 5 | 1.2s | No | 96x64 | 🟡 P1 | 4 |
| **Bark** | 4 | 0.5s | No | 96x64 | 🟡 P1 | 4 |
| **Alert** | 3 | 0.3s | Yes | 96x64 | 🟡 P1 | 4 |
| **Sit** | 2 | 0.5s | Yes | 64x80 | 🟢 P2 | 2 (L/R) |

**Subtotal**: ~130 frames

#### Dog Breed Variants 🟢 P2
- German Shepherd (default)
- Doberman
- Golden Retriever
- Bulldog

---

### Security Equipment 🔴 P0

#### Security Camera

| Animation | Frames | Duration | Loop | Dimensions | Priority | Notes |
|-----------|--------|----------|------|------------|----------|-------|
| **Sweep_LtoR** | 12 | 4.0s | Yes | 48x48 | 🔴 P0 | Gradual rotation |
| **Sweep_RtoL** | 12 | 4.0s | Yes | 48x48 | 🔴 P0 | Return sweep |
| **Alert_Lock** | 2 | 0.3s | Yes | 48x48 | 🔴 P0 | Flash red LED |
| **Disabled** | 4 | 0.8s | Yes | 48x48 | 🟡 P1 | Sparking/broken |
| **Fixed_Idle** | 1 | - | No | 48x48 | 🟡 P1 | Non-moving camera |

**Subtotal**: ~31 frames

#### Motion Sensor

| Element | Frames | Dimensions | Priority | Notes |
|---------|--------|------------|----------|-------|
| **Emitter_Node** | 2 | 32x32 | 🔴 P0 | LED blink |
| **Receiver_Node** | 2 | 32x32 | 🔴 P0 | LED blink |
| **Triggered_Flash** | 3 | 32x32 | 🟡 P1 | Rapid flash |

**Subtotal**: ~7 frames

**Note**: Beam is rendered as shader line, not sprite.

---

### Other NPCs 🟢 P2

#### Roomba (Bonus Enemy)
- Idle: 2 frames
- Moving: 4 frames
- Triggered: 3 frames
- Dimensions: 48x48

#### Sleeping Pet (Obstacle)
- Sleeping Cat: 2 frames (breathing), 64x48
- Sleeping Dog: 2 frames (breathing), 96x64

---

## Environment Assets

### Tileset - Interior Floors 🔴 P0

**Base Tile Size**: 32x32 pixels

| Tile Type | Variants | Priority | Notes |
|-----------|----------|----------|-------|
| **Hardwood Floor** | 4 | 🔴 P0 | Different plank patterns |
| **Carpet - Plain** | 2 | 🔴 P0 | Soft texture |
| **Carpet - Pattern** | 3 | 🟡 P1 | Decorative rugs |
| **Tile Floor** | 4 | 🔴 P0 | Kitchen/bathroom |
| **Creaky Floor** | 2 | 🟡 P1 | Visual indicator (crack) |
| **Rug - Small** | 6 | 🟡 P1 | Various patterns |
| **Rug - Large** | 3 | 🟡 P1 | 64x64 or larger |

**Edge Tiles**: 16 variations per type (corners, edges, transitions)

**Subtotal**: ~200 tiles

---

### Tileset - Walls & Structures 🔴 P0

| Tile Type | Variants | Dimensions | Priority | Notes |
|-----------|----------|------------|----------|-------|
| **Wall - Plain** | 4 | 32x64 | 🔴 P0 | With baseboard |
| **Wall - Wallpaper** | 6 | 32x64 | 🟡 P1 | Patterns |
| **Door - Closed** | 2 | 96x128 | 🔴 P0 | Wooden door |
| **Door - Open** | 2 | 96x128 | 🔴 P0 | Opened position |
| **Window - Night** | 4 | 64x96 | 🔴 P0 | Moonlight through |
| **Window - Curtain** | 3 | 64x96 | 🟡 P1 | Hiding spot |
| **Doorframe** | 2 | 96x128 | 🟡 P1 | Decorative |
| **Corners** | 8 | 32x64 | 🔴 P0 | Inner/outer |

**Subtotal**: ~40 tiles

---

### Props - Furniture (Large) 🔴 P0

| Item | Dimensions | Frames | Priority | Interactive |
|------|------------|--------|----------|-------------|
| **Bed - Queen** | 192x128 | 1 | 🔴 P0 | Hiding spot under |
| **Sofa - 3 Seat** | 192x96 | 1 | 🔴 P0 | Hiding spot behind |
| **Dining Table** | 128x96 | 1 | 🔴 P0 | Platform |
| **Bookshelf** | 128x128 | 1 | 🟡 P1 | Climbable |
| **Wardrobe** | 128x160 | 1 | 🟡 P1 | Hiding spot inside |
| **Kitchen Counter** | 192x80 | 1 | 🔴 P0 | Platform |
| **TV Stand** | 128x64 | 1 | 🟡 P1 | Platform |
| **Desk** | 128x80 | 1 | 🟡 P1 | Platform |

**Subtotal**: 8 items, ~8-10 frames (with variations)

---

### Props - Furniture (Medium) 🟡 P1

| Item | Dimensions | Interactive | Priority |
|------|------------|-------------|----------|
| **Side Table** | 48x48 | Platform | 🟡 P1 |
| **Chair - Dining** | 48x64 | Platform | 🟡 P1 |
| **Chair - Armchair** | 64x64 | Hiding behind | 🟡 P1 |
| **Stool** | 32x48 | Platform | 🟡 P1 |
| **Coffee Table** | 96x64 | Platform | 🟡 P1 |
| **Cat Tower** | 64x128 | Climbable | 🟢 P2 |
| **Plant Stand** | 48x80 | Obstacle | 🟡 P1 |

**Subtotal**: 7 items

---

### Props - Small Objects 🟡 P1

#### Interactive Objects

| Item | Dimensions | Frames | Priority | Function |
|------|------------|--------|----------|----------|
| **Vase** | 16x32 | 1 static, 4 breaking | 🟡 P1 | Distraction |
| **Lamp - Table** | 24x48 | 2 (on/off) | 🔴 P0 | Light source |
| **Light Switch** | 16x16 | 2 (on/off) | 🟡 P1 | Toggle lights |
| **Toy - Mouse** | 16x16 | 1 | 🟢 P2 | Throwable |
| **Food Bowl** | 32x16 | 1 | 🟢 P2 | Objective item |
| **Water Bowl** | 32x16 | 1 | 🟢 P2 | Hazard (wet paws) |
| **Picture Frame** | 32x32 | 1 | 🟢 P2 | Decoration |

#### Hiding Spots

| Item | Dimensions | Frames | Priority | Notes |
|------|------------|--------|----------|-------|
| **Cardboard Box** | 64x64 | 1 | 🔴 P0 | Classic hiding spot |
| **Curtain** | 64x96 | 2 (sway) | 🟡 P1 | Silhouette visible |
| **Under Furniture** | Variable | 1 | 🔴 P0 | Dark recess |
| **Plant Pot - Large** | 48x64 | 1 | 🟢 P2 | Tight squeeze |

**Subtotal**: ~25 frames

---

### Background Elements 🟡 P1

#### Parallax Layers

**Far Background (Layer 1 - 0.1x speed)**:
- Window view: Night sky, moon, distant trees (512x288)
- Distant room silhouette (256x144)

**Mid Background (Layer 2 - 0.4x speed)**:
- Back wall with decorations (1920x288)
- Wall-mounted items (paintings, clocks)

**Foreground (Layer 4 - 1.5x speed)**:
- Hanging lamps (64x96 each)
- Plant leaves (48x64)
- Furniture edges (semi-transparent overlays)

---

## Visual Effects (VFX)

### Detection & Stealth VFX 🔴 P0

| Effect | Frames | Dimensions | Priority | Notes |
|--------|--------|------------|----------|-------|
| **Vision Cone - Green** | 1 | 512x512 | 🔴 P0 | Gradient texture |
| **Vision Cone - Yellow** | 2 | 512x512 | 🔴 P0 | Pulsing |
| **Vision Cone - Red** | 2 | 512x512 | 🔴 P0 | Rapid pulse |
| **Vision Cone - Orange** | 3 | 512x512 | 🟡 P1 | Scanning effect |
| **Sound Ripple** | 4 | 256x256 | 🔴 P0 | Expanding circles |
| **Detection Meter** | 8 | 128x128 | 🔴 P0 | Progress ring |
| **Laser Beam** | 1 | 16x512 | 🔴 P0 | Red line texture |
| **Question Mark** | 2 | 32x48 | 🟡 P1 | Suspicious indicator |
| **Exclamation Mark** | 3 | 32x48 | 🟡 P1 | Alert indicator |

**Subtotal**: ~26 frames

---

### Environmental VFX 🟡 P1

| Effect | Frames | Dimensions | Priority | Notes |
|--------|--------|------------|----------|-------|
| **Light Glow** | 1 | 256x256 | 🟡 P1 | Radial gradient |
| **Shadow Blob** | 1 | 64x32 | 🔴 P0 | Under characters |
| **Dust Particles** | 4 | 8x8 | 🟢 P2 | Ambient |
| **Moonlight Shaft** | 1 | 128x512 | 🟡 P1 | Through window |
| **Alarm Flash** | 3 | 128x128 | 🟡 P1 | Red pulsing |

---

### Action VFX 🟡 P1

| Effect | Frames | Dimensions | Priority | Notes |
|--------|--------|------------|----------|-------|
| **Landing Puff** | 4 | 48x32 | 🟡 P1 | Dust cloud |
| **Object Break** | 6 | 64x64 | 🟡 P1 | Shards/pieces |
| **Sparkle/Shine** | 4 | 32x32 | 🟢 P2 | Collectibles |
| **Paw Print** | 1 | 24x24 | 🟢 P2 | Wet foot trail |
| **Speed Lines** | 2 | 96x32 | 🟢 P2 | Behind running |
| **Impact Star** | 3 | 32x32 | 🟢 P2 | Object collision |

---

## User Interface (UI)

### HUD Elements 🔴 P0

| Element | Dimensions | Priority | Notes |
|---------|------------|----------|-------|
| **Life Icon (Cat Head)** | 32x32 | 🔴 P0 | 2 states (active/lost) |
| **Detection Ring** | 128x128 | 🔴 P0 | Circular progress |
| **Objective Arrow** | 48x24 | 🟡 P1 | Animated pointer |
| **Hidden Icon** | 32x32 | 🟡 P1 | Eye with slash |
| **Sound Indicator** | 64x64 | 🟡 P1 | Speaker icon |

---

### Menu UI 🟡 P1

| Screen | Elements Needed | Priority | Notes |
|--------|-----------------|----------|-------|
| **Main Menu** | Logo, buttons (Start, Options, Quit) | 🟡 P1 | Animated cat background |
| **Level Select** | Level cards, lock icons, rank stars | 🟡 P1 | Show completion status |
| **Pause Menu** | Resume, Restart, Quit buttons | 🟡 P1 | Blur background |
| **Options** | Sliders, checkboxes, keybind display | 🟢 P2 | Settings interface |
| **Results Screen** | Rank badge, stats, collectibles | 🟡 P1 | Level completion |

**UI Components**:
- Button frame (9-slice): 96x32
- Panel background (9-slice): 512x512
- Slider track/thumb: 256x32 / 32x32
- Checkbox: 32x32 (2 states)

---

### Font & Text 🔴 P0

| Font | Size | Usage | Priority |
|------|------|-------|----------|
| **Pixel Font - Main** | 16px | HUD, dialogue | 🔴 P0 |
| **Pixel Font - Large** | 32px | Titles, level names | 🟡 P1 |
| **Pixel Font - Small** | 8px | Tooltips, hints | 🟢 P2 |

**Recommended**: Use existing pixel fonts like "Press Start 2P" or "Silkscreen"

---

## Audio Assets (Reference)

### Music Tracks
- Main Menu Theme
- Level Exploration (calm, jazzy)
- Suspicious State (tension building)
- Chase Theme (fast-paced, panic)
- Level Complete (victory jingle)
- Game Over (sad, comedic)

### Sound Effects

**Player (Cat)**:
- Footsteps (walk/run) × 4 surfaces
- Jump/land × 2 types
- Meow (victory)
- Hiss (detected)
- Purr (hiding)

**Enemies**:
- Human footsteps
- Dog panting/barking
- Camera servo sounds
- Alarm beep

**Environment**:
- Door open/close
- Object break
- Light switch toggle
- Creaky floor

---

## Asset Production Summary

### Total Frame Count Estimate

| Category | Frame Count | Priority |
|----------|-------------|----------|
| **Player Cat** | ~320 | 🔴 P0 |
| **Human Enemies** | ~140 | 🔴 P0 |
| **Dog Enemies** | ~130 | 🔴 P0 |
| **Security Equipment** | ~40 | 🔴 P0 |
| **Environment Tiles** | ~240 | 🔴 P0 |
| **Props** | ~50 | 🟡 P1 |
| **VFX** | ~60 | 🟡 P1 |
| **UI Elements** | ~30 | 🟡 P1 |
| **Total** | **~1,010 frames** | - |

---

## Production Schedule Recommendation

### Phase 1 - MVP Assets (Week 1-2)
Focus on 🔴 P0 priority items:
- Cat: Idle, Walk, Run, Jump animations (4 directions minimum)
- 1 Human enemy (basic animations)
- 1 Security camera
- Basic floor/wall tiles
- Core VFX (vision cones, sound ripples)
- Essential HUD elements

**Goal**: Playable prototype with core mechanics

### Phase 2 - Alpha Assets (Week 3-4)
Add 🟡 P1 priority items:
- Complete cat animation set (8 directions)
- Complete human & dog enemies
- All furniture and interactive props
- Detection state VFX
- Menu UI

**Goal**: Full gameplay experience, rough polish

### Phase 3 - Polish Assets (Week 5-6)
Finalize 🟢 P2 priority items:
- Cat skin variants
- Additional animations (stretch, wall climb)
- Environmental details
- Advanced VFX
- Options menu

**Goal**: Shippable quality

---

## File Naming Conventions

```
Format: category_object_variant_action_direction_frame.png

Examples:
- char_cat_gray_idle_right_01.png
- char_human_male_walk_left_03.png
- prop_vase_blue_break_02.png
- vfx_vision_cone_green.png
- tile_floor_hardwood_01.png
- ui_button_normal.png
```

---

## Export Settings

### For Sprites
```
Format: PNG
Color: 32-bit RGBA
Resolution: Source (64x64, 96x96, etc.)
Compression: None
Alpha: Premultiplied
```

### For Atlases
```
Max Dimensions: 2048x2048 (WebGL safe)
Format: PNG
Padding: 2px between sprites
Metadata: JSON (coordinates, dimensions)
```

---

*This asset list should be used as a checklist during production. Mark items as complete when exported and integrated into the game.*