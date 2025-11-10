/**
 * Stealth Cat - Main Entry Point
 * A 2.5D sidescrolling stealth game
 */

import './style.css'
import { Game } from './src/core/Game.js'

console.log('🎮 Stealth Cat - Starting...')

// Get canvas element
const canvas = document.querySelector('canvas.webgl')

if (!canvas) {
  console.error('❌ Canvas element not found!')
  document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 100px;">ERROR: Canvas not found!</h1>'
  throw new Error('Canvas element not found')
}

console.log('✅ Canvas found:', canvas)

try {
  // Create and initialize game
  console.log('Creating game instance...')
  const game = new Game(canvas)

  console.log('Initializing game...')
  game.init()

  console.log('Starting game loop...')
  game.start()

  // Expose game to window for debugging
  window.game = game
  console.log('✅ Game started successfully!')
  console.log('💡 Tip: Access game via window.game in console for debugging')
} catch (error) {
  console.error('❌ Fatal Error:', error)
  console.error('Stack trace:', error.stack)
  document.body.innerHTML = `
    <div style="color: white; background: #ff0000; padding: 20px; margin: 20px; border-radius: 10px;">
      <h1>Game Failed to Start</h1>
      <p><strong>Error:</strong> ${error.message}</p>
      <pre style="background: #000; padding: 10px; overflow: auto;">${error.stack}</pre>
    </div>
  `
}

