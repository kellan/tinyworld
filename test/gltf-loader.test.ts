// ABOUTME: Tests for GLTF model loading system
// ABOUTME: Verifies GLTFLoader can be instantiated and configured
import { describe, it, expect } from 'vitest'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { setupThreeJsEnvironment } from './helpers/three-test-setup'

setupThreeJsEnvironment()

describe('GLTFLoader', () => {
  it('should be able to instantiate GLTFLoader', () => {
    const loader = new GLTFLoader()

    expect(loader).toBeDefined()
    expect(loader.load).toBeInstanceOf(Function)
    expect(loader.parse).toBeInstanceOf(Function)
  })
})
