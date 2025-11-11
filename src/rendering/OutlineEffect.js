/**
 * OutlineEffect - Adds black outlines to sprites for a modern cartoon look
 */

import * as THREE from 'three'

export class OutlineEffect {
  /**
   * Add an outline to a sprite
   */
  static addOutline(mesh, outlineWidth = 0.08, outlineColor = 0x000000) {
    // Create outline geometry (slightly larger)
    const outlineGeometry = mesh.geometry.clone()

    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: outlineColor,
      side: THREE.BackSide,
      transparent: mesh.material.transparent,
      opacity: mesh.material.opacity
    })

    const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial)
    outlineMesh.position.copy(mesh.position)
    outlineMesh.rotation.copy(mesh.rotation)
    outlineMesh.scale.copy(mesh.scale).multiplyScalar(1 + outlineWidth)
    outlineMesh.renderOrder = mesh.renderOrder - 1

    return outlineMesh
  }

  /**
   * Update outline to match parent mesh
   */
  static updateOutline(outlineMesh, parentMesh, outlineWidth = 0.08) {
    outlineMesh.position.copy(parentMesh.position)
    outlineMesh.rotation.copy(parentMesh.rotation)
    outlineMesh.scale.copy(parentMesh.scale).multiplyScalar(1 + outlineWidth)
    outlineMesh.visible = parentMesh.visible

    // Sync opacity if transparent
    if (outlineMesh.material.transparent && parentMesh.material.transparent) {
      outlineMesh.material.opacity = parentMesh.material.opacity
    }
  }
}
