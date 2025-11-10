# 🎮 STEALTH CAT - QUICK START GUIDE

## ✅ BUGS FIXED
- ✅ Vision cones no longer block movement (they're visual only now)
- ✅ Level is much simpler and clearer
- ✅ Visible glowing GOAL marker shows where to go

---

## 🎯 YOUR OBJECTIVE

**Get from LEFT to RIGHT and reach the GLOWING GREEN GOAL!**

```
START              GUARD                    GOAL
 🐱  →  →  →  →  🧍 ← → → →  →  →  →  →  ✨🟢✨
      (Hide)     (Patrol)      (Hide)
        📦          👁️           📦
```

---

## 📍 THE LEVEL (Simple Tutorial)

### What You'll See:
1. **You** (orange square) - Start on the far left
2. **1 Guard** (purple rectangle) - Patrols back and forth in the middle
3. **3 Hiding Spots** (brown/gray boxes) - Along the path
4. **Green Glowing Goal** - Far right side (it pulses!)

### The Guard's Patrol:
- Walks from x=0 to x=10 and back
- Takes about 5-6 seconds per loop
- Green cone = safe, Red cone = spotted!

---

## 🎮 CONTROLS

| Key | Action | Notes |
|-----|--------|-------|
| **← →** or **A D** | Move | Walk silently |
| **Space** | Jump | Navigate platforms |
| **Shift** | Run | ⚠️ **MAKES NOISE** - guard will investigate! |
| **Ctrl** | Crouch | Harder to detect (50% slower) |
| **E** | Hide | Near brown box or gray area - press E to hide |

---

## 🚶 HOW TO BEAT THE LEVEL

### Strategy 1: Patient Stealth (Easy)
1. **Start**: You're at x=-15 (far left)
2. **Wait**: Watch the guard patrol (green cone moves)
3. **Move When Safe**: When guard walks AWAY from you (cone faces right)
4. **Walk** slowly to the first hiding spot (x=-5)
5. **Hide if needed**: Press E near the brown box
6. **Wait** for guard to pass again
7. **Continue** when safe
8. **Reach Goal**: Walk to the glowing green marker (x=25)

### Strategy 2: Distraction (Medium)
1. **Run** (hold Shift) to make noise
2. Guard's cone turns **YELLOW** (suspicious!)
3. He walks toward the sound
4. **Hide** immediately (press E near box)
5. Wait for him to give up (cone turns green)
6. Sneak past while he's at the wrong end

### Strategy 3: Perfect Timing (Hard)
1. Watch the patrol for 2 full cycles
2. Time your movement perfectly
3. Walk straight through without hiding
4. Never enter the vision cone

---

## 👁️ VISION CONE COLORS

| Color | Meaning | What To Do |
|-------|---------|------------|
| 🟢 **Green** | Unaware - Safe! | Can move, but stay quiet |
| 🟡 **Yellow** | Suspicious - Heard noise | Hide immediately! |
| 🔴 **Red** | DETECTED - Chasing! | RUN TO HIDING SPOT! |
| 🟠 **Orange** | Searching - Lost you | Stay hidden or sneak away |

---

## 📦 HIDING SPOTS

**3 spots along the path**:
- **x = -5** (brown box) - Near start
- **x = 5** (gray shadow) - Middle area (near guard!)
- **x = 15** (brown box) - Near goal

**How to Use**:
1. Walk near a hiding spot
2. Press **E** to hide
3. You become **invisible**!
4. Press **E** again to exit

---

## 🎯 REACHING THE GOAL

The **glowing green marker** is at **x=25** on the right side.

You'll know it's the goal because it:
- ✨ **Pulses** bright green
- 🌊 **Floats** up and down
- 📍 Is **much bigger** than other objects

**When you reach it**:
- Console shows "🎉 LEVEL COMPLETE!"
- Goal gets brighter
- Game pauses after 1 second

---

## 💡 TIPS

### If You Get Stuck:
- Vision cones are **visual only** - you can walk through them
- You CAN'T walk through platforms (blue rectangles)
- **Jump** (Space) if you're on a platform

### If Detected:
1. Guard's cone turns RED
2. **Don't panic!**
3. Run to nearest hiding spot
4. Press **E** to hide
5. Wait 3 seconds
6. Guard gives up (orange → green)

### Sound Detection:
- **Running** (Shift) = 5-unit noise radius
- Guard will investigate sound
- Use this to distract!

---

## 🔍 DEBUG MODE

Press **I** to see debug info in console:
- Your position
- Detection levels
- When hiding/spotted
- Guard states

---

## 🎊 SUCCESS!

When you reach the goal, you'll see:
```
🎉🎉🎉 LEVEL COMPLETE! 🎉🎉🎉
You successfully reached the goal!
🎊 Well done! Press P to continue or refresh to try again.
```

---

## ⚙️ TROUBLESHOOTING

**"I'm stuck and can't move!"**
- Vision cones are fixed - they don't block anymore
- Make sure you're not running into a platform (blue rectangles)
- Try jumping (Space) if on a platform

**"Where's the goal?"**
- It's a **bright green glowing rectangle** on the far right
- Floats up and down
- Camera will follow you as you move right

**"Guard keeps catching me!"**
- Wait for green cone to face AWAY
- Don't run (makes noise)
- Use hiding spots!

**"Nothing is happening!"**
- Check browser console for errors
- Refresh the page
- Make sure dev server is running

---

## 🏆 CHALLENGE MODES

Try these after beating it once:

### **Ghost Run**
Never enter the vision cone (stay green the whole time)

### **Speed Run**
Complete as fast as possible

### **No Hiding**
Reach goal without using any hiding spots

### **Distraction Master**
Use running to lure guard away, then sneak past

---

**Good luck, and happy sneaking! 🐱🌙**

*Remember: Patience is key. Watch, wait, then move!*