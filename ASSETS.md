# Asset Conversion & Management Notes

## Current Assets

### Animated Low Poly Animals
**Location**: `Animated_Low_Poly/Animated Low Poly Animals/`
**Format**: FBX (Unity package)
**Models Available**:
- Character_Frog.fbx
- Character_Fish.fbx
- Character_BumbleBee.fbx
- Character_Butterfly.fbx
- Character_Turtle.fbx
- Character_Skipper.fbx
- Character_Firefly.fbx
- Character_Bird.fbx
- Character_Finch.fbx

**Includes**:
- Meshes (FBX files)
- Textures (PNG)
- Animations (Unity Animator controllers)
- Materials (Unity .mat files)

---

## Converting FBX to GLTF/GLB for Three.js

### Option 1: Blender (Most Control)
**Best for**: Tweaking models, adjusting scale, optimizing, quality control

**Steps**:
1. Download Blender (free): https://www.blender.org/download/
2. Open Blender → File → Import → FBX (.fbx)
3. Select your animal FBX file
4. Optional tweaks:
   - Check scale (might need to resize)
   - Check if animations imported
   - Apply textures if needed
5. File → Export → glTF 2.0 (.glb/.gltf)
6. Export settings:
   - **Format**: GLB (binary, single file - easier)
   - **Include**: Selected Objects
   - **Transform**: +Y Up
   - **Animation**: Include if you want them
7. Save to `public/models/`

**Tips**:
- GLB = single binary file (easier to work with)
- GLTF = separate files for model/textures (more flexibility)
- For this project, use GLB

---

### Option 2: Online Converter (Fastest)
**Best for**: Quick testing, no software install

**Recommended Services**:
1. **Aspose** (reliable, free): https://products.aspose.app/3d/conversion/fbx-to-gltf
   - Upload FBX
   - Download GLTF/GLB
   - No account needed

2. **AnyConv**: https://anyconv.com/fbx-to-gltf-converter/
   - Simple drag & drop
   - Fast conversion

**Steps**:
1. Go to converter website
2. Upload `Character_Frog.fbx` (or any animal)
3. Select GLB as output format
4. Download converted file
5. Rename to something simple: `frog.glb`
6. Move to `public/models/frog.glb`
7. Load in code: `loadModel('/models/frog.glb')`

**Gotchas**:
- May lose some materials/textures
- Scale might be off (adjust in code)
- Animations might not transfer perfectly

---

### Option 3: Command Line (fbx2gltf)
**Best for**: Batch conversion, automation

**Installation**:
```bash
npm install -g fbx2gltf
```

**✅ CONFIRMED WORKING ON THIS MACHINE**:
```bash
cd "Animated_Low_Poly/Animated Low Poly Animals/Meshes"

# Single file conversion (confirmed working)
/opt/homebrew/lib/node_modules/fbx2gltf/bin/Darwin/FBX2glTF Character_BumbleBee.fbx

# This creates Character_BumbleBee.gltf in the same directory
# Move to public/models/ and optionally rename:
mv Character_BumbleBee.gltf ../../../public/models/bumblebee.gltf
```

**Batch convert all animals**:
```bash
cd "Animated_Low_Poly/Animated Low Poly Animals/Meshes"

for file in Character_*.fbx; do
  echo "Converting $file..."
  /opt/homebrew/lib/node_modules/fbx2gltf/bin/Darwin/FBX2glTF "$file"
done

# Then move all GLTF files to public/models/
mv *.gltf ../../../public/models/
```

**Note**: The direct path to the binary (`/opt/homebrew/lib/node_modules/fbx2gltf/bin/Darwin/FBX2glTF`) works when the npm global command doesn't resolve properly.

---

## Using Converted Models

Once you have GLB files in `public/models/`:

```typescript
// Load a frog
loadModel('/models/frog.glb', (gltf) => {
  gltf.scene.position.set(2, 0, 2)
  gltf.scene.scale.set(0.5, 0.5, 0.5) // Adjust as needed
})

// Load a butterfly
loadModel('/models/butterfly.glb', (gltf) => {
  gltf.scene.position.set(-2, 1, -2)
  gltf.scene.scale.set(0.3, 0.3, 0.3)
})
```

---

## Recommended Animals for Diorama

**Good starter set**:
1. **Frog** - sits on ground, whimsical
2. **Butterfly** - can position in air
3. **Bird** - perched or flying
4. **Fish** - if you add water feature later

**Phase 4.3+**: Create helper utilities for model management
- Auto-position on ground
- Collision detection
- Animation playback

---

## Playing Animations

If models include animations:

```typescript
loadModel('/models/frog.glb', (gltf) => {
  const mixer = new THREE.AnimationMixer(gltf.scene)

  if (gltf.animations.length > 0) {
    const action = mixer.clipAction(gltf.animations[0])
    action.play()
  }

  // In render loop:
  // mixer.update(deltaTime)
})
```

**Note**: We'll add animation support in a future phase!

---

## Next Steps

1. Try converting 1-2 animals with preferred method
2. Test loading in scene
3. Adjust scale/position as needed
4. Add more animals once workflow is smooth
5. Consider adding animation support (Phase 5+)
