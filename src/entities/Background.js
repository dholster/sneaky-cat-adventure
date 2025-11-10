/**
 * Background - Static background wall/surface
 */

import * as THREE from 'three'
import { TextureGenerator } from '../rendering/TextureGenerator.js'

export class Background {
  constructor(scene, x, y, width, height, tileType = 'wallpaper') {
    this.scene = scene
    this.position = new THREE.Vector3(x, y, 0)
    this.size = { width, height }
    this.tileType = tileType

    this.createTiledBackground(tileType, width, height)
  }

  createTiledBackground(tileType, width, height) {
    // Get the appropriate tile texture
    let texture
    switch (tileType) {
      case 'wallpaper':
        texture = TextureGenerator.createWallpaperTile()
        break
      case 'brick':
        texture = TextureGenerator.createBrickWallTile()
        break
      case 'wood':
        texture = TextureGenerator.createWoodFloorTile()
        break
      default:
        texture = TextureGenerator.createWallpaperTile()
    }

    // Create geometry
    const geometry = new THREE.PlaneGeometry(width, height)

    // Calculate UV repeat
    const repeatX = width / 1
    const repeatY = height / 1

    // Set UV repeating
    texture.repeat.set(repeatX, repeatY)

    // Fix UVs for flipY = false textures
    const uvAttribute = geometry.attributes.uv
    uvAttribute.setXY(0, 0, 0)              // top-left
    uvAttribute.setXY(1, repeatX, 0)        // top-right
    uvAttribute.setXY(2, 0, repeatY)        // bottom-left
    uvAttribute.setXY(3, repeatX, repeatY)  // bottom-right
    uvAttribute.needsUpdate = true

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: false,
      side: THREE.DoubleSide
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(this.position.x, this.position.y, -1) // Behind everything
    this.scene.add(this.mesh)

    console.log(`🎨 Created ${tileType} background (${width}x${height})`)
  }

  destroy() {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.material.dispose()
      this.mesh = null
    }
  }
}
