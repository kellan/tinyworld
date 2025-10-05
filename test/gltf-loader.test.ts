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
