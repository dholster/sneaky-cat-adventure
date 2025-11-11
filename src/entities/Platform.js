/**
 * Platform - Static platform with tiled textures
 */

import * as THREE from 'three'
import { Entity } from './Entity.js'
import { TextureGenerator } from '../rendering/TextureGenerator.js'

export class Platform extends Entity {
  constructor(scene, x, y, width, height, tileType = 'wood') {
    super(scene)

    this.position.set(x, y, 0)
    this.size = { width, height }
    this.tileType = tileType

    // Set collider to match platform size
    this.collider.size.x = width
    this.collider.size.y = height

    // Create tiled visual representation
    this.createTiledSprite(tileType, width, height)

    // Make platforms visible
    if (this.sprite) {
      this.sprite.position.copy(this.position) // Sync position immediately
      this.sprite.position.z = 0.5 // Behind entities but visible
    }

    // Platforms don't move
    this.isStatic = true
  }

  createTiledSprite(tileType, width, height) {
    // Get the appropriate tile texture
    let texture
    switch (tileType) {
      case 'wood':
        texture = TextureGenerator.createWoodFloorTile()
        break
      case 'carpet':
        texture = TextureGenerator.createCarpetTile()
        break
      case 'tile':
        texture = TextureGenerator.createTileFloorTile()
        break
      case 'wallpaper':
        texture = TextureGenerator.createWallpaperTile()
        break
      case 'brick':
        texture = TextureGenerator.createBrickWallTile()
        break
      default:
        texture = TextureGenerator.createWoodFloorTile()
    }

    // Create geometry
    const geometry = new THREE.PlaneGeometry(width, height)

    // Calculate UV repeat based on size (tile texture is 64x64 pixels, each unit = 1)
    const repeatX = width / 1  // Repeat every 1 unit
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

    this.sprite = new THREE.Mesh(geometry, material)
    this.sprite.position.z = 0.5
    this.sprite.rotation.x = Math.PI / 12 // Tilt back for 3D perspective
    this.scene.add(this.sprite)

    console.log(`🎨 Created ${tileType} platform (${width}x${height})`)

    return this.sprite
  }

  update(deltaTime) {
    // Sync sprite position
    if (this.sprite) {
      this.sprite.position.copy(this.position)
    }
  }
}
