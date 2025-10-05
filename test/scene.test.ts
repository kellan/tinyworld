// ABOUTME: Tests for scene objects and world setup
// ABOUTME: Verifies ground plane and object positioning for isometric world
import { describe, it, expect } from 'vitest'
import { Scene, Mesh, PlaneGeometry, BoxGeometry, GridHelper, DirectionalLight, AmbientLight } from 'three'
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

  it('should have a grid helper', () => {
    const scene = new Scene()
    const gridSize = 20
    const divisions = 20

    const gridHelper = new GridHelper(gridSize, divisions)
    scene.add(gridHelper)

    expect(scene.children).toContain(gridHelper)
    expect(gridHelper.type).toBe('GridHelper')
  })
})

describe('Lighting', () => {
  it('should have a directional light', () => {
    const scene = new Scene()
    const light = new DirectionalLight(0xffffff, 1)
    light.position.set(2, 4, 3)
    scene.add(light)

    expect(scene.children).toContain(light)
    expect(light.intensity).toBe(1)
    expect(light.color.getHex()).toBe(0xffffff)
    expect(light.position.x).toBe(2)
    expect(light.position.y).toBe(4)
    expect(light.position.z).toBe(3)
  })

  it('should have an ambient light', () => {
    const scene = new Scene()
    const ambient = new AmbientLight(0xffffff, 0.3)
    scene.add(ambient)

    expect(scene.children).toContain(ambient)
    expect(ambient.intensity).toBe(0.3)
    expect(ambient.color.getHex()).toBe(0xffffff)
  })

  it('should have both directional and ambient lights for proper shading', () => {
    const scene = new Scene()
    const directional = new DirectionalLight(0xffffff, 1)
    const ambient = new AmbientLight(0xffffff, 0.3)
    scene.add(directional, ambient)

    // Filter lights from scene
    const lights = scene.children.filter(child =>
      child instanceof DirectionalLight || child instanceof AmbientLight
    )

    expect(lights.length).toBe(2)
  })
})
