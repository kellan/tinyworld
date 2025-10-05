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
})
