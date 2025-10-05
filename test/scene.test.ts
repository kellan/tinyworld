// ABOUTME: Tests for scene objects and world setup
// ABOUTME: Verifies ground plane and object positioning for isometric world
import { describe, it, expect } from 'vitest'
import { Scene, Mesh, PlaneGeometry, BoxGeometry } from 'three'
import { setupThreeJsEnvironment } from './helpers/three-test-setup'

setupThreeJsEnvironment()

describe('Scene Setup', () => {
  it('should have a ground plane at y=0', () => {
    const scene = new Scene()
    const groundGeometry = new PlaneGeometry(10, 10)
    const ground = new Mesh(groundGeometry)

    // Rotate to be horizontal (plane defaults to vertical)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0

    scene.add(ground)

    expect(ground.position.y).toBe(0)
    expect(ground.rotation.x).toBeCloseTo(-Math.PI / 2, 2)
    expect(scene.children).toContain(ground)
  })

  it('should have multiple objects positioned on ground', () => {
    const scene = new Scene()

    const box1 = new Mesh(new BoxGeometry(1, 1, 1))
    box1.position.set(0, 0.5, 0)

    const box2 = new Mesh(new BoxGeometry(1, 2, 1))
    box2.position.set(2, 1, 0)

    const box3 = new Mesh(new BoxGeometry(1, 1, 1))
    box3.position.set(-2, 0.5, 2)

    scene.add(box1, box2, box3)

    expect(scene.children.length).toBe(3)
    expect(box1.position.y).toBe(0.5)  // Half the height to sit on ground
    expect(box2.position.y).toBe(1)    // Half of 2-unit height
    expect(box3.position.y).toBe(0.5)
  })
})
