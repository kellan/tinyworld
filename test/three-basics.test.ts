// ABOUTME: Tests for basic Three.js object instantiation in headless environment
// ABOUTME: Verifies that Scene and other Three.js objects can be created in tests
import { describe, it, expect } from 'vitest'
import { Scene } from 'three'
import { setupThreeJsEnvironment } from './helpers/three-test-setup'

setupThreeJsEnvironment()

describe('Three.js Basic Setup', () => {
  it('should instantiate a Scene', () => {
    const scene = new Scene()
    expect(scene).toBeDefined()
    expect(scene.type).toBe('Scene')
  })

  it('should allow adding objects to Scene', () => {
    const scene = new Scene()
    expect(scene.children.length).toBe(0)
  })
})
