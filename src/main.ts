import * as THREE from 'three'

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

// Light
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(2, 4, 3)
scene.add(light, new THREE.AmbientLight(0xffffff, 0.3))

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

// Render loop
function animate() {
    requestAnimationFrame(animate)
    updateCameraControls()
    renderer.render(scene, camera)
}
animate()