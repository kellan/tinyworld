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

## ✅ WORKING: Animated Low Poly Animals Setup

### What We Learned

**The animals use a shared texture atlas!**
- All animals share **ONE texture file**: `Nature_Texture.png` (21KB)
- Each animal has UV coordinates pointing to different regions of this texture
- This is why the bumblebee shows yellow/black stripes even though we just applied a generic material

**Texture Atlas Technique**:
- Single image contains colors for ALL 9 animals
- Very efficient (one texture in memory vs 9 separate ones)
- Common in Unity/game development for performance
- Each model's UV map "knows" which part of the texture to use

### Confirmed Working Conversion Process

1. **Convert FBX to GLB** (binary format):
   ```bash
   cd "Animated_Low_Poly/Animated Low Poly Animals/Meshes"
   /opt/homebrew/lib/node_modules/fbx2gltf/bin/Darwin/FBX2glTF Character_BumbleBee.fbx --binary
   ```

2. **Move files to public**:
   ```bash
   mv Character_BumbleBee.glb ../../../public/models/bumblebee.glb
   ```

3. **Copy the shared texture** (only need to do this once):
   ```bash
   cp "../Textures/Nature_Texture.png" ../../../public/models/
   ```

### Loading Animals in Code

**Important**: These models are TINY (1-2 cm). Need to scale 50x minimum!

```typescript
// Load the shared texture ONCE (outside model loading)
const textureLoader = new THREE.TextureLoader()
const animalTexture = textureLoader.load('/models/Nature_Texture.png')
animalTexture.flipY = false // GLTF textures don't flip Y
animalTexture.colorSpace = THREE.SRGBColorSpace

// Load bumblebee
loadModel('/models/bumblebee.glb', (gltf) => {
  gltf.scene.position.set(-2, 1.5, 0)
  gltf.scene.scale.set(50, 50, 50)  // CRITICAL: Models are 1cm tall!

  // Apply the shared texture to all meshes
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
})
```

### Scale Reference (tested with bumblebee)
- **Original size**: 0.011 units tall (~1 centimeter)
- **Good scale**: 50x (makes it ~0.5 units tall)
- **Adjust per animal** - fish might need different scale than butterfly

### Gotchas & Solutions

❌ **Problem**: Loading GLTF (text format) fails with "Invalid typed array length"
✅ **Solution**: Use `--binary` flag to create GLB instead

❌ **Problem**: Model loads but is invisible
✅ **Solution**: Models are microscopic! Scale up 50-100x

❌ **Problem**: Model is grey/untextured
✅ **Solution**: Apply `Nature_Texture.png` with proper settings (flipY = false)

❌ **Problem**: Texture looks wrong/stretched
✅ **Solution**: Set `colorSpace = THREE.SRGBColorSpace` on texture

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
