/**
 * LevelManager - Manages level data and transitions
 */

import { Config } from '../utils/Config.js'

export class LevelManager {
  constructor() {
    this.currentLevel = 1
    this.levels = this.createLevels()
  }

  createLevels() {
    return {
      1: this.createLevel1(),
      2: this.createLevel2()
    }
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel]
  }

  nextLevel() {
    this.currentLevel++
    if (this.currentLevel > Object.keys(this.levels).length) {
      return null // No more levels
    }
    return this.getCurrentLevel()
  }

  hasNextLevel() {
    return this.currentLevel < Object.keys(this.levels).length
  }

  /**
   * Level 1: The House (Original level - easy/medium)
   */
  createLevel1() {
    return {
      name: 'The House',
      theme: 'house',
      backgroundColor: Config.COLORS.NIGHT_BLUE,
      playerStart: { x: -15, y: 1 },
      goalPosition: { x: 115, y: 1 },
      cameraBounds: { minX: -20, maxX: 130, minY: 0, maxY: 15 },

      // Platforms (x, y, width, height, type)
      platforms: [
        // Main floor
        { x: 50, y: 0, width: 150, height: 1, type: 'wood' },

        // Upper platforms for distractions
        { x: 2, y: 3.5, width: 4, height: 0.5, type: 'wood' },
        { x: 17, y: 3.5, width: 4, height: 0.5, type: 'wood' },
        { x: 20, y: 3.5, width: 3, height: 0.5, type: 'wood' },
        { x: 33, y: 3.5, width: 4, height: 0.5, type: 'wood' },
        { x: 55, y: 3.5, width: 4, height: 0.5, type: 'wood' },
        { x: 72, y: 3.5, width: 4, height: 0.5, type: 'wood' },
        { x: 88, y: 3.5, width: 4, height: 0.5, type: 'wood' },

        // Cover platforms
        { x: 6, y: 3, width: 2, height: 0.5, type: 'carpet' },
        { x: 12, y: 3, width: 2, height: 0.5, type: 'wood' },
        { x: 25, y: 3, width: 2, height: 0.5, type: 'carpet' },
        { x: 38, y: 3, width: 2, height: 0.5, type: 'wood' },
        { x: 48, y: 3, width: 2, height: 0.5, type: 'carpet' },
        { x: 62, y: 3, width: 2, height: 0.5, type: 'wood' },
        { x: 78, y: 3, width: 2, height: 0.5, type: 'carpet' },
        { x: 95, y: 3, width: 2, height: 0.5, type: 'wood' }
      ],

      // Enemies (type, x, y, patrolPath)
      enemies: [
        { type: 'human', x: 4, y: 1, patrol: [{ x: 0, y: 1 }, { x: 8, y: 1 }] },
        { type: 'dog', x: 18, y: 1, patrol: [{ x: 15, y: 1 }, { x: 22, y: 1 }] },
        { type: 'camera', x: 32, y: 6, rotationSpeed: 0.8, rotationRange: Math.PI / 1.5 },
        { type: 'human', x: 32, y: 1, patrol: [{ x: 28, y: 1 }, { x: 36, y: 1 }] },
        { type: 'dog', x: 50, y: 1, patrol: [{ x: 45, y: 1 }, { x: 56, y: 1 }] },
        { type: 'camera', x: 58, y: 6, rotationSpeed: 1.0, rotationRange: Math.PI / 2 },
        { type: 'human', x: 74, y: 1, patrol: [{ x: 68, y: 1 }, { x: 80, y: 1 }] },
        { type: 'dog', x: 90, y: 1, patrol: [{ x: 85, y: 1 }, { x: 95, y: 1 }] },
        { type: 'camera', x: 100, y: 6, rotationSpeed: 0.7, rotationRange: Math.PI / 1.8 }
      ],

      // Hiding spots (type, x, y)
      hidingSpots: [
        { type: 'box', x: -8, y: 1 },
        { type: 'shadow', x: 10, y: 1 },
        { type: 'furniture', x: 14, y: 1 },
        { type: 'shadow', x: 23, y: 1 },
        { type: 'box', x: 29, y: 1 },
        { type: 'curtain', x: 35, y: 1 },
        { type: 'shadow', x: 42, y: 1 },
        { type: 'furniture', x: 53, y: 1 },
        { type: 'box', x: 60, y: 1 },
        { type: 'curtain', x: 70, y: 1 },
        { type: 'shadow', x: 82, y: 1 },
        { type: 'furniture', x: 92, y: 1 },
        { type: 'box', x: 105, y: 1 }
      ],

      // Distractions (type, x, y)
      distractions: [
        { type: 'vase', x: 2, y: 4 },
        { type: 'book', x: 17, y: 4 },
        { type: 'plant', x: 20, y: 4 },
        { type: 'frame', x: 33, y: 4 },
        { type: 'vase', x: 55, y: 4 },
        { type: 'plant', x: 72, y: 4 },
        { type: 'book', x: 88, y: 4 },
        { type: 'frame', x: 98, y: 4 }
      ]
    }
  }

  /**
   * Level 2: The Warehouse (New level - hard, vertical platforming)
   */
  createLevel2() {
    return {
      name: 'The Warehouse',
      theme: 'warehouse',
      backgroundColor: 0x1a1a2e, // Darker industrial blue
      playerStart: { x: -15, y: 1 },
      goalPosition: { x: 130, y: 10 }, // Goal is HIGH UP!
      cameraBounds: { minX: -20, maxX: 150, minY: 0, maxY: 20 },

      // More vertical platforms for climbing
      platforms: [
        // Ground floor - extended for spawn area
        { x: -10, y: 0, width: 20, height: 1, type: 'tile' }, // Starting area
        { x: 30, y: 0, width: 80, height: 1, type: 'tile' },

        // First level platforms (y=4)
        { x: -5, y: 4, width: 8, height: 0.8, type: 'tile' },
        { x: 10, y: 4, width: 10, height: 0.8, type: 'tile' },
        { x: 25, y: 4, width: 8, height: 0.8, type: 'tile' },
        { x: 40, y: 4, width: 12, height: 0.8, type: 'tile' },
        { x: 58, y: 4, width: 10, height: 0.8, type: 'tile' },
        { x: 74, y: 4, width: 8, height: 0.8, type: 'tile' },
        { x: 88, y: 4, width: 10, height: 0.8, type: 'tile' },

        // Second level platforms (y=7.5)
        { x: 5, y: 7.5, width: 8, height: 0.8, type: 'tile' },
        { x: 20, y: 7.5, width: 10, height: 0.8, type: 'tile' },
        { x: 36, y: 7.5, width: 8, height: 0.8, type: 'tile' },
        { x: 50, y: 7.5, width: 12, height: 0.8, type: 'tile' },
        { x: 68, y: 7.5, width: 10, height: 0.8, type: 'tile' },
        { x: 84, y: 7.5, width: 8, height: 0.8, type: 'tile' },
        { x: 98, y: 7.5, width: 10, height: 0.8, type: 'tile' },

        // Third level platforms (y=11)
        { x: 12, y: 11, width: 8, height: 0.8, type: 'tile' },
        { x: 28, y: 11, width: 10, height: 0.8, type: 'tile' },
        { x: 44, y: 11, width: 8, height: 0.8, type: 'tile' },
        { x: 58, y: 11, width: 12, height: 0.8, type: 'tile' },
        { x: 76, y: 11, width: 10, height: 0.8, type: 'tile' },
        { x: 92, y: 11, width: 8, height: 0.8, type: 'tile' },
        { x: 106, y: 11, width: 10, height: 0.8, type: 'tile' },

        // Top level - goal platform (y=14)
        { x: 125, y: 14, width: 15, height: 1, type: 'tile' }
      ],

      // More enemies, mixed on different levels
      enemies: [
        // Ground level threats
        { type: 'dog', x: 5, y: 1, patrol: [{ x: -5, y: 1 }, { x: 15, y: 1 }] },
        { type: 'human', x: 30, y: 1, patrol: [{ x: 22, y: 1 }, { x: 38, y: 1 }] },
        { type: 'dog', x: 55, y: 1, patrol: [{ x: 48, y: 1 }, { x: 62, y: 1 }] },

        // First level (y=4)
        { type: 'camera', x: 10, y: 8, rotationSpeed: 1.2, rotationRange: Math.PI / 1.5 },
        { type: 'human', x: 44, y: 4.8, patrol: [{ x: 40, y: 4.8 }, { x: 52, y: 4.8 }] },
        { type: 'dog', x: 80, y: 4.8, patrol: [{ x: 74, y: 4.8 }, { x: 88, y: 4.8 }] },

        // Second level (y=7.5)
        { type: 'camera', x: 36, y: 12, rotationSpeed: 1.0, rotationRange: Math.PI / 1.3 },
        { type: 'human', x: 54, y: 8.3, patrol: [{ x: 50, y: 8.3 }, { x: 62, y: 8.3 }] },
        { type: 'camera', x: 84, y: 12, rotationSpeed: 0.9, rotationRange: Math.PI / 1.4 },

        // Third level (y=11)
        { type: 'dog', x: 30, y: 11.8, patrol: [{ x: 28, y: 11.8 }, { x: 38, y: 11.8 }] },
        { type: 'camera', x: 58, y: 16, rotationSpeed: 1.5, rotationRange: Math.PI / 1.2 },
        { type: 'human', x: 78, y: 11.8, patrol: [{ x: 76, y: 11.8 }, { x: 92, y: 11.8 }] },
        { type: 'dog', x: 108, y: 11.8, patrol: [{ x: 106, y: 11.8 }, { x: 116, y: 11.8 }] }
      ],

      // Hiding spots on each level
      hidingSpots: [
        // Ground level
        { type: 'box', x: -8, y: 1 },
        { type: 'shadow', x: 20, y: 1 },
        { type: 'furniture', x: 45, y: 1 },
        { type: 'shadow', x: 70, y: 1 },

        // First level
        { type: 'box', x: -2, y: 4.8 },
        { type: 'curtain', x: 17, y: 4.8 },
        { type: 'shadow', x: 60, y: 4.8 },
        { type: 'furniture', x: 90, y: 4.8 },

        // Second level
        { type: 'box', x: 8, y: 8.3 },
        { type: 'shadow', x: 28, y: 8.3 },
        { type: 'curtain', x: 70, y: 8.3 },
        { type: 'furniture', x: 100, y: 8.3 },

        // Third level
        { type: 'box', x: 15, y: 11.8 },
        { type: 'shadow', x: 48, y: 11.8 },
        { type: 'curtain', x: 66, y: 11.8 },
        { type: 'furniture', x: 110, y: 11.8 }
      ],

      // Distractions on platforms
      distractions: [
        // Ground level
        { type: 'vase', x: 12, y: 1.5 },
        { type: 'plant', x: 35, y: 1.5 },
        { type: 'book', x: 58, y: 1.5 },

        // First level
        { type: 'frame', x: 28, y: 5.3 },
        { type: 'vase', x: 64, y: 5.3 },
        { type: 'plant', x: 82, y: 5.3 },

        // Second level
        { type: 'book', x: 24, y: 8.8 },
        { type: 'frame', x: 56, y: 8.8 },
        { type: 'vase', x: 90, y: 8.8 },

        // Third level
        { type: 'plant', x: 34, y: 12.3 },
        { type: 'book', x: 64, y: 12.3 },
        { type: 'frame', x: 98, y: 12.3 }
      ]
    }
  }
}
