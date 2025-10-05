// ABOUTME: Basic sanity test to verify Vitest is working correctly
// ABOUTME: This simple test validates the test infrastructure is set up properly
import { describe, it, expect } from 'vitest'

describe('Vitest Setup', () => {
  it('should pass basic arithmetic test', () => {
    expect(1 + 1).toBe(2)
  })
})
