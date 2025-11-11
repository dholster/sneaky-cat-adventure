/**
 * Game Configuration Constants
 */

export const Config = {
  // Player Physics
  PLAYER: {
    WALK_SPEED: 4,
    RUN_SPEED: 8,
    CROUCH_SPEED: 2,
    JUMP_FORCE: 12,
    GRAVITY: -30,
    SIZE: {
      width: 1,
      height: 1
    }
  },

  // Camera Settings
  CAMERA: {
    FRUSTUM_SIZE: 20, // Units visible vertically
    SMOOTHNESS: 0.1,
    LOOK_AHEAD_DISTANCE: 3
  },

  // Detection Settings
  DETECTION: {
    VISION_RANGE: 7, // Reduced by 30% from 10
    VISION_ANGLE: Math.PI * 7 / 12, // 105 degrees (reduced by 15 degrees from 120)
    SOUND_RADIUS_WALK: 0,
    SOUND_RADIUS_RUN: 5,
    DETECTION_SPEED: 1.0, // Base detection speed (100% per second)
    DETECTION_THRESHOLD: 1.0 // 100% = fully detected
  },

  // Game Settings
  GAME: {
    LIVES: 9
  },

  // Rendering
  RENDER: {
    CLEAR_COLOR: 0x0d1b2a, // Deep night blue
    PIXEL_RATIO: Math.min(window.devicePixelRatio, 2),
    ANTIALIAS: true
  },

  // Colors (from style guide)
  COLORS: {
    NIGHT_BLUE: 0x0d1b2a,
    SHADOW_BLUE: 0x1b263b,
    MOONLIGHT_BLUE: 0x415a77,
    SECURITY_RED: 0xe63946,
    ALERT_YELLOW: 0xf4d35e,
    SAFE_GREEN: 0x06ffa5,
    ROOM_LIGHT: 0xf4a261
  }
}
