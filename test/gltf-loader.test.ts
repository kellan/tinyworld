// ABOUTME: Tests for GLTF model loading system
// ABOUTME: Verifies GLTFLoader can be instantiated and configured
import { describe, it, expect } from 'vitest'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Scene } from 'three'
import { setupThreeJsEnvironment } from './helpers/three-test-setup'

setupThreeJsEnvironment()

describe('GLTFLoader', () => {
  it('should be able to instantiate GLTFLoader', () => {
    const loader = new GLTFLoader()

    expect(loader).toBeDefined()
    expect(loader.load).toBeInstanceOf(Function)
    expect(loader.parse).toBeInstanceOf(Function)
  })

  it('should have load method that accepts callbacks', () => {
    const loader = new GLTFLoader()

    // Verify the load method signature
    expect(loader.load).toBeInstanceOf(Function)
    expect(loader.load.length).toBeGreaterThanOrEqual(2) // url, onLoad at minimum
  })

  it('should be able to add loaded model to scene', () => {
    // This test verifies the structure, not actual loading
    const scene = new Scene()
    const initialChildCount = scene.children.length

    // Simulate what happens when a model loads
    const mockGLTF = {
      scene: new Scene(),
      scenes: [],
      cameras: [],
      asset: {},
      parser: {},
      userData: {}
    }

    // Add the mock model's scene to our scene
    scene.add(mockGLTF.scene)

    expect(scene.children.length).toBe(initialChildCount + 1)
    expect(scene.children).toContain(mockGLTF.scene)
  })
})

describe('Model Management', () => {
  it('should be able to position a loaded model', () => {
    const scene = new Scene()
    const mockGLTF = {
      scene: new Scene(),
      scenes: [],
      cameras: [],
      asset: {},
      parser: {},
      userData: {}
    }

    // Position the model
    mockGLTF.scene.position.set(1, 2, 3)

    expect(mockGLTF.scene.position.x).toBe(1)
    expect(mockGLTF.scene.position.y).toBe(2)
    expect(mockGLTF.scene.position.z).toBe(3)
  })

  it('should be able to scale a loaded model uniformly', () => {
    const scene = new Scene()
    const mockGLTF = {
      scene: new Scene(),
      scenes: [],
      cameras: [],
      asset: {},
      parser: {},
      userData: {}
    }

    // Scale the model
    const scale = 50
    mockGLTF.scene.scale.set(scale, scale, scale)

    expect(mockGLTF.scene.scale.x).toBe(50)
    expect(mockGLTF.scene.scale.y).toBe(50)
    expect(mockGLTF.scene.scale.z).toBe(50)
  })

  it('should be able to position and scale together', () => {
    const scene = new Scene()
    const mockGLTF = {
      scene: new Scene(),
      scenes: [],
      cameras: [],
      asset: {},
      parser: {},
      userData: {}
    }

    // Apply position and scale
    mockGLTF.scene.position.set(-2, 1.5, 0)
    mockGLTF.scene.scale.set(150, 150, 150)

    expect(mockGLTF.scene.position.x).toBe(-2)
    expect(mockGLTF.scene.position.y).toBe(1.5)
    expect(mockGLTF.scene.position.z).toBe(0)
    expect(mockGLTF.scene.scale.x).toBe(150)
  })
})
