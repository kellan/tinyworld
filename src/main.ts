import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Grab container
const container = document.getElementById('app') ?? document.body

// Scene, camera, renderer
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x222222)

const aspect = window.innerWidth / window.innerHeight
const frustumSize = 5
const camera = new THREE.OrthographicCamera(
  -frustumSize * aspect / 2,  // left
  frustumSize * aspect / 2,   // right
  frustumSize / 2,             // top
  -frustumSize / 2,            // bottom
  0.1,                         // near
  1000                         // far
)
// Position camera at classic isometric angle
const distance = 10
const horizontalAngle = Math.PI / 4  // 45 degrees
const verticalAngle = Math.atan(1 / Math.sqrt(2))  // ~35.264 degrees

camera.position.set(
  distance * Math.cos(verticalAngle) * Math.cos(horizontalAngle),
  distance * Math.sin(verticalAngle),
  distance * Math.cos(verticalAngle) * Math.sin(horizontalAngle)
)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
container.appendChild(renderer.domElement)

// Lighting system with multiple presets
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 4, 3)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(directionalLight, ambientLight)

// Lighting presets for experimentation
const lightingPresets = [
  {
    name: 'Cool Neutral (Original)',
    directionalColor: 0xffffff,
    directionalIntensity: 1,
    ambientColor: 0xffffff,
    ambientIntensity: 0.3,
    background: 0x222222
  },
  {
    name: 'Warm Cozy',
    directionalColor: 0xfff4e6,  // Warm white
    directionalIntensity: 1.2,
    ambientColor: 0xffeedd,      // Warm ambient
    ambientIntensity: 0.45,
    background: 0xfff8f0          // Warm cream background
  },
  {
    name: 'Soft Daylight',
    directionalColor: 0xffffee,  // Slightly warm
    directionalIntensity: 1.1,
    ambientColor: 0xe8f4ff,      // Cool ambient (sky bounce)
    ambientIntensity: 0.5,
    background: 0xb8d4e8          // Soft sky blue
  },
  {
    name: 'Golden Hour',
    directionalColor: 0xffd9a0,  // Orange-ish sunlight
    directionalIntensity: 1.3,
    ambientColor: 0xffead0,      // Warm peachy ambient
    ambientIntensity: 0.4,
    background: 0xffeac5          // Golden cream
  }
]

let currentPresetIndex = 1  // Start with Warm Cozy

function applyLightingPreset(index: number) {
  const preset = lightingPresets[index]
  directionalLight.color.setHex(preset.directionalColor)
  directionalLight.intensity = preset.directionalIntensity
  ambientLight.color.setHex(preset.ambientColor)
  ambientLight.intensity = preset.ambientIntensity
  scene.background = new THREE.Color(preset.background)
  console.log(`Lighting: ${preset.name}`)
}

// Apply initial preset
applyLightingPreset(currentPresetIndex)

// GLTF Loader utility
const gltfLoader = new GLTFLoader()

/**
 * Load a GLTF model and add it to the scene
 * @param url - Path to the GLTF/GLB file
 * @param onLoad - Optional callback when model loads successfully
 * @param onProgress - Optional callback for loading progress
 * @param onError - Optional callback for loading errors
 */
function loadModel(
  url: string,
  onLoad?: (gltf: any) => void,
  onProgress?: (event: ProgressEvent) => void,
  onError?: (error: ErrorEvent) => void
) {
  gltfLoader.load(
    url,
    (gltf) => {
      scene.add(gltf.scene)
      console.log(`Model loaded: ${url}`)
      if (onLoad) onLoad(gltf)
    },
    onProgress,
    (error) => {
      console.error(`Error loading model ${url}:`, error)
      if (onError) onError(error)
    }
  )
}

// Ground plane
const groundGeometry = new THREE.PlaneGeometry(10, 10)
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x7a9b6a })
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2
ground.position.y = 0
scene.add(ground)

// Objects on the ground
const box1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x6aa84f })
)
box1.position.set(0, 0.5, 0)

const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 1),
  new THREE.MeshStandardMaterial({ color: 0xe06666 })
)
box2.position.set(2, 1, 0)

const box3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x6fa8dc })
)
box3.position.set(-2, 0.5, 2)

const box4 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 0.5, 1),
  new THREE.MeshStandardMaterial({ color: 0xffd966 })
)
box4.position.set(1, 0.25, -2)

scene.add(box1, box2, box3, box4)

// Load GLTF models
loadModel('/models/duck.glb', (gltf) => {
  // Position the duck on the ground at (-1, 0, -1)
  gltf.scene.position.set(-1, 0, -1)
  // Duck model is already a good size at scale 1
  gltf.scene.scale.set(1, 1, 1)
})

// Animation mixers array
const mixers: THREE.AnimationMixer[] = []

// Load texture for low poly animals
const textureLoader = new THREE.TextureLoader()
const animalTexture = textureLoader.load('/models/Nature_Texture.png')
animalTexture.flipY = false // GLTF textures don't flip Y
animalTexture.colorSpace = THREE.SRGBColorSpace

loadModel('/models/bumblebee.glb', (gltf) => {
  // Position bumblebee hovering above ground (bees fly!)
  gltf.scene.position.set(-2, 1.5, 0)
  // Scale up 50x - model is extremely small (1cm originally)
  gltf.scene.scale.set(50, 50, 50)

  // Apply the proper texture to all meshes
  const materialWithTexture = new THREE.MeshStandardMaterial({
    map: animalTexture,
    roughness: 0.8,
    metalness: 0.1
  })

  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = materialWithTexture
    }
  })

  // Set up animation
  if (gltf.animations && gltf.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(gltf.scene)
    mixers.push(mixer)

    // Play the first animation (wing flapping, flying motion, etc.)
    const action = mixer.clipAction(gltf.animations[0])
    action.play()

    console.log('Bumblebee animation playing:', gltf.animations[0].name)
  }
})

loadModel('/models/frog.glb', (gltf) => {
  // Position frog on the ground (frogs sit!)
  gltf.scene.position.set(1, 0, -1)
  // Scale up 150x - frog is even tinier than bumblebee!
  gltf.scene.scale.set(150, 150, 150)

  // Apply the shared animal texture
  const materialWithTexture = new THREE.MeshStandardMaterial({
    map: animalTexture,
    roughness: 0.8,
    metalness: 0.1
  })

  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = materialWithTexture
    }
  })

  // Set up animation
  if (gltf.animations && gltf.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(gltf.scene)
    mixers.push(mixer)

    const action = mixer.clipAction(gltf.animations[0])
    action.play()

    console.log('Frog animation playing:', gltf.animations[0].name)
  }
})

// Grid helper
const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x888888)
gridHelper.position.y = 0.01 // Slightly above ground to prevent z-fighting
scene.add(gridHelper)

// Add white axis lines for X and Z
const axisLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })

// X axis (red traditionally, but white as requested)
const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-10, 0.02, 0),
  new THREE.Vector3(10, 0.02, 0)
])
const xAxis = new THREE.Line(xAxisGeometry, axisLineMaterial)
scene.add(xAxis)

// Z axis (blue traditionally, but white as requested)
const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, 0.02, -10),
  new THREE.Vector3(0, 0.02, 10)
])
const zAxis = new THREE.Line(zAxisGeometry, axisLineMaterial)
scene.add(zAxis)

// Camera controls state
const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  zoomIn: false,
  zoomOut: false,
  recenter: false,
  rotateLeft: false,
  rotateRight: false
}

// Keyboard event listeners
window.addEventListener('keydown', (e) => {
  switch(e.key.toLowerCase()) {
    case 'a':
    case 'arrowleft':
      keys.left = true
      break
    case 'd':
    case 'arrowright':
      keys.right = true
      break
    case 'w':
    case 'arrowup':
      keys.up = true
      break
    case 's':
    case 'arrowdown':
      keys.down = true
      break
    case 'q':
    case '-':
      keys.zoomOut = true
      break
    case 'e':
    case '=':
    case '+':
      keys.zoomIn = true
      break
    case 'r':
      keys.recenter = true
      break
    case '[':
      keys.rotateLeft = true
      break
    case ']':
      keys.rotateRight = true
      break
    case 'g':
      // Toggle grid and axis visibility
      gridHelper.visible = !gridHelper.visible
      xAxis.visible = gridHelper.visible
      zAxis.visible = gridHelper.visible
      break
    case 'l':
      // Cycle through lighting presets
      currentPresetIndex = (currentPresetIndex + 1) % lightingPresets.length
      applyLightingPreset(currentPresetIndex)
      break
  }
})

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase()
  switch(key) {
    case 'a':
    case 'arrowleft':
      keys.left = false
      break
    case 'd':
    case 'arrowright':
      keys.right = false
      break
    case 'w':
    case 'arrowup':
      keys.up = false
      break
    case 's':
    case 'arrowdown':
      keys.down = false
      break
    case 'q':
    case '-':
      keys.zoomOut = false
      break
    case 'e':
    case '=':
    case '+':
      keys.zoomIn = false
      break
    case 'r':
      keys.recenter = false
      break
  }

  // Handle special keys that don't need toLowerCase
  if (e.key === '[') {
    keys.rotateLeft = false
  }
  if (e.key === ']') {
    keys.rotateRight = false
  }
})

// Camera pan and zoom variables
const panSpeed = 0.1
const lookAtTarget = new THREE.Vector3(0, 0, 0)
let currentFrustumSize = frustumSize
const minZoom = 2
const maxZoom = 20
const zoomSpeed = 0.05
const maxPanDistance = 50 // Maximum distance from origin
const rotateSpeed = 0.02 // Radians per frame

// Trackpad/mouse wheel zoom and rotation
window.addEventListener('wheel', (e) => {
  e.preventDefault()

  // Horizontal scroll = rotation
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    const rotationAmount = e.deltaX * 0.005

    // Get camera offset from lookAt target
    const offset = camera.position.clone().sub(lookAtTarget)

    // Rotate offset around Y axis
    const cosAngle = Math.cos(rotationAmount)
    const sinAngle = Math.sin(rotationAmount)
    const newX = offset.x * cosAngle - offset.z * sinAngle
    const newZ = offset.x * sinAngle + offset.z * cosAngle

    offset.x = newX
    offset.z = newZ

    // Apply rotated offset
    camera.position.copy(lookAtTarget).add(offset)
    camera.lookAt(lookAtTarget)
  } else {
    // Vertical scroll = zoom
    const zoomDelta = e.deltaY > 0 ? (1 + zoomSpeed * 2) : (1 - zoomSpeed * 2)
    currentFrustumSize *= zoomDelta

    // Clamp to min/max
    currentFrustumSize = Math.max(minZoom, Math.min(maxZoom, currentFrustumSize))

    // Update camera frustum
    const aspect = window.innerWidth / window.innerHeight
    camera.left = -currentFrustumSize * aspect / 2
    camera.right = currentFrustumSize * aspect / 2
    camera.top = currentFrustumSize / 2
    camera.bottom = -currentFrustumSize / 2
    camera.updateProjectionMatrix()
  }
}, { passive: false })

// Two-finger drag rotation (trackpad)
let isDragging = false
let lastPointerX = 0

window.addEventListener('pointerdown', (e) => {
  // Shift+drag or middle mouse button for rotation
  if (e.shiftKey || e.button === 1) {
    isDragging = true
    lastPointerX = e.clientX
    e.preventDefault()
  }
})

window.addEventListener('pointermove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - lastPointerX
    lastPointerX = e.clientX

    // Rotate based on horizontal movement
    const rotationAmount = deltaX * 0.01

    // Get camera offset from lookAt target
    const offset = camera.position.clone().sub(lookAtTarget)

    // Rotate offset around Y axis
    const cosAngle = Math.cos(rotationAmount)
    const sinAngle = Math.sin(rotationAmount)
    const newX = offset.x * cosAngle - offset.z * sinAngle
    const newZ = offset.x * sinAngle + offset.z * cosAngle

    offset.x = newX
    offset.z = newZ

    // Apply rotated offset
    camera.position.copy(lookAtTarget).add(offset)
    camera.lookAt(lookAtTarget)

    e.preventDefault()
  }
})

window.addEventListener('pointerup', () => {
  isDragging = false
})

window.addEventListener('pointercancel', () => {
  isDragging = false
})

function updateCameraControls() {
  const panDelta = new THREE.Vector3()

  if (keys.left) {
    // Pan left in isometric space (-X, +Z direction)
    panDelta.add(new THREE.Vector3(-1, 0, 1).normalize().multiplyScalar(panSpeed))
  }
  if (keys.right) {
    // Pan right in isometric space (+X, -Z direction)
    panDelta.add(new THREE.Vector3(1, 0, -1).normalize().multiplyScalar(panSpeed))
  }
  if (keys.up) {
    // Pan up in isometric space (-X, -Z direction)
    panDelta.add(new THREE.Vector3(-1, 0, -1).normalize().multiplyScalar(panSpeed))
  }
  if (keys.down) {
    // Pan down in isometric space (+X, +Z direction)
    panDelta.add(new THREE.Vector3(1, 0, 1).normalize().multiplyScalar(panSpeed))
  }

  if (panDelta.lengthSq() > 0) {
    // Store camera offset before moving
    const cameraOffset = camera.position.clone().sub(lookAtTarget)

    // Try to move lookAt target
    const newLookAt = lookAtTarget.clone().add(panDelta)

    // Check if we hit the boundary
    const hitBoundary = newLookAt.length() > maxPanDistance

    if (hitBoundary) {
      // Flash the background red briefly
      scene.background = new THREE.Color(0x440000)
      setTimeout(() => {
        scene.background = new THREE.Color(0x222222)
      }, 100)

      // Clamp lookAt to max distance from origin
      newLookAt.normalize().multiplyScalar(maxPanDistance)
    }

    lookAtTarget.copy(newLookAt)

    // Update camera position to maintain offset
    camera.position.copy(lookAtTarget).add(cameraOffset)
    camera.lookAt(lookAtTarget)
  }

  // Handle rotation
  let rotationDelta = 0
  if (keys.rotateLeft) {
    rotationDelta += rotateSpeed
  }
  if (keys.rotateRight) {
    rotationDelta -= rotateSpeed
  }

  if (rotationDelta !== 0) {
    // Get camera offset from lookAt target
    const offset = camera.position.clone().sub(lookAtTarget)

    // Rotate offset around Y axis
    const cosAngle = Math.cos(rotationDelta)
    const sinAngle = Math.sin(rotationDelta)
    const newX = offset.x * cosAngle - offset.z * sinAngle
    const newZ = offset.x * sinAngle + offset.z * cosAngle

    offset.x = newX
    offset.z = newZ

    // Apply rotated offset
    camera.position.copy(lookAtTarget).add(offset)
    camera.lookAt(lookAtTarget)
  }

  // Handle recenter
  if (keys.recenter) {
    // Store the current camera-to-lookAt offset (viewing angle)
    const cameraOffset = camera.position.clone().sub(lookAtTarget)

    // Reset lookAt to origin
    lookAtTarget.set(0, 0, 0)

    // Position camera to maintain the same offset (same viewing angle)
    camera.position.copy(lookAtTarget).add(cameraOffset)
    camera.lookAt(lookAtTarget)

    keys.recenter = false // Only recenter once per press
  }

  // Handle zoom
  let zoomChanged = false
  if (keys.zoomIn) {
    currentFrustumSize *= (1 - zoomSpeed)
    zoomChanged = true
  }
  if (keys.zoomOut) {
    currentFrustumSize *= (1 + zoomSpeed)
    zoomChanged = true
  }

  if (zoomChanged) {
    // Clamp to min/max
    currentFrustumSize = Math.max(minZoom, Math.min(maxZoom, currentFrustumSize))

    // Update camera frustum
    const aspect = window.innerWidth / window.innerHeight
    camera.left = -currentFrustumSize * aspect / 2
    camera.right = currentFrustumSize * aspect / 2
    camera.top = currentFrustumSize / 2
    camera.bottom = -currentFrustumSize / 2
    camera.updateProjectionMatrix()
  }
}

// Resize
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight
    camera.left = -currentFrustumSize * aspect / 2
    camera.right = currentFrustumSize * aspect / 2
    camera.top = currentFrustumSize / 2
    camera.bottom = -currentFrustumSize / 2
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// Clock for animation timing
const clock = new THREE.Clock()

// Render loop
function animate() {
    requestAnimationFrame(animate)

    // Get delta time for smooth animations
    const delta = clock.getDelta()

    // Update all animation mixers
    mixers.forEach(mixer => mixer.update(delta))

    updateCameraControls()
    renderer.render(scene, camera)
}
animate()