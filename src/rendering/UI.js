/**
 * UI - Simple on-screen UI/HUD for game information
 */

export class UI {
  constructor() {
    this.container = null
    this.detectionMeter = null
    this.objectiveText = null
    this.controlsHint = null
    this.setupUI()
  }

  setupUI() {
    // Create container
    this.container = document.createElement('div')
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      font-family: 'Courier New', monospace;
      color: white;
    `
    document.body.appendChild(this.container)

    // Detection meter
    this.detectionMeter = document.createElement('div')
    this.detectionMeter.style.cssText = `
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
    `
    this.detectionMeter.innerHTML = `
      <div style="font-size: 14px; margin-bottom: 5px;">DETECTION</div>
      <div style="width: 200px; height: 20px; background: rgba(0, 0, 0, 0.5); border: 2px solid white; position: relative;">
        <div id="detection-bar" style="width: 0%; height: 100%; background: linear-gradient(to right, #44ff44, #ffff00, #ff4444); transition: width 0.1s;"></div>
      </div>
    `
    this.container.appendChild(this.detectionMeter)

    // Objective text
    this.objectiveText = document.createElement('div')
    this.objectiveText.style.cssText = `
      position: absolute;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 16px;
      text-align: center;
      background: rgba(0, 0, 0, 0.7);
      padding: 10px 20px;
      border-radius: 5px;
      border: 2px solid #44ff44;
    `
    this.objectiveText.textContent = 'OBJECTIVE: Reach the goal without being detected'
    this.container.appendChild(this.objectiveText)

    // Controls hint (bottom left)
    this.controlsHint = document.createElement('div')
    this.controlsHint.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 20px;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.5);
      padding: 10px;
      border-radius: 5px;
      line-height: 1.6;
    `
    this.controlsHint.innerHTML = `
      <strong>CONTROLS:</strong><br>
      Move: WASD / Arrows<br>
      Jump: SPACE<br>
      Drop Down: S / Down Arrow<br>
      Run: SHIFT (loud!)<br>
      Crouch: CTRL (quiet)<br>
      Hide/Interact: E<br>
      Toggle Labels: L
    `
    this.container.appendChild(this.controlsHint)

    // Status message area (center bottom)
    this.statusMessage = document.createElement('div')
    this.statusMessage.style.cssText = `
      position: absolute;
      bottom: 150px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      background: rgba(0, 0, 0, 0.8);
      padding: 15px 30px;
      border-radius: 10px;
      display: none;
      min-width: 300px;
    `
    this.container.appendChild(this.statusMessage)
  }

  updateDetectionLevel(level) {
    // level is 0-1, where 1 is fully detected
    const bar = document.getElementById('detection-bar')
    if (bar) {
      bar.style.width = `${level * 100}%`
    }
  }

  showStatus(message, color = 'white', duration = 2000) {
    this.statusMessage.textContent = message
    this.statusMessage.style.color = color
    this.statusMessage.style.display = 'block'

    setTimeout(() => {
      this.statusMessage.style.display = 'none'
    }, duration)
  }

  setObjective(text) {
    this.objectiveText.textContent = text
  }

  hide() {
    this.container.style.display = 'none'
  }

  show() {
    this.container.style.display = 'block'
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
  }
}
