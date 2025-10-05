// ABOUTME: Test utilities for Three.js in headless Node.js environment
// ABOUTME: Provides WebGL context mocking and basic setup helpers for testing
import { beforeAll } from 'vitest'

/**
 * Mock WebGL context for headless testing
 * Three.js needs WebGLRenderingContext to exist, even if we don't actually render
 */
export function setupThreeJsEnvironment() {
  beforeAll(() => {
    // Mock HTMLCanvasElement if it doesn't exist
    if (typeof HTMLCanvasElement === 'undefined') {
      global.HTMLCanvasElement = class HTMLCanvasElement {
        getContext() {
          return mockWebGLContext()
        }
      } as any
    }

    // Mock WebGLRenderingContext
    if (typeof WebGLRenderingContext === 'undefined') {
      global.WebGLRenderingContext = function() {} as any
    }
  })
}

/**
 * Creates a minimal mock WebGL context
 * Provides just enough to prevent Three.js from erroring
 */
function mockWebGLContext() {
  return {
    canvas: {},
    getParameter: () => null,
    getExtension: () => null,
    createProgram: () => ({}),
    createShader: () => ({}),
    shaderSource: () => {},
    compileShader: () => {},
    attachShader: () => {},
    linkProgram: () => {},
    getProgramParameter: () => true,
    getShaderParameter: () => true,
    deleteShader: () => {},
    useProgram: () => {},
    viewport: () => {},
    clearColor: () => {},
    clear: () => {},
    enable: () => {},
    disable: () => {},
    depthFunc: () => {},
    blendFunc: () => {},
    getUniformLocation: () => ({}),
    getAttribLocation: () => 0,
  }
}
