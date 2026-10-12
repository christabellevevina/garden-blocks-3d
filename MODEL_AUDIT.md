# Garden Blocks — source-model audit

## Evidence and hierarchy

The uploaded archive contains **nine GLB files**, not a single combined model:

```
Garden Blocks
├── Building A
│   ├── Floor      ← BUILDING A/Floor.glb
│   ├── Interior   ← BUILDING A/Interior.glb
│   ├── Roof       ← BUILDING A/Roof.glb
│   └── Walls      ← BUILDING A/Walls.glb
├── Building B
│   ├── Floor      ← BUILDING B/Floor.glb
│   ├── Interior   ← BUILDING B/Interior.glb
│   ├── Roof       ← BUILDING B/Roof.glb
│   └── Walls      ← BUILDING B/Walls.glb
└── Landscape
    └── Site geometry ← Landscape.glb
```

Building membership and the four layer categories above are based on the **ZIP directory and GLB filenames**, not guesses based on mesh names. The imported glTF internals generally use `Assembly-33`, `Assembly-34`, `Geom3D`, `Geom3D_`, `Component_1`, and unnamed nodes. `Active View` is a camera/export helper, not a building. Roof and wall files contain many empty transform/helper nodes. The files contain very few actual mesh objects compared with node counts; most geometry is batched by material. Thus doors, windows, columns, and individual wall segments **cannot be reliably isolated or classified** from the current GLBs.

### Geometry and materials

| Source | glTF nodes | glTF mesh definitions | Materials |
|---|---:|---:|---|
| Building A / Floor | 63 | 1 | Brick_09_1K |
| Building A / Interior | 10 | 2 | Plaster_02_1K, * |
| Building A / Roof | 63 | 1 | Concrete_02_1K |
| Building A / Walls | 63 | 3 | Brick_09_1K, Glass_Safety_01, Metal_06_1K |
| Building B / Floor | 63 | 1 | Brick_09_1K |
| Building B / Interior | 63 | 15 | [Metal_Corrogated_Shiny]2 |
| Building B / Roof | 65 | 1 | Asphalt_06_1K |
| Building B / Walls | 63 | 4 | Brick_09_1K, Glass_Safety_01, Metal_06_1K |
| Landscape | 71 | 4 | Soil_04_1K |

The GLBs use `KHR_materials_pbrSpecularGlossiness`, an older glTF extension. GLTFLoader support should be checked with the exact Three.js version; texture/PBR fidelity must be visually verified against the original authoring application. Material names are not sufficient to infer architectural function.

## Integration behavior

- Loads all nine original GLBs without altering their geometry, texture image data, or relative file coordinates.
- Creates an explicit, selectable building/layer hierarchy from the archive provenance.
- Applies one common millimetre-to-metre scale and Z-up-to-Y-up orientation, then centers the full site. This preserves the original **relative spatial arrangement**; verify units and up-axis against the authoring file before production release.
- Frames each mapped building and layer using computed Three.js world bounds.
- Supports per-building roof lifting when a building is entered; with no building entered, the global roof control lifts both roof layers.
- Maps materials using the imported glTF materials; edits affect meshes sharing that material object, which may span more than one layer.
- Uses material overrides for clay/X-ray/blueprint and local clipping planes for sections.

## Current limitations / required source corrections

1. **Individual doors/windows/columns cannot be selected as semantic objects.** Re-export with separate named groups/components and non-merged mesh primitives for each selectable architectural element.
2. **Some layers contain batched geometry.** If an entire floor/wall/roof is one mesh, only the whole layer is independently selectable. Preserve per-element groups in SketchUp/Blender before export.
3. **Source scene node names are ambiguous and repetitive.** In SketchUp, use named groups/components (`Building_A > Walls > Wall_01`, `Building_A > Windows > Window_01`); in Blender, use parent empties/collections and stable object names, and export the hierarchy.
4. **Shared material names are not semantic classifications.** Give materials unique, descriptive identifiers; separate glass, metal frames, masonry, flooring and roofing where independent edits are required.
5. **Coordinate system and units require confirmation.** The project assumes millimetres and Z-up based on the exported transforms. If the authoring system uses different units, adjust the single conversion in `src/core/garden.js`.
6. **This release is not browser-verified.** Build/install and visual QA, including texture and section accuracy, must be completed in the target browser/GPU.
7. **Technical camera presets are still perspective approximations**, not true orthographic cameras. Blueprint is wireframe, not silhouette/hidden-line technical drafting.
8. **Roof animation uses source category grouping**, not actual roof-face semantics. Lift height is a heuristic based on the imported roof layer's bounds.
9. **No invented metadata.** Building descriptions, architect, location and dates remain editable placeholders in `src/config/project.js`.

## Replacing the model

Place new GLBs under `public/models/garden/` and update `src/core/garden.js` manifest. Keep all parts in a consistent shared coordinate system and export with transforms applied consistently. For a different number of buildings or layers, update manifest entries and metadata. `src/core/model.js` uses explicit mapped groups; it intentionally does **not** infer component classes from arbitrary imported node names.
