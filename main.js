/**
 * Stealth Cat - Main Entry Point
 * A 2.5D sidescrolling stealth game
 */

import './style.css'
import { Game } from './src/core/Game.js'

// Get canvas element
const canvas = document.querySelector('canvas.webgl')

// Create and initialize game
const game = new Game(canvas)
game.init()

// Start game loop
game.start()

// Expose game to window for debugging
window.game = game
console.log('💡 Tip: Access game via window.game in console for debugging')
