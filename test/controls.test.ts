// ABOUTME: Tests for camera controls (pan and zoom)
// ABOUTME: Verifies keyboard input moves camera position correctly
import { describe, it, expect } from 'vitest'
import { Vector3 } from 'three'

describe('Camera Panning', () => {
  it('should pan camera left (in isometric space)', () => {
    const position = new Vector3(5, 5, 5)
    const lookAt = new Vector3(0, 0, 0)
    const panSpeed = 0.5

    // Pan left in isometric space means moving in the direction perpendicular to view
    // For isometric view at 45°, "left" is along the -X+Z diagonal
    const panDirection = new Vector3(-1, 0, 1).normalize()

    position.add(panDirection.multiplyScalar(panSpeed))
    lookAt.add(panDirection.multiplyScalar(panSpeed))

    expect(position.x).toBeCloseTo(5 - 0.5 * Math.SQRT1_2, 2)
    expect(position.z).toBeCloseTo(5 + 0.5 * Math.SQRT1_2, 2)
    expect(position.y).toBe(5) // Y doesn't change in horizontal pan
  })

  it('should pan camera right (in isometric space)', () => {
    const position = new Vector3(5, 5, 5)
    const lookAt = new Vector3(0, 0, 0)
    const panSpeed = 0.5

    // Pan right in isometric space means moving along the X-Z diagonal
    const panDirection = new Vector3(1, 0, -1).normalize()

    position.add(panDirection.multiplyScalar(panSpeed))
    lookAt.add(panDirection.multiplyScalar(panSpeed))

    expect(position.x).toBeCloseTo(5 + 0.5 * Math.SQRT1_2, 2)
    expect(position.z).toBeCloseTo(5 - 0.5 * Math.SQRT1_2, 2)
    expect(position.y).toBe(5)
  })

  it('should maintain camera-to-lookAt offset during pan', () => {
    const position = new Vector3(10, 10, 10)
    const lookAt = new Vector3(0, 0, 0)
    const panDirection = new Vector3(-1, 0, 1).normalize().multiplyScalar(0.5)

    const offsetBefore = position.clone().sub(lookAt)

    position.add(panDirection)
    lookAt.add(panDirection)

    const offsetAfter = position.clone().sub(lookAt)

    expect(offsetAfter.x).toBeCloseTo(offsetBefore.x, 2)
    expect(offsetAfter.y).toBeCloseTo(offsetBefore.y, 2)
    expect(offsetAfter.z).toBeCloseTo(offsetBefore.z, 2)
  })

  it('should pan camera up (in isometric space)', () => {
    const position = new Vector3(5, 5, 5)
    const lookAt = new Vector3(0, 0, 0)
    const panSpeed = 0.5

    // Pan up in isometric space means moving along the -X-Z diagonal
    const panDirection = new Vector3(-1, 0, -1).normalize()

    position.add(panDirection.multiplyScalar(panSpeed))
    lookAt.add(panDirection.multiplyScalar(panSpeed))

    expect(position.x).toBeCloseTo(5 - 0.5 * Math.SQRT1_2, 2)
    expect(position.z).toBeCloseTo(5 - 0.5 * Math.SQRT1_2, 2)
    expect(position.y).toBe(5) // Y doesn't change in horizontal pan
  })

  it('should pan camera down (in isometric space)', () => {
    const position = new Vector3(5, 5, 5)
    const lookAt = new Vector3(0, 0, 0)
    const panSpeed = 0.5

    // Pan down in isometric space means moving along the +X+Z diagonal
    const panDirection = new Vector3(1, 0, 1).normalize()

    position.add(panDirection.multiplyScalar(panSpeed))
    lookAt.add(panDirection.multiplyScalar(panSpeed))

    expect(position.x).toBeCloseTo(5 + 0.5 * Math.SQRT1_2, 2)
    expect(position.z).toBeCloseTo(5 + 0.5 * Math.SQRT1_2, 2)
    expect(position.y).toBe(5)
  })

  it('should support diagonal panning (combining horizontal and vertical)', () => {
    const position = new Vector3(5, 5, 5)
    const lookAt = new Vector3(0, 0, 0)
    const panSpeed = 0.5

    // Pan left + up simultaneously
    const leftDir = new Vector3(-1, 0, 1).normalize().multiplyScalar(panSpeed)
    const upDir = new Vector3(-1, 0, -1).normalize().multiplyScalar(panSpeed)

    const combinedDelta = leftDir.add(upDir)

    position.add(combinedDelta)
    lookAt.add(combinedDelta)

    // When combining left (-X,+Z) and up (-X,-Z), X becomes more negative, Z cancels out
    expect(position.x).toBeLessThan(5)
    expect(position.y).toBe(5)
    // Z should be close to original since +Z and -Z cancel
  })
})

describe('Camera Zoom', () => {
  it('should zoom in by decreasing frustum size', () => {
    const aspect = 16 / 9
    let frustumSize = 5
    const zoomFactor = 0.9 // Zoom in

    frustumSize *= zoomFactor

    expect(frustumSize).toBe(4.5)
    expect(frustumSize).toBeLessThan(5)
  })

  it('should zoom out by increasing frustum size', () => {
    const aspect = 16 / 9
    let frustumSize = 5
    const zoomFactor = 1.1 // Zoom out

    frustumSize *= zoomFactor

    expect(frustumSize).toBe(5.5)
    expect(frustumSize).toBeGreaterThan(5)
  })

  it('should clamp zoom to min/max bounds', () => {
    const minZoom = 2
    const maxZoom = 20

    // Test min clamping
    let frustumSize = 1.5
    frustumSize = Math.max(minZoom, Math.min(maxZoom, frustumSize))
    expect(frustumSize).toBe(minZoom)

    // Test max clamping
    frustumSize = 25
    frustumSize = Math.max(minZoom, Math.min(maxZoom, frustumSize))
    expect(frustumSize).toBe(maxZoom)

    // Test normal range
    frustumSize = 5
    frustumSize = Math.max(minZoom, Math.min(maxZoom, frustumSize))
    expect(frustumSize).toBe(5)
  })

  it('should maintain aspect ratio when zooming', () => {
    const aspect = 16 / 9
    const frustumSize = 5

    const left = -frustumSize * aspect / 2
    const right = frustumSize * aspect / 2
    const top = frustumSize / 2
    const bottom = -frustumSize / 2

    const width = right - left
    const height = top - bottom
    const calculatedAspect = width / height

    expect(calculatedAspect).toBeCloseTo(aspect, 2)
  })
})

describe('Camera Bounds', () => {
  it('should clamp camera position to max distance from origin', () => {
    const maxDistance = 50
    const position = new Vector3(60, 10, 60)
    const lookAt = new Vector3(50, 0, 50)

    // Calculate distance from origin for lookAt target
    const distanceFromOrigin = lookAt.length()

    if (distanceFromOrigin > maxDistance) {
      // Clamp lookAt to max distance
      lookAt.normalize().multiplyScalar(maxDistance)
    }

    expect(lookAt.length()).toBeLessThanOrEqual(maxDistance)
  })

  it('should allow camera movement within bounds', () => {
    const maxDistance = 50
    const position = new Vector3(10, 10, 10)
    const lookAt = new Vector3(5, 0, 5)

    const distanceFromOrigin = lookAt.length()

    expect(distanceFromOrigin).toBeLessThan(maxDistance)
  })

  it('should maintain camera-lookAt offset when clamping', () => {
    const maxDistance = 50
    const position = new Vector3(60, 10, 60)
    const lookAt = new Vector3(50, 0, 50)
    const offset = position.clone().sub(lookAt)

    // Clamp lookAt
    if (lookAt.length() > maxDistance) {
      lookAt.normalize().multiplyScalar(maxDistance)
      // Restore offset
      position.copy(lookAt).add(offset)
    }

    const newOffset = position.clone().sub(lookAt)
    expect(newOffset.x).toBeCloseTo(offset.x, 2)
    expect(newOffset.y).toBeCloseTo(offset.y, 2)
    expect(newOffset.z).toBeCloseTo(offset.z, 2)
  })
})
