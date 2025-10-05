# Development Log

## 2025-10-05

### Phase 0.1: Vitest Setup ✅ (Completed)

**Goal**: Set up testing infrastructure with Vitest

**Actions Taken**:
1. Installed `vitest` and `@vitest/ui` as dev dependencies
2. Created `vitest.config.ts` with basic configuration
   - Used `node` environment (will need to mock WebGL for Three.js tests)
   - Enabled globals for easier test writing
   - Set up v8 coverage provider
3. Added `test` script to package.json
4. Created first test in `test/setup.test.ts`
   - User requested tests be in their own directory (not in `src/`)
   - Simple sanity test (1 + 1 = 2) to verify infrastructure

**Learnings**:
- User prefers clean separation: tests in `test/` directory, not mixed with source
- Following TDD approach: Red → Green → Refactor

**Decisions**:
- Using `vitest` over Jest because it's faster and integrates better with Vite
- Placed test in dedicated `test/` directory per user preference
- Using globals mode for cleaner test syntax

**Test Results**: ✅ All tests passing (1 test)

**Time**: ~15 minutes

**Next**: Phase 0.2 - Three.js Test Utilities (create headless Three.js test setup)

---

### Phase 0.2: Three.js Test Utilities ✅ (Completed)

**Goal**: Create test helper for headless Three.js testing without browser

**Actions Taken**:
1. Created `test/helpers/three-test-setup.ts` with WebGL mocking utilities
   - `setupThreeJsEnvironment()` function to mock WebGL context
   - `mockWebGLContext()` provides minimal WebGL API surface
   - Mocks `HTMLCanvasElement` and `WebGLRenderingContext` globals
2. Created `test/three-basics.test.ts` to verify Three.js works in tests
   - Test instantiating a Scene object
   - Test that Scene has correct type property
   - Test that Scene starts with empty children array

**Learnings**:
- Three.js can work in Node.js environment with minimal WebGL mocking
- Don't need full WebGL implementation - just enough to prevent errors
- Scene objects are just data structures, don't need actual rendering for basic tests

**Decisions**:
- Created reusable `setupThreeJsEnvironment()` helper for all future Three.js tests
- Mock only what's needed (YAGNI) - can expand mock as we encounter errors
- Kept mocking logic separate in `helpers/` directory for organization

**Challenges**:
- Initially uncertain how much of WebGL API to mock
- Decided to start minimal and add more as needed (following TDD)

**Test Results**: ✅ All tests passing (3 tests total: 1 setup test + 2 Three.js tests)

**Time**: ~20 minutes

**Next**: Phase 1.1 - Switch to Orthographic Camera

---

### Phase 1.1: Switch to Orthographic Camera ✅ (Completed)

**Goal**: Replace PerspectiveCamera with OrthographicCamera to remove perspective distortion

**Actions Taken**:
1. Wrote tests first (TDD Red phase) in `test/camera.test.ts`
   - Test orthographic camera properties (left, right, top, bottom, near, far)
   - Test aspect ratio is maintained in frustum calculations
2. Updated `src/main.ts` to use OrthographicCamera
   - Replaced PerspectiveCamera with OrthographicCamera
   - Set frustumSize = 5 for consistent viewport
   - Calculated left/right/top/bottom based on aspect ratio
3. Fixed resize handler for orthographic camera
   - Changed from updating `camera.aspect` to updating frustum bounds
   - Maintains proper aspect ratio on window resize

**Learnings**:
- Orthographic cameras don't have an `aspect` property like perspective cameras
- Must manually update left/right/top/bottom on resize
- frustumSize controls the "zoom" level (how much of the scene is visible)
- Cube now renders with parallel edges (no perspective distortion)

**Decisions**:
- Chose frustumSize = 5 as a reasonable default (can adjust later for better framing)
- Kept same near/far clipping planes (0.1 to 1000) as original
- Maintained camera position at (2, 2, 3) to keep cube visible

**Test Results**: ✅ All tests passing (5 tests total)

**Time**: ~20 minutes

**Next**: Phase 1.2 - Set Isometric Angle

---

### Phase 1.2: Set Isometric Angle ✅ (Completed)

**Goal**: Position camera at classic isometric viewing angle (45° horizontal, ~35.264° vertical)

**Actions Taken**:
1. Wrote test for isometric camera positioning in `test/camera.test.ts`
   - Test verifies camera position components match isometric angle calculations
   - Test confirms camera is looking at origin (0, 0, 0)
2. Updated `src/main.ts` with isometric camera positioning
   - Horizontal angle: 45° (Math.PI / 4)
   - Vertical angle: ~35.264° (Math.atan(1/√2))
   - Distance: 10 units from origin
   - Added `camera.lookAt(0, 0, 0)` to point at center

**Learnings**:
- Classic isometric angle uses vertical angle of arctan(1/√2) ≈ 35.264°
- This creates the characteristic "equal angles" between the three visible axes
- Combined with orthographic projection, gives true isometric view
- Position calculation: spherical coordinates converted to Cartesian

**Decisions**:
- Set distance = 10 for good view of scene (adjustable later if needed)
- Using mathematical calculation rather than hard-coded position for clarity
- Looking at origin (0, 0, 0) keeps ground plane centered

**Test Results**: ✅ All tests passing (6 tests total)

**Time**: ~15 minutes

**Next**: Phase 1.2a - Small Flat World

---

### Phase 1.2a: Small Flat World ✅ (Completed)

**Goal**: Replace rotating cube with static isometric scene to visualize the view properly

**Actions Taken**:
1. Wrote tests for scene setup in `test/scene.test.ts`
   - Test ground plane at y=0 with correct rotation
   - Test multiple objects positioned on ground at correct heights
2. Removed OrbitControls and rotating cube from `src/main.ts`
   - Removed OrbitControls import and setup (we'll add custom controls later)
   - Removed cube rotation in render loop
3. Added ground plane
   - 10x10 PlaneGeometry rotated to horizontal (-Math.PI/2 on x-axis)
   - Green-ish color (0x7a9b6a) to represent grass
4. Added 4 colored boxes at different positions
   - Box1 (green): 1x1x1 at (0, 0.5, 0)
   - Box2 (red): 1x2x1 at (2, 1, 0) - taller box
   - Box3 (blue): 1x1x1 at (-2, 0.5, 2)
   - Box4 (yellow): 1x0.5x1 at (1, 0.25, -2) - shorter box

**Learnings**:
- NOW the isometric view is clearly visible!
- Without OrbitControls, the static view shows the true isometric angle
- Objects at different positions/heights create depth perception in isometric view
- Y-position must be half the object's height to "sit" on ground (y=0)
- PlaneGeometry defaults to vertical, needs -90° rotation on x-axis to be horizontal

**Decisions**:
- Used different colors to make objects distinguishable
- Varied heights (0.5, 1, 2) to show depth in isometric projection
- Positioned objects spread out to demonstrate the viewing angle
- Kept lighting simple for now (existing directional + ambient)

**Challenges**:
- Initially considered keeping OrbitControls but realized it would defeat the purpose of seeing pure isometric

**Test Results**: ✅ All tests passing (8 tests total)

**Time**: ~20 minutes

**Next**: Phase 1.3 - Adjust Orthographic Frustum

---

### Phase 1.3: Adjust Orthographic Frustum ✅ (Completed)

**Goal**: Ensure orthographic camera maintains proper aspect ratio on window resize

**Actions Taken**:
1. Added test for aspect ratio handling in `test/camera.test.ts`
   - Test verifies frustum updates correctly when aspect changes
   - Test simulates resize from 1:1 to 16:9 aspect ratio
   - Confirms frustum width/height maintains target aspect ratio
2. Verified existing resize handler in `src/main.ts` is correct
   - Already properly calculates left/right based on aspect * frustumSize
   - Top/bottom remain constant (maintains vertical scale)
   - Calls updateProjectionMatrix() after changes

**Learnings**:
- Orthographic camera aspect ratio is controlled by frustum bounds, not a single property
- Only horizontal bounds (left/right) should change with aspect ratio
- Vertical bounds (top/bottom) stay constant to maintain consistent vertical scale
- This prevents scene distortion when window is resized
- The resize handler was already implemented correctly from Phase 1.1!

**Decisions**:
- No code changes needed - just added test to verify existing implementation
- Test uses 1:1 → 16:9 transition as representative resize scenario
- Keeping frustumSize constant during resize maintains zoom level

**Test Results**: ✅ All tests passing (9 tests total)

**Time**: ~10 minutes (mostly verification)

**Next**: Phase 2.1 - Pan Controls - Horizontal

---

### Phase 2.1: Pan Controls - Horizontal ✅ (Completed)

**Goal**: Implement keyboard controls for horizontal camera panning (left/right)

**Actions Taken**:
1. Created `test/controls.test.ts` with panning tests
   - Test pan left in isometric space (-X, +Z diagonal)
   - Test pan right in isometric space (+X, -Z diagonal)
   - Test that camera-to-lookAt offset is maintained during pan
2. Implemented keyboard input system in `src/main.ts`
   - Created keys state object to track pressed keys
   - Added keydown/keyup event listeners for A/D and arrow keys
   - Support both WASD and arrow keys
3. Implemented `updateCameraControls()` function
   - Calculates pan delta based on pressed keys
   - Pans in isometric-aligned directions (diagonals in world space)
   - Updates both camera position and lookAt target together
   - Maintains viewing angle by moving camera and target in sync
4. Integrated into render loop
   - Called `updateCameraControls()` every frame for smooth movement

**Learnings**:
- In isometric view, "left" and "right" are diagonal directions in world space
- Left = (-X, +Z) normalized, Right = (+X, -Z) normalized
- Must update both camera.position AND lookAt target to maintain view angle
- Using state object for keys allows smooth movement (not just single key presses)
- panSpeed = 0.1 gives good responsive feel without being too fast

**Decisions**:
- Support both WASD and arrow keys for flexibility
- Pan speed of 0.1 units per frame (can adjust later)
- Move camera AND lookAt together (not just rotate camera)
- Store lookAtTarget as variable since we modify it each frame

**Test Results**: ✅ All tests passing (12 tests total)

**Time**: ~25 minutes

**Next**: Phase 2.2 - Pan Controls - Vertical

---

### Phase 2.2: Pan Controls - Vertical ✅ (Completed)

**Goal**: Add vertical panning (W/S keys) to complete full 2D camera movement

**Actions Taken**:
1. Added vertical panning tests to `test/controls.test.ts`
   - Test pan up in isometric space (-X, -Z diagonal)
   - Test pan down in isometric space (+X, +Z diagonal)
   - Test diagonal panning (combining horizontal + vertical input)
2. Extended `updateCameraControls()` in `src/main.ts`
   - Added up/down panning logic using W/S and up/down arrows
   - Up = (-X, -Z) direction, Down = (+X, +Z) direction
   - Panning vectors automatically combine for diagonal movement

**Learnings**:
- Isometric "up" and "down" are also diagonal in world space
- Up = both X and Z decrease, Down = both X and Z increase
- Multiple key inputs naturally combine into diagonal movement
- The normalized vectors automatically handle diagonal speed consistency

**Decisions**:
- Reused same panSpeed (0.1) for vertical as horizontal
- Same key binding pattern: both WASD and arrow keys supported
- Letting vectors add naturally rather than special-casing diagonals

**Test Results**: ✅ All tests passing (15 tests total)

**Time**: ~20 minutes

**Next**: Phase 2.3 - Zoom Controls

---

### Phase 2.3: Zoom Controls ✅ (Completed)

**Goal**: Implement zoom in/out via keyboard and trackpad/mouse wheel

**Actions Taken**:
1. Added zoom tests to `test/controls.test.ts`
   - Test zoom in (decreasing frustum size)
   - Test zoom out (increasing frustum size)
   - Test min/max zoom clamping
   - Test aspect ratio maintained during zoom
2. Extended keyboard controls for zoom
   - Q or - to zoom out
   - E or + to zoom in
   - Added zoomIn/zoomOut to keys state
3. Implemented zoom logic in `updateCameraControls()`
   - Multiplies frustumSize by zoom factor
   - Clamps between minZoom (2) and maxZoom (20)
   - Updates camera frustum and projection matrix
4. Added trackpad/mouse wheel zoom support
   - Listens to wheel events for smooth scrolling zoom
   - Works with two-finger trackpad swipe and mouse wheel
   - Uses same zoom speed and clamping as keyboard
5. Updated resize handler to use `currentFrustumSize`

**Learnings**:
- Orthographic zoom = adjusting frustum size (smaller = zoomed in, larger = zoomed out)
- Must update all 4 frustum bounds (left, right, top, bottom) and call updateProjectionMatrix()
- Wheel event works for both mouse wheel and trackpad gestures
- preventDefault() needed to avoid page scrolling during zoom
- Aspect ratio automatically maintained by using same calculation as initial setup

**Decisions**:
- Skipped mouse wheel initially for mobile compatibility, added keyboard zoom
- Added trackpad support per user request (wheel event works well)
- Zoom range: 2 (very close) to 20 (far away) - can adjust later
- Zoom speed: 0.05 for keyboard, 0.1 for wheel (2x faster for smooth scrolling)
- Using Q/E keys (common in games) plus -/+ for intuitive zoom

**Test Results**: ✅ All tests passing (19 tests total)

**Time**: ~25 minutes

**Next**: Phase 2.4 - Camera Bounds

---

### Phase 2.4: Camera Bounds ✅ (Completed)

**Goal**: Prevent camera from panning infinitely far from origin

**Actions Taken**:
1. Added camera bounds tests to `test/controls.test.ts`
   - Test clamping to max distance from origin
   - Test movement allowed within bounds
   - Test camera-lookAt offset maintained when clamping
2. Implemented bounds checking in `updateCameraControls()`
   - Set maxPanDistance = 50 units from origin
   - Check lookAt target distance before applying pan
   - Clamp lookAt to sphere of radius maxPanDistance
   - Maintain camera offset when clamping
3. Added visual feedback for hitting boundary
   - Background flashes dark red (0x440000) for 100ms
   - Helps user understand they've reached the edge

**Learnings**:
- Bounds are checked on lookAt target, not camera position
- Must preserve camera-to-lookAt offset when clamping
- Visual feedback is important - without it, boundary feels like a bug
- Tested with smaller bounds (15) first to make effect obvious

**Decisions**:
- Using spherical bounds (distance from origin) rather than box bounds
- Max distance of 50 units gives plenty of room to explore
- Red flash is subtle but effective feedback
- Temporary background change uses setTimeout (could optimize later)

**Test Results**: ✅ All tests passing (22 tests total)

**Time**: ~20 minutes

**Next**: Phase 3.1 - Ground Plane (already done in 1.2a, skip to 3.2)

---

### Camera Rotation (Bonus Feature) ✅ (Completed)

**Goal**: Add ability to rotate camera around the world

**Actions Taken**:
1. Added bracket key rotation controls
   - [ key rotates left (counter-clockwise)
   - ] key rotates right (clockwise)
   - Continuous rotation while key is held
2. Implemented trackpad horizontal swipe rotation
   - Two-finger horizontal swipe rotates camera
   - Detects horizontal vs vertical scroll via deltaX/deltaY comparison
   - Vertical swipe still zooms, horizontal swipe rotates
3. Camera rotates around Y axis
   - Maintains distance from lookAt target
   - Smooth rotation using trigonometry (cos/sin)
   - Works at any camera position

**Learnings**:
- Rotation is just moving camera position in a circle around lookAt target
- Use 2D rotation matrix: newX = x*cos - z*sin, newZ = x*sin + z*cos
- wheel event provides both deltaX (horizontal) and deltaY (vertical)
- Can distinguish between horizontal and vertical trackpad gestures

**Decisions**:
- Chose bracket keys [ and ] (easy to reach, not used for other controls)
- Rotation speed: 0.02 radians/frame for keyboard, 0.005 for trackpad
- Removed Shift+drag approach in favor of natural horizontal scroll
- Both methods share same rotation logic (DRY)

**Test Results**: ✅ All tests passing (22 tests - no new tests needed)

**Time**: ~15 minutes

**Next**: Phase 3.2 - Grid Helper

---

### Phase 3.2: Grid Helper ✅ (Completed)

**Goal**: Add visual grid overlay to help visualize space and alignment

**Actions Taken**:
1. Added test for GridHelper in `test/scene.test.ts`
   - Verifies GridHelper can be created and added to scene
2. Created GridHelper in `src/main.ts`
   - 20x20 unit grid with 20 divisions (1 unit per square)
   - Colors: center lines 0x444444, grid lines 0x888888
   - Positioned slightly above ground (y=0.01) to prevent z-fighting
3. Added white axis lines for X and Z axes
   - Bright white (0xffffff) lines overlaid on grid
   - Makes center axes clearly visible
   - Toggled together with grid
4. Implemented G key toggle
   - Press G to show/hide grid and axis lines
   - Useful to reduce visual clutter when not needed

**Learnings**:
- GridHelper takes (size, divisions, centerLineColor, gridColor)
- Must position slightly above ground to prevent z-fighting with plane
- GridHelper doesn't support variable line widths
- Can add separate Line objects for custom axis highlighting
- LineBasicMaterial linewidth parameter has limited browser support

**Decisions**:
- Grid size 20x20 matches our camera bounds (50 units)
- 1 unit per grid square for easy measurement
- White axis lines for maximum visibility
- G key for grid toggle (G for Grid)
- Toggle hides both grid and axis lines together

**Test Results**: ✅ All tests passing (23 tests total)

**Time**: ~15 minutes

**Next**: Phase 3.4 - Basic Lighting (3.3 already done in 1.2a)

---

### Phase 3.4: Basic Lighting ✅ (Completed)

**Goal**: Ensure proper lighting setup with directional and ambient lights

**Actions Taken**:
1. Added lighting tests to `test/scene.test.ts`
   - Test DirectionalLight properties (position, intensity, color)
   - Test AmbientLight properties (intensity, color)
   - Test both lights exist in scene for proper shading
2. Verified existing lighting setup from initial scaffold
   - DirectionalLight at position (2, 4, 3) with intensity 1
   - AmbientLight with intensity 0.3
   - Both lights already properly configured

**Learnings**:
- The initial project scaffold already included proper lighting
- DirectionalLight provides main illumination and creates shadows/depth
- AmbientLight fills in shadows to prevent completely black areas
- Both lights together create good contrast and depth perception
- Testing confirmed lighting setup matches best practices

**Decisions**:
- Kept existing lighting configuration (no changes needed)
- DirectionalLight from upper-right creates good isometric shading
- Ambient intensity at 0.3 prevents overly dark shadows
- White light (0xffffff) for both to preserve object colors

**Test Results**: ✅ All tests passing (26 tests total)

**Time**: ~15 minutes

**Next**: Phase 4.1 - GLTFLoader Setup

---

### Lighting Experimentation (Bonus Polish)

**Goal**: Create cozy diorama aesthetic with warmer, softer lighting

**Actions Taken**:
1. Created 4 lighting presets for experimentation
   - Cool Neutral (original): white lights, dark gray background
   - Warm Cozy: cream-toned lights, warm background, softer shadows (0.45 ambient)
   - Soft Daylight: warm sun + cool ambient (sky bounce), sky blue background
   - Golden Hour: orange sunlight, peachy ambient, golden background
2. Added L key to cycle through presets
3. Set "Warm Cozy" as default for better diorama feel
4. Console logs preset name on change

**Learnings**:
- Color temperature dramatically affects mood (warm = cozy, cool = clinical)
- Ambient intensity controls shadow softness (0.3 = harsh, 0.5 = very soft)
- Background color is crucial for diorama feel (dark gray felt too "void-like")
- Real-time preset switching enables rapid aesthetic iteration
- Slightly warm directional (0xfff4e6) + warm ambient (0xffeedd) creates inviting feel

**Decisions**:
- Kept all 4 presets for flexibility during development
- Started with Warm Cozy (preset index 1) as most "diorama-like"
- Used L key (L for Lighting) for easy testing
- Increased directional intensity slightly (1.2) to compensate for brighter backgrounds
- Chose cream/warm backgrounds over pure white (less eye strain)

**Test Results**: ✅ All tests passing (26 tests - lighting tests still valid)

**Time**: ~15 minutes

**Next**: Phase 4.1 - GLTFLoader Setup

---

### Phase 4.1: GLTFLoader Setup ✅ (Completed)

**Goal**: Set up GLTF model loading infrastructure

**Actions Taken**:
1. Created `test/gltf-loader.test.ts` with GLTFLoader instantiation test
   - Verifies loader can be instantiated
   - Checks load() and parse() methods exist
2. Imported GLTFLoader from 'three/examples/jsm/loaders/GLTFLoader.js'
   - No additional installation needed (already included in Three.js)
3. Created `loadModel()` utility function in `src/main.ts`
   - Takes url, onLoad, onProgress, and onError callbacks
   - Automatically adds loaded model to scene
   - Console logs success/errors for debugging
   - Simple API for loading models in next phases

**Learnings**:
- GLTFLoader is included in Three.js examples/jsm, no extra package needed
- GLTF is the standard format for 3D models on the web
- Loader API is callback-based (async)
- Need to add gltf.scene to our scene (not just gltf)
- Loading is asynchronous, so need error handling

**Decisions**:
- Created reusable loadModel() utility rather than using loader directly
- Auto-add to scene in utility for convenience (can be overridden with onLoad)
- Added TypeScript types for better IDE support
- Console logging for visibility during development

**Test Results**: ✅ All tests passing (27 tests total)

**Time**: ~20 minutes

**Next**: Phase 4.2 - Load First GLTF

---

### Phase 4.2: Load First GLTF ✅ (Completed)

**Goal**: Load an actual GLTF model into the scene

**Actions Taken**:
1. Created `public/models/` directory for assets
2. Downloaded duck.glb from Khronos GLTF Sample Models repository
   - Official sample model (118KB)
   - Well-tested, guaranteed to work
3. Added tests for model loading structure
   - Test that loader accepts callbacks
   - Test that loaded model can be added to scene
4. Called `loadModel('/models/duck.glb')` in main.ts
   - Used onLoad callback to position at (-1, 0, -1)
   - Set scale to 1.0 (model is already good size)
5. Debugged visibility issues
   - Initially tried scale 0.01 (too small to see)
   - Changed to scale 1.0 - duck became visible
   - Model loads successfully and renders in scene

**Learnings**:
- GLTF models come in various scales - need to experiment
- The duck model's native scale is appropriate at 1.0
- Vite serves files from `public/` directory at root URL
- GLTF loading is async - model appears after scene starts rendering
- Models include their own materials and textures
- The Khronos sample models are excellent for testing

**Decisions**:
- Used official Khronos sample model for reliability
- Positioned duck at (-1, 0, -1) next to colored boxes
- Kept scale at 1.0 for good visibility
- Removed debug console logs after confirming it works

**Challenges**:
- Initial scale of 0.01 made duck invisible
- Learned importance of trying different scales when model not visible

**Test Results**: ✅ All tests passing (29 tests total)

**Time**: ~30 minutes

**Next**: Phase 4.3 - Model Management

---

### Animated Low Poly Animals Integration (Bonus Discovery)

**Goal**: Convert and load FBX animal models from asset pack

**Actions Taken**:
1. Discovered FBX animal models in `Animated_Low_Poly/` directory
   - 9 animals: Frog, Fish, BumbleBee, Butterfly, Turtle, Skipper, Firefly, Bird, Finch
   - Includes animations, textures, and Unity materials
2. Tested fbx2gltf conversion tool
   - Found working command: `/opt/homebrew/lib/node_modules/fbx2gltf/bin/Darwin/FBX2glTF`
   - Initially tried GLTF format - failed with "Invalid typed array length" error
   - Switched to GLB (binary) with `--binary` flag - SUCCESS
3. Converted Character_BumbleBee.fbx to bumblebee.glb
   - File size: 195KB (includes animations)
   - Conversion warnings about transform inheritance (acceptable)
4. Discovered shared texture atlas system
   - Found `Nature_Texture.png` in Textures folder
   - ALL animals share one 21KB texture file
   - Each model has UV coordinates pointing to different texture regions
5. Loaded bumblebee into scene
   - Initial problem: Model invisible (too small at scale 1)
   - Discovered models are ~1cm tall (0.011 units)
   - Solution: Scale 50x to make visible
6. Applied proper texturing
   - Initially grey because texture wasn't applied
   - Loaded Nature_Texture.png with TextureLoader
   - Critical settings: `flipY = false`, `colorSpace = SRGBColorSpace`
   - Traversed model to apply material to all meshes
   - Result: Proper yellow/black bee stripes visible!
7. Positioned bumblebee hovering at (-2, 1.5, 0)
8. Updated ASSETS.md with complete documentation

**Learnings**:
- FBX to GLB conversion requires `--binary` flag for single-file output
- GLTF (text) format had issues, GLB (binary) works perfectly
- Texture atlas technique: one image for all animals, very efficient
- UV mapping allows different models to use different regions of same texture
- These models are Unity-scaled (centimeters), need massive scale-up (50x)
- GLTF textures don't flip Y (unlike some other formats)
- Need to set proper color space (SRGB) for textures
- Models include animations (1 animation per model)
- Can reuse same texture/material for all animals from this pack

**Decisions**:
- Convert to GLB instead of GLTF for reliability
- Store shared texture once in public/models/
- Scale all animals 50x as baseline (adjust per animal as needed)
- Create reusable material with shared texture
- Use traverse() to apply material to all mesh children
- Position bee hovering in air (height 1.5) since bees fly

**Challenges**:
- Initial GLTF conversion failed - learned GLB is more reliable
- Model invisible at first - learned to check bounding box size
- Grey model - discovered need for shared texture file
- Had to experiment with texture settings (flipY, colorSpace)
- Bumblebee overlapped with red box initially - moved position

**Test Results**: ✅ All tests passing (29 tests - no new tests for animals yet)

**Time**: ~45 minutes (exploration, conversion, debugging, documentation)

**Next**: Phase 4.3 - Model Management (or convert more animals!)

---

### Animation System Setup (Bonus Feature)

**Goal**: Enable animations for loaded GLTF models

**Actions Taken**:
1. Created global `mixers` array to track all AnimationMixers
2. Set up AnimationMixer for bumblebee in model load callback
   - Check if model has animations
   - Create mixer for the model
   - Get first animation clip and create action
   - Play the action (starts animation)
3. Added THREE.Clock for delta time calculation
4. Updated render loop to update all mixers every frame
   - Call `mixer.update(delta)` for smooth time-based animation
   - Delta time ensures consistent animation speed regardless of frame rate

**Learnings**:
- AnimationMixer controls animation playback for a model
- AnimationAction represents a specific animation clip being played
- Must update mixer every frame with delta time for animations to play
- Clock.getDelta() provides time since last frame for smooth animation
- Can store multiple mixers in array to animate many models
- Animations are baked into GLTF/GLB files during conversion

**Decisions**:
- Use array of mixers to support multiple animated models
- Auto-play first animation when model loads (can make configurable later)
- Use delta time for frame-rate independent animation
- Log animation name to console for debugging

**Test Results**: ✅ All tests passing (29 tests - no animation tests yet)

**Time**: ~10 minutes

**Next**: Add more animals, then Phase 4.3 - Model Management

---

### Added Frog Model

**Goal**: Add second animated animal to scene

**Actions Taken**:
1. Converted Character_Frog.fbx to frog.glb using fbx2gltf --binary
   - 212KB file with animation (345 frames)
   - Same conversion warnings as bumblebee (acceptable)
2. Loaded frog at position (1, 0, -1) on ground
3. Applied shared Nature_Texture.png (same texture atlas as bumblebee)
4. Set up animation system (reused existing mixer array)
5. Discovered frog needed 150x scale (3x larger than bumblebee)
   - Different animals have different native sizes
   - Frog is even tinier than bumblebee in original model

**Learnings**:
- Each animal model has different scale requirements
- Frog needed 150x vs bumblebee's 50x
- Animation system works perfectly for multiple models
- Shared texture atlas automatically shows correct colors per animal
- Same code pattern works for all animals from this pack

**Decisions**:
- Position frog on ground (y=0) since frogs sit/hop
- Scale 150x for good visibility
- Reuse same material/texture setup as bumblebee

**Test Results**: ✅ All tests passing (29 tests)

**Time**: ~5 minutes

**Next**: Phase 4.3 - Model Management
