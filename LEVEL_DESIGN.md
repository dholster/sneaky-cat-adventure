# Stealth Cat - Level Design Framework

## Overview
This document provides a framework for designing engaging stealth levels that teach mechanics progressively while maintaining challenge and replayability.

---

## Level Design Principles

### 1. **Readability First**
- Players should understand the space at a glance
- Clear visual hierarchy (safe paths, danger zones, objectives)
- Distinct landmark features for spatial awareness

### 2. **Multiple Solutions**
- Always provide 2-3 viable routes
- Different risk/reward paths (fast-dangerous vs slow-safe)
- Support different playstyles (aggressive, cautious, perfect stealth)

### 3. **Progressive Difficulty**
- Introduce one new mechanic per level
- Early levels teach, middle levels combine, late levels test mastery
- Difficulty curve shaped like: Easy → Medium → Hard → Breather → Very Hard

### 4. **Risk/Reward Balance**
- Collectibles placed in high-risk areas
- Shortcut routes require skillful execution
- Perfect runs should be challenging but achievable

### 5. **Pacing & Flow**
- Alternate between tense moments and breathing room
- Checkpoint placement provides relief after challenging sections
- Design "pressure release" moments after intense sequences

---

## Level Structure Template

Every level should follow this structure:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ENTRANCE ZONE                                            │
│    - Safe starting area                                      │
│    - Visual setup of objective                               │
│    - Introduce level's unique mechanic                       │
├─────────────────────────────────────────────────────────────┤
│ 2. TEACHING SECTION                                         │
│    - Isolated encounter with new mechanic                    │
│    - Low stakes, clear solution                              │
│    - Optional: Tutorial hint/sign                            │
├─────────────────────────────────────────────────────────────┤
│ 3. CHECKPOINT #1                                            │
│    - First save point (cat bed/box)                         │
│    - Breather moment                                         │
├─────────────────────────────────────────────────────────────┤
│ 4. ESCALATION SECTION                                       │
│    - Combine new mechanic with previous concepts             │
│    - Introduce challenge variations                          │
│    - Multiple path options                                   │
├─────────────────────────────────────────────────────────────┤
│ 5. CHECKPOINT #2                                            │
│    - Mid-level save point                                    │
├─────────────────────────────────────────────────────────────┤
│ 6. MASTERY SECTION                                          │
│    - Most difficult encounters                               │
│    - Tight timing requirements                               │
│    - Optional hard path for collectibles                     │
├─────────────────────────────────────────────────────────────┤
│ 7. FINALE                                                   │
│    - Final challenge before objective                        │
│    - Memorable "signature moment"                            │
├─────────────────────────────────────────────────────────────┤
│ 8. EXIT ZONE                                                │
│    - Clear path to objective                                 │
│    - Victory celebration space                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Tutorial Level: "The Living Room"

### Overview
**Objective**: Reach the kitchen to steal treats
**New Mechanics Introduced**: Basic movement, jumping, hiding, static camera
**Estimated Time**: 2-3 minutes
**Difficulty**: ★☆☆☆☆

### Layout Map (ASCII)
```
                 [KITCHEN - OBJECTIVE]
                        |
    ┌───────────────────┼──────────────────────┐
    │                                          │
    │   [CAMERA]     ┌────┐                   │
    │      ↕         │ TV │      [SLEEPING]   │
    │      ↕         └────┘      [HOMEOWNER]  │
    │      ↕                          💤       │
    │══════════════════════════════════════════│ Floor
    │  [BOX] [SOFA - HIDING]      [TABLE]     │
    │   ↑                                      │
    │ [START]                                  │
    └──────────────────────────────────────────┘
```

### Step-by-Step Walkthrough

#### Section 1: Entrance (0-5 seconds)
**Player Start Position**: Bottom-left corner
**What the Player Sees**:
- Clear path forward
- Cardboard box (hiding spot) 3 units ahead
- Sofa in middle of room
- Kitchen door at far end (glowing objective marker)

**Tutorial Prompt** (text overlay):
> "Use ← → to move. Press SPACE to jump."

**Purpose**: Teach basic movement in zero-danger environment.

---

#### Section 2: First Hiding Spot (5-15 seconds)
**Obstacle**: None yet, but introduce mechanic
**Tutorial Prompt**:
> "Press ↓ near the box to hide. Press ↓ again to exit."

**Player Action**:
- Walk to cardboard box
- Press ↓ to enter hiding animation
- Cat enters box, only eyes visible peeking out
- Press ↓ again to exit

**Purpose**: Safe introduction to hiding mechanic, no pressure.

---

#### Section 3: The Sleeping Homeowner (15-30 seconds)
**Obstacle**: Human enemy sleeping on couch, won't wake unless player runs nearby
**Tutorial Prompt**:
> "Hold SHIFT to run, but you'll make noise! Walk slowly past the sleeping human."

**Enemy Behavior**:
- Human is in "sleep" state (idle animation, "Z" particles)
- Vision cone disabled
- Sound detection enabled (radius: 3 units)
- If player runs within 3 units: wakes up, enters alert state

**Safe Solution**:
- Walk (not run) past the human
- Stay at least 4 units away

**Risky Solution**:
- Hide behind sofa as you approach
- Peek to check human status
- Dash quickly while human faces away

**Purpose**: Introduce sound detection and movement speed consequences.

---

#### Section 4: The Security Camera (30-50 seconds)
**Obstacle**: Fixed security camera sweeping left-right
**Tutorial Prompt**:
> "Cameras have vision lasers. Wait for it to look away, then move!"

**Camera Behavior**:
- Sweeps 90° arc over 4 seconds (2s right, 2s left)
- Red laser beam visible
- Instant detection if laser touches player

**Safe Solution**:
- Wait behind TV stand (blocks vision)
- Observe sweep pattern (2 full cycles recommended)
- Move during "looking away" phase (1.5s window)

**Advanced Solution**:
- Time jump over laser beam (risky, requires practice)

**Purpose**: Teach observation, timing, and patience. Introduce instant-detection mechanic.

---

#### Section 5: Kitchen Entrance (50-60 seconds)
**Obstacle**: None (victory lap)
**Rewards**:
- Yarn ball collectible (optional, slightly risky placement near camera)

**Player Action**:
- Walk to kitchen door (objective marker)
- Touch door trigger → Level Complete!

**Victory Animation**:
- Cat sits and eats treats
- Stats screen: Time, Lives Remaining, Rank

**Purpose**: Reward player with satisfying conclusion.

---

### Tutorial Level JSON Outline
```json
{
  "name": "The Living Room",
  "width": 40,
  "height": 12,
  "playerStart": { "x": 3, "y": 2 },
  "objective": {
    "type": "reach",
    "position": { "x": 37, "y": 2 }
  },
  "entities": [
    {
      "type": "hidingSpot",
      "subtype": "box",
      "position": { "x": 8, "y": 2 }
    },
    {
      "type": "human",
      "state": "sleeping",
      "position": { "x": 20, "y": 2 },
      "soundDetection": true
    },
    {
      "type": "camera",
      "position": { "x": 28, "y": 8 },
      "sweepAngle": 90,
      "sweepDuration": 4
    },
    {
      "type": "collectible",
      "subtype": "yarn",
      "position": { "x": 30, "y": 6 }
    }
  ]
}
```

---

## Level 1: "Midnight Snack"

### Overview
**Objective**: Navigate kitchen and dining room
**New Mechanics**: Patrolling enemies, crouching, distraction objects
**Estimated Time**: 4-6 minutes
**Difficulty**: ★★☆☆☆

### Layout Concept
```
[START] → [DINING ROOM] → [KITCHEN] → [PANTRY - OBJECTIVE]
           └─ Human Patrol      └─ Human Patrol
           └─ Vase Distraction  └─ Crouch Under Table
```

### Key Design Elements

#### Patrol Route 1: Dining Room Human
**Route**: Linear path between dining table and doorway
**Timing**: 8-second loop (4s each direction)
**Challenge**: Wide vision cone blocks main path

**Solutions**:
- Wait for patrol to pass, sneak behind
- Use hiding spot under dining table
- Knock over vase to distract enemy (investigate for 5s)

#### Patrol Route 2: Kitchen Human
**Route**: Circle around kitchen island
**Timing**: 12-second loop
**Challenge**: Two enemies can see each other (coordination needed)

**Solutions**:
- Time movement when both face away (tight 2s window)
- Crouch under kitchen counter (introduces crouch mechanic)
- Fast run-through (costs lives, but possible)

#### New Mechanic: Crouching
**Tutorial Prompt**:
> "Hold CTRL to crouch. Move slowly under tables and counters."

**Benefits**:
- Fit under furniture (height = 0.5 units)
- Silent movement
- Slower detection speed (50%)

**Drawbacks**:
- Very slow movement (2 units/sec)
- Can't jump while crouched

---

## Level 2: "The Master Bedroom"

### Overview
**Objective**: Reach closet to hide toys
**New Mechanics**: Guard dog, light switches, motion sensors
**Estimated Time**: 5-7 minutes
**Difficulty**: ★★★☆☆

### Layout Concept
```
           ┌─────────────────┐
           │   [BED]         │
           │  Human💤        │
           │                 │
           │ [DOG PATROL]    │
           └────┬────────────┘
                │ [MOTION SENSOR DOORWAY]
           ┌────┴────────────┐
           │ [HALLWAY]       │
           │ [LIGHT SWITCH]  │
           │                 │
START→────│                 │────→ CLOSET
           │                 │      (OBJECTIVE)
           └─────────────────┘
```

### Key Design Elements

#### The Guard Dog
**Behavior**:
- Faster patrol (1.5x human speed)
- Wider vision cone (140°)
- Enhanced sound detection (2x radius)
- Randomly stops to sniff (unpredictable timing)

**Challenge**:
- Harder to predict than human patrols
- Can hear player from further away
- Barks when alerted (wakes sleeping human)

**Solutions**:
- Patient observation (watch full patrol cycle)
- Use hiding spots more frequently
- Turn off lights to reduce vision range

#### Light Switch Mechanic
**Tutorial Prompt**:
> "Interact with the light switch (E) to turn off lights. Darkness slows detection!"

**Mechanic**:
- Interact takes 1 second (vulnerable)
- Lights toggle on/off
- Dark rooms: 50% slower detection
- Lit rooms: Normal detection

**Strategic Use**:
- Turn off hallway lights before crossing
- Risk: Makes a sound (small radius)
- Lights stay off for 30 seconds, then NPC turns back on

#### Motion Sensor Beams
**Tutorial Prompt**:
> "Red blinking lights mark motion sensors. Find another route or wait for patrols to pass."

**Mechanic**:
- Invisible beam between two wall nodes
- Instant silent alarm when triggered
- Nearby patrols investigate (converge on location)
- No way to disable (must avoid)

**Challenge**:
- Placed in doorway (chokepoint)
- Must use alternate route (ventilation shaft) OR wait for dog to pass first

---

## Level 3: "Security System"

### Overview
**Objective**: Reach the study, knock papers off desk
**New Mechanics**: Multiple cameras, camera hacking, vertical platforming
**Estimated Time**: 6-8 minutes
**Difficulty**: ★★★★☆

### Layout Concept
```
  [UPPER FLOOR]  [CAMERA]  [CAMERA]
        │            │         │
   [BOOKSHELF]────[DESK]──[OBJECTIVE]
        │            │
  ═════════════════════════════════
     [CAMERA]  [HUMAN PATROL]
        │            │
   [START]────[STAIRS]────[MOTION SENSOR]
```

### Key Design Elements

#### Camera Gauntlet
**Challenge**: 3 cameras with overlapping sweep patterns
**Difficulty**: Requires precise timing (0.5s windows)

**Solutions**:
- Hack first camera (2s interaction, disables for 10s)
- Climb bookshelf to bypass ground-level cameras
- Perfect timing run (advanced players, very tight)

#### Vertical Platforming
**New Skill Test**: Jumping between platforms
**Route**: Floor → Chair → Table → Bookshelf → Desk

**Challenge**:
- Camera sweeps cover vertical space
- Falling makes sound (alerts nearby enemies)
- Timing jumps between camera sweeps

---

## Level 4: "The Dog's Domain"

### Overview
**Objective**: Cross backyard, return through pet door
**New Mechanics**: Multiple guard dogs, motion-activated floodlights, time pressure
**Estimated Time**: 6-8 minutes (with time limit)
**Difficulty**: ★★★★☆

### Layout Concept
```
[HOUSE ENTRANCE]
      │
[BACKYARD] ──→ [DOG HOUSE]
  ├─ Dog 1         └─ Dog 2 (sleeping)
  ├─ Dog 2 Patrol
  └─ Floodlight Zones
      │
[PET DOOR - OBJECTIVE]
```

### Key Design Elements

#### Time Pressure
**Mechanic**: 3-minute timer (sunrise approaching)
**Consequence**: Auto-fail if not completed in time
**Purpose**: Prevent excessive careful observation, reward bold play

#### Motion-Activated Floodlights
**Mechanic**:
- Triggered by player entering zone
- Lights up area (3x detection speed)
- Stays on for 10 seconds
- Alerts nearby dogs

**Challenge**: Multiple floodlight zones create risky paths

**Solutions**:
- Sprint through before dogs react (risky)
- Crouch-walk (slower, might not make time limit)
- Use hiding spots in floodlight zones

#### Two-Dog Coordination
**Challenge**: Dogs patrol in sync (intentional design)
**Timing**: Pass each other at midpoint every 8 seconds

**Mastery Moment**: Wait for dogs to pass each other, sneak through 2s gap

---

## Boss Level: "The Confrontation"

### Overview
**Objective**: Escape through front door
**Sub-Objectives**: Disable alarm, unlock door, avoid all enemies
**New Mechanics**: Multi-stage level, all enemy types
**Estimated Time**: 10-15 minutes
**Difficulty**: ★★★★★

### Layout Concept
```
Stage 1: [ALARM PANEL] - Turn off house alarm
   ↓
Stage 2: [KEY LOCATION] - Steal front door key
   ↓
Stage 3: [FRONT DOOR] - Unlock and escape
```

### Key Design Elements

#### No Checkpoints
**Design Choice**: One-shot level, failing resets to start
**Purpose**: High stakes, ultimate test of mastery
**Accessibility**: Optional "practice mode" with checkpoints unlocks after 3 attempts

#### All Enemy Types
- 3 Human Patrols (coordinated routes)
- 2 Guard Dogs (random patrols)
- 5 Security Cameras (fixed + sweeping)
- Motion Sensors at all choke points

#### Dynamic Alarm State
**If Detected**:
- All enemies enter alert state simultaneously
- Doors lock for 20 seconds
- Must hide until alert wears off (30s)
- Second detection = Game Over

---

## Level Design Checklist

Use this checklist when designing new levels:

### Gameplay Flow
- [ ] Clear objective visible from start or tutorial prompt
- [ ] Introduction section teaches level's mechanic (10-15s)
- [ ] 2-3 checkpoints placed after difficult sections
- [ ] Multiple viable routes (fast-risky, slow-safe, optimal)
- [ ] Final challenge before objective (memorable moment)

### Enemy Placement
- [ ] Enemies introduce gradually (1 at a time for first encounter)
- [ ] Patrol routes are observable from safe position
- [ ] Vision cones don't overlap at start (frustration prevention)
- [ ] At least one "safe zone" in every major section

### Pacing & Difficulty
- [ ] Tutorial section is zero-danger (no fail state)
- [ ] Difficulty increases gradually (spike graph, not stairs)
- [ ] Breather moments after intense sections
- [ ] Optional hard paths for advanced players (collectibles)

### Visual Clarity
- [ ] Vision cones are always visible
- [ ] Hiding spots are visually distinct (different color/icon)
- [ ] Light zones are clearly marked (bright vs shadow)
- [ ] Objective marker is visible from most positions

### Replayability
- [ ] S-Rank requires perfect execution (challenge)
- [ ] Collectibles force risky decisions (risk/reward)
- [ ] Speedrun route exists (advanced players)
- [ ] Multiple solutions encourage experimentation

---

## Environmental Storytelling

Each level should tell a small story through visuals:

### Example: Level 2 "Master Bedroom"
**Story**: Couple with overprotective dog, light sleepers
**Visual Clues**:
- Alarm clock shows 3:00 AM (displayed on bedside table)
- Dog bed with chewed toys (shows dog personality)
- Framed photos on wall (establishes homeowners)
- Medicine bottles (older couple, need security)
- Security system panel (explain motion sensors)

### Example: Level 4 "The Dog's Domain"
**Story**: Wealthy family with expensive security
**Visual Clues**:
- Well-manicured lawn, garden gnomes
- Fancy dog houses (big budget)
- Motion-activated floodlights (security conscious)
- Pool furniture (affluent lifestyle)

---

## Difficulty Scaling

### Easy Mode (Casual)
- Infinite lives (no game over)
- Slower detection (1.5x time to detect)
- Forgiving vision cones (narrower)
- More hiding spots

### Normal Mode (Default)
- 9 lives per level
- Standard detection speeds
- Balanced enemy placement

### Hard Mode (Unlockable)
- 3 lives per level
- Faster detection (0.75x time)
- Wider vision cones (+20°)
- Fewer hiding spots
- Smarter AI (investigates thoroughly)

---

## Level Creation Tools (Future)

Ideal tooling for level design:

### Visual Editor Features
- Drag-and-drop entity placement
- Live patrol path visualization
- Vision cone preview
- Collision layer painting
- Lighting zone editor

### Playtesting Tools
- Ghost replay (record/playback runs)
- Heatmap (where players die most)
- Route tracking (most common paths)
- Difficulty metrics (avg. lives lost, completion time)

---

*This framework ensures consistent, engaging level design across the entire game.*