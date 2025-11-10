# 🔧 DEBUGGING: Nothing Shows Up

## ✅ What I've Fixed

### 1. **Added Comprehensive Error Handling**
- Main.js now catches all errors
- Shows detailed error messages on screen
- Full stack traces in console

### 2. **Added Debug Logging**
- Every initialization step logs to console
- Can see exactly where it's failing
- Step-by-step progress tracking

### 3. **Fixed Material Issues**
- Removed incompatible emissive properties
- Hiding spots now change color instead
- Should prevent material errors

---

## 🔍 How to Debug

### Step 1: Open Browser Console
**Press F12** or **Right-click → Inspect → Console**

### Step 2: Look for Startup Messages
You should see:
```
🎮 Stealth Cat - Starting...
✅ Canvas found: <canvas>
Creating game instance...
Initializing game...
🎮 Game.init() called
  → Setting up scene...
  → Setting up camera...
  → Setting up renderer...
  → Setting up label system...
  → Setting up player...
  → Setting up stealth systems...
  → Setting up environment...
  → Setting up event listeners...
✅ Game initialization complete!
Starting game loop...
✅ Game started successfully!
```

### Step 3: Check for Errors
If you see **RED text** or **❌ symbols**, that's the error!

**Common error patterns:**
```
❌ Canvas element not found!
❌ Fatal Error: ...
❌ Error during game initialization: ...
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Canvas not found"
**Symptoms**: Red "ERROR: Canvas not found!" on screen
**Solution**: HTML file is missing canvas element
**Fix**: Make sure index.html has `<canvas class="webgl"></canvas>`

### Issue 2: "Module not found" / Import errors
**Symptoms**: Console shows "Failed to load module" or "Cannot find module"
**Solution**: Missing or incorrectly named files
**Fix**: Check that all files exist in src/ folders

### Issue 3: Black screen, no errors
**Symptoms**: Nothing visible, but no errors in console
**Possible causes**:
- Camera position wrong
- Nothing rendering (all objects off-screen)
- Renderer not set up correctly
**Check**: Look for the "✅ Game started successfully!" message

### Issue 4: Vision cone errors
**Symptoms**: Error mentioning "CircleGeometry" or "shader"
**Solution**: Check if shader files exist
**Fix**: Make sure shaders/visionCone/vertex.glsl and fragment.glsl exist

---

## 📊 What the Console Should Show

### Successful Startup:
```
🎮 Stealth Cat - Starting...
✅ Canvas found: <canvas class="webgl">
Creating game instance...
Initializing game...
🎮 Game.init() called
  → Setting up scene...
  → Setting up camera...
  → Setting up renderer...
  → Setting up label system...
🏷️  Label system initialized (Press L to toggle)
  → Setting up player...
🐱 Player created at position: Vector3 {x: -15, y: 1, z: 0}
  → Setting up stealth systems...
🕵️  Created 1 human enemy
📦 Created 3 hiding spots
🎯 Goal is at x=25 - Try to reach it without being detected!
  → Setting up environment...
🏗️  Created simple tutorial level
  → Setting up event listeners...
✅ Game initialization complete!
🐱 Stealth Cat - Game Initialized
Controls:
  Move: Arrow Keys/WASD
  Jump: Space
  Run (Hold): Shift - ⚠️  Makes noise!
  Crouch (Hold): Ctrl
  Hide: E (near hiding spot)
  Pause: P
  Debug: I
  Toggle Labels: L
Starting game loop...
✅ Game started successfully!
💡 Tip: Access game via window.game in console for debugging
```

### Failed Startup (Example):
```
🎮 Stealth Cat - Starting...
✅ Canvas found: <canvas class="webgl">
Creating game instance...
Initializing game...
🎮 Game.init() called
  → Setting up scene...
  → Setting up camera...
  → Setting up renderer...
❌ Error during game initialization: TypeError: Cannot read property 'position' of undefined
Stack trace: ...
```

---

## 🧪 Quick Tests

### Test 1: Check if Browser Console Opens
1. Press **F12**
2. Click **Console** tab
3. You should see messages starting with 🎮

### Test 2: Check Canvas
1. Open console
2. Type: `document.querySelector('canvas.webgl')`
3. Should show: `<canvas class="webgl"></canvas>`
4. If `null` → canvas doesn't exist

### Test 3: Check Game Object
1. Open console
2. Type: `window.game`
3. Should show: `Game {canvas: canvas.webgl, ...}`
4. If `undefined` → game didn't initialize

### Test 4: Force Render
1. Open console
2. Type: `window.game.render()`
3. Should see one frame render

---

## 🔧 Emergency Fixes

### Fix 1: Reset Everything
```bash
# Stop dev server (Ctrl+C)
# Clear cache
rm -rf node_modules/.vite
# Restart
npm run dev
```

### Fix 2: Check File Structure
Make sure you have:
```
/home/vibecode/workspace/
├── index.html
├── main.js
├── style.css
├── package.json
└── src/
    ├── core/
    │   └── Game.js
    ├── entities/
    ├── systems/
    ├── rendering/
    └── utils/
```

### Fix 3: Simplify main.js
If all else fails, try the absolute minimum:
```javascript
import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()
```

If this works, then the issue is in our game code.
If this doesn't work, Three.js isn't loading.

---

## 📝 What to Tell Me

**Copy and paste from console:**
1. All messages from startup
2. Any error messages (especially red ❌ ones)
3. Result of typing `window.game`
4. Result of typing `document.querySelector('canvas.webgl')`

**Or just screenshot the console!**

---

## 🎯 Expected Behavior

**If everything works:**
- Dark blue background (night sky)
- Orange square (you) on the left
- Purple rectangle (guard) in the middle
- Labels above everything
- Green glowing goal on the right
- Vision cone (green) in front of guard

**If you see this, the game is working!**

---

**Open console (F12) and check for errors. Let me know what you see!** 🔍