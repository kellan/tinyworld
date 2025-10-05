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
