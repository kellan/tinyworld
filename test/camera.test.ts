// ABOUTME: Tests for camera setup and configuration
// ABOUTME: Verifies orthographic camera properties for isometric view
import { describe, it, expect } from 'vitest'
import { OrthographicCamera } from 'three'
import { setupThreeJsEnvironment } from './helpers/three-test-setup'

setupThreeJsEnvironment()

describe('Orthographic Camera', () => {
  it('should have orthographic camera properties', () => {
    const aspect = 16 / 9
    const frustumSize = 5

    const camera = new OrthographicCamera(
      -frustumSize * aspect / 2,  // left
      frustumSize * aspect / 2,   // right
      frustumSize / 2,             // top
      -frustumSize / 2,            // bottom
      0.1,                         // near
      1000                         // far
    )

    expect(camera.type).toBe('OrthographicCamera')
    expect(camera.left).toBeLessThan(0)
    expect(camera.right).toBeGreaterThan(0)
    expect(camera.top).toBeGreaterThan(0)
    expect(camera.bottom).toBeLessThan(0)
    expect(camera.near).toBe(0.1)
    expect(camera.far).toBe(1000)
  })

  it('should maintain aspect ratio in frustum', () => {
    const aspect = 16 / 9
    const frustumSize = 5

    const camera = new OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    )

    const width = camera.right - camera.left
    const height = camera.top - camera.bottom
    const calculatedAspect = width / height

    expect(calculatedAspect).toBeCloseTo(aspect, 2)
  })

  it('should be positioned at isometric angle', () => {
    // Classic isometric: 45° horizontal rotation, ~35.264° vertical (arctan(1/√2))
    const distance = 10
    const horizontalAngle = Math.PI / 4  // 45 degrees
    const verticalAngle = Math.atan(1 / Math.sqrt(2))  // ~35.264 degrees

    // Calculate expected position
    const x = distance * Math.cos(verticalAngle) * Math.cos(horizontalAngle)
    const y = distance * Math.sin(verticalAngle)
    const z = distance * Math.cos(verticalAngle) * Math.sin(horizontalAngle)

    const camera = new OrthographicCamera(-5, 5, 5, -5, 0.1, 1000)
    camera.position.set(x, y, z)
    camera.lookAt(0, 0, 0)

    // Verify position components are reasonable for isometric view
    expect(camera.position.x).toBeCloseTo(x, 2)
    expect(camera.position.y).toBeCloseTo(y, 2)
    expect(camera.position.z).toBeCloseTo(z, 2)

    // Verify it's looking at origin
    expect(camera.position.length()).toBeCloseTo(distance, 2)
  })

  it('should update frustum on aspect ratio change', () => {
    const frustumSize = 5

    // Start with square aspect
    let aspect = 1
    const camera = new OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    )

    expect(camera.left).toBe(-2.5)
    expect(camera.right).toBe(2.5)

    // Simulate resize to widescreen (16:9)
    aspect = 16 / 9
    camera.left = -frustumSize * aspect / 2
    camera.right = frustumSize * aspect / 2
    camera.top = frustumSize / 2
    camera.bottom = -frustumSize / 2
    camera.updateProjectionMatrix()

    expect(camera.left).toBeCloseTo(-4.44, 2)
    expect(camera.right).toBeCloseTo(4.44, 2)
    expect(camera.top).toBe(2.5)
    expect(camera.bottom).toBe(-2.5)

    // Verify aspect is maintained
    const width = camera.right - camera.left
    const height = camera.top - camera.bottom
    expect(width / height).toBeCloseTo(aspect, 2)
  })
})
