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

// Camera controls state
const keys = {
  left: false,
  right: false,
  up: false,
  down: false
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
  }
})

window.addEventListener('keyup', (e) => {
  switch(e.key.toLowerCase()) {
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
  }
})

// Camera pan function
const panSpeed = 0.1
const lookAtTarget = new THREE.Vector3(0, 0, 0)

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

  if (panDelta.lengthSq() > 0) {
    camera.position.add(panDelta)
    lookAtTarget.add(panDelta)
    camera.lookAt(lookAtTarget)
  }
}

// Resize
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight
    camera.left = -frustumSize * aspect / 2
    camera.right = frustumSize * aspect / 2
    camera.top = frustumSize / 2
    camera.bottom = -frustumSize / 2
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