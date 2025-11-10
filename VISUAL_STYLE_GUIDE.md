# Stealth Cat - Visual Style Guide

## Art Direction Overview

**Core Aesthetic**: Modern pixel art with cinematic lighting and atmospheric depth
**Resolution**: 64x64 to 128x128 pixels per sprite
**Perspective**: 2.5D sidescroller with orthographic view
**Style Influences**: Hyper Light Drifter, Owlboy, Katana ZERO

---

## Color Palette

### Night-Time Base Palette
```
Primary Colors:
- Deep Night Blue: #0d1b2a (background sky)
- Shadow Blue: #1b263b (dark areas)
- Moonlight Blue: #415a77 (ambient light)
- Soft Slate: #778da9 (mid-tones)
- Cool Gray: #a8b5c5 (highlights)

Accent Colors:
- Warm Interior Light: #f4a261 (house lights, lamps)
- Security Red: #e63946 (lasers, alerts, danger)
- Alert Yellow: #f4d35e (suspicious state)
- Safe Green: #06ffa5 (hiding, safe zones)
- Moonlight White: #e0e1dd (pure highlights)
```

### Environmental Lighting Zones
```
Deep Shadow (Safe):
- Base: #0d1b2a
- Highlight: #1b263b
- Accent: #2d3e50

Moonlight (Medium Risk):
- Base: #1b263b
- Highlight: #415a77
- Accent: #6b8cae

Room Light (High Risk):
- Base: #f4a261
- Highlight: #f6bd7e
- Accent: #ffd6a5

Security Light (Extreme Risk):
- Base: #e0e1dd
- Highlight: #ffffff
- Accent: #e63946 (with red tint)
```

### Character-Specific Palettes

**Player Cat (Default - Gray Tabby)**
```
- Dark Stripes: #2d3e50
- Mid Gray: #6b7c8c
- Light Gray: #a8b5c5
- White Belly: #e0e1dd
- Eye Color: #06ffa5 (reflects light like real cat eyes)
- Nose/Pads: #e63946 (soft pink-red)
```

**Human Characters**
```
Skin Tones: #f4c2a4, #d4a574, #8d5524
Clothing (Pajamas/Casual):
- Warm: #e76f51, #f4a261
- Cool: #264653, #2a9d8f
- Neutral: #6b7c8c, #a8b5c5
Hair: #1b263b, #8d5524, #d4a574, #e0e1dd
```

**Guard Dog**
```
Fur (German Shepherd):
- Dark: #2d2416
- Brown: #8d5524
- Tan: #d4a574
Eyes: #f4d35e (alert, watchful)
Collar: #e63946 (red)
```

---

## Sprite Specifications

### Player Cat Sprites

#### Required Animation States (8 directions each)
1. **Idle** (4 frames, 0.5s loop)
   - Tail swishing
   - Subtle breathing
   - Ear twitching
   - Dimensions: 64x64px

2. **Walk** (8 frames, 0.8s loop)
   - Smooth gait cycle
   - Tail up and curved
   - Head slightly bobbing
   - Dimensions: 64x64px

3. **Run** (6 frames, 0.4s loop)
   - Extended stride
   - Tail streaming back
   - Ears pinned
   - Dimensions: 80x64px (stretched)

4. **Crouch** (2 frames, 1s loop)
   - Low profile
   - Belly nearly to ground
   - Tail low
   - Dimensions: 80x48px (wider, shorter)

5. **Jump** (5 frames, single cycle)
   - Crouch prepare
   - Launch
   - Mid-air (legs tucked)
   - Descend (legs extended)
   - Landing
   - Dimensions: 64x80px (vertical)

6. **Hide** (3 frames, 0.6s transition)
   - Entering hiding spot
   - Peeking out (loop)
   - Exiting
   - Dimensions: Variable (depends on hiding spot)

7. **Alert** (3 frames, 0.3s loop)
   - Ears perked up
   - Eyes wide
   - Crouched low
   - Tail puffed
   - Dimensions: 64x64px

8. **Detected/Panic** (6 frames, 0.3s loop)
   - Startled jump
   - Fast run cycle
   - Wide eyes
   - Tail straight up
   - Dimensions: 80x64px

**Total Cat Sprites**: 8 states × 8 directions × avg 5 frames = ~320 frames

#### Visual Details for Cat
- **Pixel perfect silhouette** readable at all scales
- **Eye shine effect**: Eyes glow slightly in dark areas (like real cats)
- **Whiskers**: 2-3 pixels extending from face for personality
- **Paw detail**: Subtle paw pads visible when jumping/landing
- **Tail physics**: Secondary animation (follows body with delay)

---

### Enemy Sprites

#### Human Patrol (Homeowner)
**Animations Needed**:
- Idle (standing, checking phone): 6 frames, 2s loop
- Walk: 8 frames, 1s loop
- Alert Turn: 4 frames, 0.4s
- Chase Run: 6 frames, 0.5s loop
- Investigation (looking around): 5 frames, 1.5s

**Dimensions**: 96x128px (standing), 96x96px (moving)
**Directions**: 4 (left, right, toward camera, away from camera)
**Clothing**: Pajamas or casual wear (warm palette)
**Total Frames**: ~120 frames

#### Guard Dog
**Animations Needed**:
- Idle (panting): 4 frames, 0.6s loop
- Walk: 8 frames, 0.8s loop
- Run: 6 frames, 0.4s loop
- Sniff: 5 frames, 1.2s
- Bark: 4 frames, 0.5s
- Alert: 3 frames, 0.3s loop

**Dimensions**: 96x64px
**Directions**: 4 (left, right, toward, away)
**Breed**: German Shepherd or Doberman (recognizable silhouette)
**Total Frames**: ~120 frames

#### Security Camera
**Animations Needed**:
- Sweep Left to Right: 12 frames, 4s cycle
- Sweep Right to Left: 12 frames, 4s cycle
- Alert (locked in direction): 2 frames, 0.3s flash
- Disabled (sparking): 4 frames, 0.8s loop

**Dimensions**: 48x48px
**Style**: Modern dome camera or wall-mounted
**Light**: Glowing red LED and laser projection
**Total Frames**: ~30 frames

#### Motion Sensor
**Static Elements**:
- Wall node (emitter): 32x32px
- Wall node (receiver): 32x32px
- Invisible beam (rendered as shader line in-engine)

**Animations**:
- LED blink: 2 frames, 2s loop (subtle warning)
- Triggered flash: 3 frames, 0.3s

**Total Frames**: ~10 frames

---

## Environment Tilesets

### Interior Tiles (16x16 base size, 2x scale to 32x32)

#### Floor Types
- **Hardwood**: Dark brown planks with grain detail
- **Carpet**: Soft texture, muted patterns
- **Tile**: Kitchen/bathroom, reflective surface
- **Rug**: Decorative, various patterns (Persian, modern)

#### Wall Types
- **Interior Wall**: Neutral paint, baseboards
- **Wallpaper**: Patterned (subtle stripes, florals)
- **Window**: Moonlight streaming through
- **Door Frame**: Closed/open variants

#### Furniture (Props)
All furniture uses modern pixel art with clear silhouettes:

**Large Furniture** (64x64 to 128x128):
- Beds (queen, king)
- Sofas (2-3 seaters)
- Dining table
- Bookshelves
- Wardrobes/Closets

**Medium Furniture** (48x48 to 64x64):
- Side tables
- Chairs
- TV stands
- Kitchen counters
- Desks

**Small Props** (16x16 to 32x32):
- Vases (knockable)
- Books
- Lamps (light sources)
- Picture frames
- Plants
- Food bowls
- Toys

**Hiding Spot Props** (special interaction):
- Cardboard boxes (open top)
- Under-bed space (darkness)
- Closets (with crack for peeking)
- Curtains (silhouette visible)
- Furniture gaps

---

## Lighting & VFX

### Dynamic Lighting
- **Light Sources**: Point lights from lamps, moonlight from windows, security lights
- **Shadows**: Simple blob shadows under characters (64x32 ellipse, alpha fade)
- **Light Cones**: Rendered using gradient textures, blend mode: ADD
- **Ambient Occlusion**: Darker corners and under furniture

### Vision Cone VFX
```
Unaware (Green):
- Base color: #06ffa540 (40% opacity)
- Edge glow: #06ffa5ff
- Scan line effect: Slow animated lines

Suspicious (Yellow):
- Base color: #f4d35e60 (60% opacity)
- Edge glow: #f4d35eff
- Pulsing animation: 1s cycle

Alert (Red):
- Base color: #e6394680 (80% opacity)
- Edge glow: #e63946ff
- Rapid pulsing: 0.3s cycle
- Sharp, defined edges

Searching (Orange):
- Base color: #f4a26150 (50% opacity)
- Edge glow: #f4a261ff
- Sweeping scan effect
```

### Sound Indicator VFX
- **Concentric Circles**: 3-4 rings expanding from source
- **Color**: #ffffff with fade to transparent
- **Duration**: 1.5s expansion
- **Size**: Based on sound loudness

### Detection Meter VFX
- **Circular Progress Bar**: Around cat sprite
- **Fill Color**: Gradient from #f4d35e (0%) to #e63946 (100%)
- **Animation**: Smooth fill, pulse at thresholds (25%, 50%, 75%)

### Particle Effects
- **Alarm Trigger**: Red flash particles bursting
- **Object Break**: Shards/pieces with physics
- **Cat Landing**: Small dust puff
- **Suspicious**: "?" particle above enemy head
- **Alert**: "!" particle above enemy head

---

## UI/UX Visual Design

### HUD Style
- **Minimal**: Semi-transparent, doesn't obstruct gameplay
- **Position**: Lives (top-left), Detection (around player), Objective (top-center)
- **Font**: Pixel font, readable at 16px size
- **Color**: White with dark outline for visibility

### Lives Display
```
┌─────────────────┐
│ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ │
└─────────────────┘
```
- Cat head silhouettes (16x16px each)
- Lost life: Grayed out or X overlay
- Compact horizontal arrangement

### Detection Meter
- Circular progress ring around cat
- 3px thick ring
- Smooth fill animation
- Color transition: #06ffa5 → #f4d35e → #e63946

### Menu UI
- **Background**: Blurred gameplay with dark overlay (#0d1b2a80)
- **Buttons**: Pixel art frames with hover effects
- **Selection**: Animated cat paw cursor
- **Transitions**: Quick fade (0.2s)

---

## Animation Principles

### Pixel Art Animation Guidelines
1. **Squash and Stretch**: Subtle for impact (landing, jumping)
2. **Anticipation**: Wind-up before major actions (pounce, jump)
3. **Follow-Through**: Tail and ear secondary motion
4. **Arcs**: Natural curved movement paths
5. **Timing**: Vary frame duration for weight/speed
6. **Exaggeration**: Slight exaggeration for readability (panic eyes, puffed tail)

### Frame Timing Standards
- **Idle**: 6-8 FPS (slow, relaxed)
- **Walk**: 10-12 FPS (smooth, natural)
- **Run**: 15-20 FPS (fast, urgent)
- **Action**: 20-24 FPS (quick, responsive)

---

## Parallax Background Layers

To achieve 2.5D depth:

### Layer 1 - Far Background (0.1x speed)
- **Content**: Distant rooms through windows, moon, trees outside
- **Colors**: Very desaturated, cool blues
- **Detail Level**: Low (16x16 tiles)

### Layer 2 - Mid Background (0.4x speed)
- **Content**: Back wall, windows, wall decorations
- **Colors**: Medium saturation
- **Detail Level**: Medium (32x32 elements)

### Layer 3 - Gameplay Layer (1.0x speed)
- **Content**: Main floor, furniture, characters, interactive objects
- **Colors**: Full saturation
- **Detail Level**: High (64x64 sprites)

### Layer 4 - Foreground (1.5x speed)
- **Content**: Furniture edges, plants in front, hanging lamps
- **Colors**: Slightly darker (in shadow)
- **Detail Level**: High but semi-transparent

### Layer 5 - VFX/UI (2.0x speed)
- **Content**: Vision cones, sound indicators, particles
- **Colors**: Bright, high contrast
- **Detail Level**: Variable

---

## Asset Production Pipeline

### Sprite Creation Workflow
1. **Sketch**: Rough design at 32x32 or 64x64
2. **Line Art**: Clean pixel-perfect outline
3. **Base Colors**: Flat colors from palette
4. **Shading**: 2-3 levels of shading (flat/mid/highlight)
5. **Details**: Eyes, features, texture
6. **Animation**: Create all frames, test timing
7. **Export**: PNG sprite sheets with alpha channel

### Tileset Creation
1. **Core Tiles**: Basic floor, wall, corner tiles
2. **Edges**: All transition tiles (16 variations)
3. **Details**: Decorative tiles, cracks, dirt
4. **Props**: Standalone objects with shadows
5. **Assembly**: Arrange into sprite atlas

### Color Management
- **Palette Lock**: Use only defined colors
- **Dithering**: Minimal, only for gradients/transitions
- **Anti-aliasing**: Avoid on edges, acceptable on rotated sprites

---

## Technical Specifications

### Sprite Sheet Format
```
Format: PNG with alpha channel
Color Depth: 32-bit RGBA
Compression: None (for pixel perfection)
Layout: Grid-based, power-of-2 dimensions
Naming: character_action_direction_frame.png
Example: cat_walk_right_01.png, cat_walk_right_02.png
```

### Atlas Organization
```
cat_spritesheet.png (2048x2048)
├─ idle (rows 0-7: 8 directions)
├─ walk (rows 8-15: 8 directions)
├─ run (rows 16-23: 8 directions)
└─ etc.

human_spritesheet.png (1024x1024)
environment_tiles.png (512x512)
props_atlas.png (1024x1024)
vfx_particles.png (512x512)
```

### Animation Data Format (JSON)
```json
{
  "cat": {
    "idle": {
      "frameCount": 4,
      "frameWidth": 64,
      "frameHeight": 64,
      "duration": 500,
      "loop": true,
      "directions": 8
    },
    "walk": {
      "frameCount": 8,
      "frameWidth": 64,
      "frameHeight": 64,
      "duration": 800,
      "loop": true,
      "directions": 8
    }
  }
}
```

---

## Reference Images & Mood Board

### Visual References
- **Hyper Light Drifter**: Neon accents, atmospheric lighting
- **Owlboy**: Character personality, fluid animation
- **Katana ZERO**: Cinematic lighting, color grading
- **Mark of the Ninja**: Stealth UI, vision cones
- **Gunpoint**: Detection feedback, clarity

### Real-World References
- **Cat Movement**: Search "cat walking cycle", "cat jumping slow motion"
- **Interior Design**: Modern/contemporary home interiors
- **Lighting**: Night photography, moonlight through windows
- **Security Equipment**: Real security cameras, motion sensors

---

## Style Consistency Checklist

Before finalizing any asset:
- [ ] Uses only approved color palette
- [ ] Maintains consistent pixel density (64x64 standard)
- [ ] Clear silhouette at gameplay scale
- [ ] Proper alpha channel for transparency
- [ ] Animation frames are consistent size
- [ ] Readable at 1080p and 4K resolutions
- [ ] Lighting direction consistent (moonlight from top-right)
- [ ] No orphan pixels or jaggy edges
- [ ] Proper contrast against all background types

---

*This style guide ensures visual cohesion across all game assets. All artists should reference this document during production.*