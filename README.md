# ATELIER — Architectural Explorer

React + Vite + React Three Fiber + Drei + Three.js + Tailwind CSS.

## Run

```bash
npm install
npm run dev
```

Open the URL printed by Vite. `npm run build` creates production assets in `dist/`.

## Import models

Click **Import GLB** and select a self-contained `.glb` file. Binary GLB is recommended because embedded textures and geometry can be imported from a single local file. `.gltf` is accepted only when it has no external resource dependencies (e.g. embedded data URIs). An architectural sample is generated procedurally on first load, so the viewer works before import.

Prepare named scene groups in Blender, SketchUp export pipelines, or other 3D authoring software. The hierarchy is inferred from named nodes. For example:

```
Site
  North Pavilion
    Structure
      Walls
      Glazing
    Roof
    Interior
      Furniture
  South Pavilion
    Structure
    Roof
```

Root-level named nodes become explorer entries; descendants become nested components. Any named mesh matching `roof|canopy|atap` is eligible for roof lift/opacity. Prefer **separate roof meshes** with their own pivot and avoid merging roofs with walls. Enter Building acts on the selected hierarchy node; for useful isolation, buildings must be separate groups. Labels attach to root-level named groups. Metadata in `src/config/project.js` is keyed by node name or hierarchy path. If names are duplicated, prefer unique names (or extend the metadata mapping by full path). Imported GLBs should have correctly oriented geometry, sensible units (meters recommended), valid normals, and PBR materials.

## Architecture

- `src/App.jsx`: viewer composition, interaction state, controls, import/export.
- `src/core/model.js`: hierarchy analysis and geometry bounds.
- `src/core/demo.js`: replaceable sample model.
- `src/core/scene.js`: camera presets and lighting configurations.
- `src/config/project.js`: editable project metadata and roof detection rules.
- `src/style.css`: Tailwind layers and panel styles.

## Functionality and limitations

- Orbit, pan, zoom, damping, automatic rotation and camera framing use Drei OrbitControls and Three.js camera transforms.
- Technical views use a narrow perspective field of view as an approximation; **true orthographic camera switching is not yet implemented**.
- Click-to-select, hierarchical tree, contextual panels, selection dimming, building entry/exit, and HTML labels are functional. Selection dimming is shader-material based and therefore costs draw calls on large models.
- Roof lift animates identified named roof meshes. Nested roofs are controlled according to their hierarchy. Opacity changes apply to named roof meshes.
- Realistic, clay, X-ray and wireframe blueprint modes use different Three.js materials. Blueprint is wireframe rather than CAD edge extraction.
- Three simultaneous Three.js local clipping planes can be enabled and reversed. Slider range is -30 to 30 model units; adjust to suit your model scale.
- Material editing modifies source materials in memory. GLB export preserves those supported material changes. Original material values can be restored.
- Lighting presets adjust directional light and ambient brightness; color is adjustable. Arbitrary 3D direction sliders and image-based HDR environments are not included.
- GLB export does not bake temporary viewer effects (clipping, clay/X-ray, selection tint, roof animation) into the output.
- Large models benefit from geometry simplification, texture compression, instancing, and reduced mesh count before import. Draco and KTX2 decoding are not configured.

## Known caveats

This is an interactive functional starter, **not a fully validated production release**. Source changes should be built and browser-tested in the target environment. In particular, large assets, animated/skinned glTFs, material variants, and unusual coordinate systems need additional handling. Local `.gltf` with external `.bin`/texture files is not supported; package as `.glb`.
