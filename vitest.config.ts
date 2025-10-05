// ABOUTME: Vitest configuration for testing Three.js application
// ABOUTME: Sets up basic test environment with coverage reporting
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
})
