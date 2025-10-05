# Whimsical Isometric World-Builder - Project Plan

## Project Overview
Building a whimsical isometric world-builder with Three.js and TypeScript, using TDD and small iterative steps (15-30 min each).

**Starting Point**: Working "Hello World" with green cube  
**End Goal**: Orthographic isometric scene with GLTF models, toon shading, and outlines

---

## Phase 0: Foundation Setup (Current State → Testing Ready)

### 0.1 - Vitest Setup (15 min)
- Install Vitest and @vitest/ui
- Create basic vitest.config.ts
- Add test script to package.json
- **Test**: Write one passing test (e.g., `1 + 1 = 2`)
- **Success Criteria**: `npm run test` passes

### 0.2 - Three.js Test Utilities (20 min)
- Create test helper for headless Three.js setup
- Mock WebGL context for tests
- **Test**: Instantiate a Scene and verify it exists
- **Success Criteria**: Can test Three.js objects without browser

---

## Phase 1: Camera Transformation (Cube → Isometric View)

### 1.1 - Switch to Orthographic Camera (20 min)
- **Red**: Write test for orthographic camera properties (left, right, top, bottom)
- **Green**: Replace PerspectiveCamera with OrthographicCamera
- Keep existing cube visible
- **Success Criteria**: Cube renders with no perspective distortion

### 1.2 - Set Isometric Angle (15 min)
- **Red**: Test camera position (x, y, z) for isometric angle
- **Green**: Position camera at 45° horizontal, ~35° vertical
- Adjust camera lookAt to center
- **Success Criteria**: Classic isometric viewing angle

### 1.2a - Small Flat World (20 min)
- **Red**: Test scene contains ground plane and multiple static objects
- **Green**: Remove rotating cube, add flat ground plane
- Add 3-4 simple objects (cubes/boxes) at different positions on ground
- Remove OrbitControls (we'll add our own controls later)
- **Success Criteria**: Static isometric scene with multiple objects visible

### 1.3 - Adjust Orthographic Frustum (20 min)
- **Red**: Test aspect ratio handling for orthographic camera
- **Green**: Calculate proper frustum based on canvas size
- Handle window resize
- **Success Criteria**: Scene maintains proportions on resize

---

## Phase 2: Basic Camera Controls (Static → Interactive)

### 2.1 - Pan Controls - Horizontal (25 min)
- **Red**: Test camera position changes on keyboard input (A/D or arrows)
- **Green**: Implement left/right panning
- Update camera position, maintain lookAt offset
- **Success Criteria**: Camera pans left/right, cube stays in view

### 2.2 - Pan Controls - Vertical (20 min)
- **Red**: Test camera position changes on vertical input (W/S)
- **Green**: Implement up/down panning
- **Success Criteria**: Full 2D panning works

### 2.3 - Zoom Controls (25 min)
- **Red**: Test orthographic zoom (adjusting frustum size)
- **Green**: Implement zoom in/out (mouse wheel or keys)
- Clamp min/max zoom levels
- **Success Criteria**: Smooth zoom without distortion

### 2.4 - Camera Bounds (20 min)
- **Red**: Test camera position clamping
- **Green**: Prevent camera from going too far from origin
- **Success Criteria**: Can't pan infinitely away

---

## Phase 3: Scene Foundation (Single Cube → Multi-Object Scene)

### 3.1 - Ground Plane (20 min)
- **Red**: Test ground plane exists with correct size and position
- **Green**: Add PlaneGeometry as ground
- Position at y=0, rotate to horizontal
- Use different color than cube
- **Success Criteria**: Visible ground plane under cube

### 3.2 - Grid Helper (15 min)
- **Red**: Test GridHelper exists with correct divisions
- **Green**: Add visible grid overlay on ground
- **Success Criteria**: Grid helps visualize space

### 3.3 - Multiple Objects (25 min)
- **Red**: Test scene contains multiple objects with different positions
- **Green**: Add 3-4 primitive shapes (cube, sphere, cylinder) at different positions
- **Success Criteria**: Small "scene" with variety

### 3.4 - Basic Lighting (20 min)
- **Red**: Test DirectionalLight and AmbientLight exist with correct properties
- **Green**: Replace default lighting with proper setup
- Add ambient + one directional light
- **Success Criteria**: Objects have visible shading

---

## Phase 4: GLTF Loading System (Primitives → Models)

### 4.1 - GLTFLoader Setup (20 min)
- **Red**: Test GLTFLoader can be instantiated
- **Green**: Install and import GLTFLoader
- Create loader utility function
- **Success Criteria**: Loader exists (no model yet)

### 4.2 - Load First GLTF (30 min)
- **Red**: Test async model loading and scene addition
- **Green**: Load a simple GLTF model (free asset or export a cube)
- Add to scene on load
- Handle loading states
- **Success Criteria**: GLTF model visible in scene

### 4.3 - Model Management (25 min)
- **Red**: Test model positioning and scaling
- **Green**: Create utility to position/scale loaded models
- Replace one primitive with GLTF equivalent
- **Success Criteria**: Can place models like primitives

### 4.4 - Multiple GLTF Models (20 min)
- **Red**: Test loading multiple different models
- **Green**: Load 2-3 different GLTF models
- **Success Criteria**: Scene with mixed GLTF content

---

## Phase 5: Post-Processing Pipeline (Flat → Enhanced Rendering)

### 5.1 - EffectComposer Setup (25 min)
- **Red**: Test EffectComposer exists and renders
- **Green**: Install postprocessing dependencies
- Set up EffectComposer with RenderPass
- **Success Criteria**: Scene renders through composer (looks identical)

### 5.2 - Render Pass Configuration (15 min)
- **Red**: Test render pass outputs to screen
- **Green**: Verify composer renders correctly
- Handle resize
- **Success Criteria**: No visual regression

---

## Phase 6: Toon Shading (Realistic → Stylized)

### 6.1 - Simple Toon Material (25 min)
- **Red**: Test MeshToonMaterial properties
- **Green**: Replace one object's material with MeshToonMaterial
- Use Three.js built-in toon material
- **Success Criteria**: One object has cel-shaded look

### 6.2 - Custom Gradient Map (30 min)
- **Red**: Test custom gradient texture creation
- **Green**: Create 2-3 band gradient texture
- Apply to toon materials
- **Success Criteria**: Controlled color banding

### 6.3 - Apply to All Objects (20 min)
- **Red**: Test all objects use toon materials
- **Green**: Convert scene objects to toon materials
- Ensure GLTF models work with toon shading
- **Success Criteria**: Consistent stylized look

---

## Phase 7: Outline Shader (Toon → Toon + Outlines)

### 7.1 - Outline Post-Process (30 min)
- **Red**: Test outline pass exists in composer
- **Green**: Add OutlinePass to EffectComposer
- Configure for all objects
- **Success Criteria**: Black outlines visible

### 7.2 - Outline Customization (20 min)
- **Red**: Test outline thickness and color parameters
- **Green**: Tune outline appearance for aesthetic
- Adjust edge strength, thickness, color
- **Success Criteria**: Outlines match whimsical style

### 7.3 - Selective Outlines (25 min)
- **Red**: Test outline selection by object
- **Green**: Make outlines work per-object or layer
- **Success Criteria**: Control over what gets outlined

---

## Phase 8: Polish & Optimization

### 8.1 - Performance Monitoring (20 min)
- **Red**: Test FPS counter integration
- **Green**: Add Stats.js or similar
- **Success Criteria**: Can see render performance

### 8.2 - Scene Organization (25 min)
- **Red**: Test scene hierarchy with groups
- **Green**: Organize objects into logical groups
- **Success Criteria**: Clean scene structure

### 8.3 - Asset Loading Manager (30 min)
- **Red**: Test LoadingManager tracks progress
- **Green**: Implement loading screen/progress
- **Success Criteria**: User feedback during load

---

## Estimated Total Time
- **Phase 0**: 35 min
- **Phase 1**: 55 min
- **Phase 2**: 90 min
- **Phase 3**: 80 min
- **Phase 4**: 95 min
- **Phase 5**: 40 min
- **Phase 6**: 75 min
- **Phase 7**: 75 min
- **Phase 8**: 75 min

**Total: ~10.5 hours** of focused development time

---

## Success Metrics
- ✅ Each phase has passing tests before moving forward
- ✅ Application runs after each phase
- ✅ No phase takes longer than 30 minutes
- ✅ Every change is small and understandable
- ✅ Build never breaks for more than one phase

---

## Next Steps
Ready to begin **Phase 0.1: Vitest Setup**?
- remember to keep LOG.md up to date