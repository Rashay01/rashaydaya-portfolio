# Monolith Glass Reference Match — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the MonolithScene WebGL block from a pale rounded soap-bar (Image #2) into a thick architectural float-glass slab (Image #3) — visible right-edge thickness, frosted face, hard chamfered corners, strong green floor caustic, controlled Fresnel rim, on a near-black background.

**Architecture:** All changes are confined to `src/components/three/MonolithScene.tsx`. No new files. Seven focused parameter groups are changed in sequence — each with a visual checkpoint — so regressions are caught immediately. The impeccable audit is re-run after the final step to confirm no WCAG or anti-pattern regressions.

**Tech Stack:** Three.js (vanilla), `RoundedBoxGeometry`, `MeshPhysicalMaterial`, `EffectComposer` + `UnrealBloomPass`, custom Fresnel `ShaderMaterial`, `DataTexture` env map, `CanvasTexture` floor glow.

---

## Reference Image Dissection

Before touching code, understand exactly what makes Image #3 look the way it does. Every parameter change below maps to one of these observations.

| Feature | What you see | What drives it |
|---|---|---|
| Near-black background | Dark ~#0c0e0b behind the slab | CSS `#111418` + dark tonemapping |
| Right-side bright strip | Brilliant white-green slab edge, ~15% of total width | Camera 3/4 angle + strong right rim light hitting the thickness face |
| Frosted face | Milky semi-opaque center, not clear glass | High `roughness` + `transmission` < 0.92 |
| Hard chamfered corners | Angular bevel, not soft curve | `RoundedBoxGeometry` radius ≤ 0.030 with fewer segments |
| Green tint on deep edges | The far-left edge and top bevel glow green | `attenuationColor` + short `attenuationDistance` — light travelling through more material picks up more green |
| Floor caustic pool | Bright oval green glow under the slab, fading to nothing | Large additive `PlaneGeometry` with canvas radial gradient + strong under-point-light |
| Fresnel rim | Thin white-green halo at all edges | Additive Fresnel `ShaderMaterial` overlay |
| No left rim blow-out | Left side is subdued, slab "sits in darkness" | Left rim light intensity reduced vs. current |

---

## File Map

| File | Change type | What changes |
|---|---|---|
| `src/components/three/MonolithScene.tsx` | Modify | All 7 task groups below |

No other files touch.

---

## Dev Server Command

```bash
npm run dev
```

Open `http://localhost:3000`. The monolith renders in the hero section. Use browser DevTools → Inspect → force `prefers-reduced-motion: no preference` if testing motion guards.

---

## Task 1: Camera position and slab base rotation

**Goal:** Get the 3/4 viewing angle that shows the right-side thickness edge.

In Image #2 the slab faces almost straight-on (`rotation.y = 0.26` ≈ 15°). In Image #3 the right face occupies ~15-18% of total visible width — that requires ~30-32° rotation.

**File:** `src/components/three/MonolithScene.tsx`

- [ ] **Step 1: Locate the camera and slabGroup rotation lines**

  These three lines are the target:
  ```
  camera.position.set(-0.28, 0.55, 5.8)     // line ~60
  camera.lookAt(0.08, -0.10, 0)              // line ~61
  slabGroup.rotation.y = 0.26               // line ~127 (static init)
  slabGroup.rotation.y = 0.26 + Math.sin(t * 0.40) * 0.018  // line ~248 (animation tick)
  ```

- [ ] **Step 2: Update camera position and lookAt**

  Replace:
  ```ts
  const camera = new THREE.PerspectiveCamera(26, W / H, 0.1, 50)
  camera.position.set(-0.28, 0.55, 5.8)
  camera.lookAt(0.08, -0.10, 0)
  ```
  With:
  ```ts
  const camera = new THREE.PerspectiveCamera(24, W / H, 0.1, 50)
  camera.position.set(-0.10, 0.40, 5.7)
  camera.lookAt(0.12, -0.08, 0)
  ```
  Rationale: Narrower FOV (24°) reduces distortion. Slight rightward shift brings the left face more into view while keeping the composition centered.

- [ ] **Step 3: Update slab base rotation (static init)**

  Replace:
  ```ts
  slabGroup.rotation.y = 0.26   // ~15° — shows front face, slight right-side sliver
  ```
  With:
  ```ts
  slabGroup.rotation.y = 0.52   // ~30° — shows right thickness edge prominently
  ```

- [ ] **Step 4: Update slab rotation in animation tick**

  Replace:
  ```ts
  slabGroup.rotation.y = 0.26 + Math.sin(t * 0.40) * 0.018
  ```
  With:
  ```ts
  slabGroup.rotation.y = 0.52 + Math.sin(t * 0.40) * 0.012
  ```
  (Tighter animation range — 0.012 instead of 0.018 — so the rotation doesn't swing enough to hide the thickness edge at any point.)

- [ ] **Step 5: Visual checkpoint**

  Run `npm run dev`. The slab should now show a visible right-side strip (the glass thickness). If the right strip is thinner than ~12% of total width, increase `rotation.y` base to `0.56`. If the front face disappears entirely, reduce to `0.46`.

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/three/MonolithScene.tsx
  git commit -m "feat(monolith): adjust camera and slab rotation to show thickness edge"
  ```

---

## Task 2: Geometry — hard chamfer, correct proportions

**Goal:** Tight architectural bevel at corners (not a soap-bar curve), correct slab proportions.

In Image #3 the corners are clearly beveled but the radius is tight — like 5–6mm on a real 40mm thick pane. With our slab depth of 0.46 units, that is `radius ≈ 0.030`. Fewer geometry segments = harder edge catch for the rim light.

**File:** `src/components/three/MonolithScene.tsx`

- [ ] **Step 1: Locate the RoundedBoxGeometry calls**

  Two calls — the main slab and the inner glow shell:
  ```ts
  const geo = new RoundedBoxGeometry(0.84, 2.26, 0.46, 8, 0.022)    // line ~132
  const innerGeo = new RoundedBoxGeometry(0.78, 2.20, 0.40, 4, 0.015)  // line ~153
  ```

- [ ] **Step 2: Update geometry params**

  Replace:
  ```ts
  const geo = new RoundedBoxGeometry(0.84, 2.26, 0.46, 8, 0.022)
  ```
  With:
  ```ts
  const geo = new RoundedBoxGeometry(0.85, 2.28, 0.48, 4, 0.030)
  ```
  - Width `0.85` — fractionally wider for the 2:1 face proportion in the reference
  - Depth `0.48` — slightly thicker (makes the right-edge strip slightly more visible)
  - Segments `4` down from `8` — creates a harder bevel edge that catches the rim light as a distinct line rather than a smooth curve
  - Radius `0.030` — the chamfer is visible but not rounded

  Replace inner shell (same proportional scaling):
  ```ts
  const innerGeo = new RoundedBoxGeometry(0.78, 2.20, 0.40, 4, 0.015)
  ```
  With:
  ```ts
  const innerGeo = new RoundedBoxGeometry(0.79, 2.22, 0.42, 4, 0.018)
  ```

- [ ] **Step 3: Visual checkpoint**

  The corner edges should now catch the rim light as a thin distinct stripe rather than a diffuse curve. The right-edge strip should be slightly wider. If the corners look too jagged (visible triangle facets), increase segments to `6`.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/three/MonolithScene.tsx
  git commit -m "feat(monolith): tighter geometry bevel for architectural glass look"
  ```

---

## Task 3: Glass material — frosted transmissive with green attenuation

**Goal:** The face reads as frosted architectural glass (milky, semi-opaque, subtle green tint) rather than clear transparent glass.

In Image #3 the front face is frosted: you cannot see through it clearly. The green tint comes from light travelling through the glass mass, not from a surface color. The edges glow green because light travels the furthest distance through the material there.

**File:** `src/components/three/MonolithScene.tsx`

- [ ] **Step 1: Locate the MeshPhysicalMaterial block**

  ```ts
  const mat = new THREE.MeshPhysicalMaterial({
    color:               new THREE.Color(0xbcd8c5),
    transmission:        0.96,
    thickness:           3.0,
    roughness:           0.44,
    roughnessMap:        roughnessTex,
    metalness:           0.0,
    ior:                 1.48,
    attenuationColor:    new THREE.Color(0x68ff9a),
    attenuationDistance: 2.8,
    clearcoat:           0.55,
    clearcoatRoughness:  0.22,
    envMapIntensity:     3.8,
    side:                THREE.FrontSide,
  })
  ```

- [ ] **Step 2: Replace with reference-matched values**

  ```ts
  const mat = new THREE.MeshPhysicalMaterial({
    color:               new THREE.Color(0xcce0d4),  // neutral mint — face reads light not saturated
    transmission:        0.88,                        // less transparent → more frosted/milky
    thickness:           5.0,                         // thicker optical path → stronger green on deep edges
    roughness:           0.50,                        // frosted surface scatters more
    roughnessMap:        roughnessTex,
    metalness:           0.0,
    ior:                 1.52,                        // real glass IOR
    attenuationColor:    new THREE.Color(0x3dcc70),  // deeper green — more colour on thick paths
    attenuationDistance: 2.0,                         // short path = heavy tint on edges
    clearcoat:           0.85,                        // higher clearcoat → sharp bevel reflections
    clearcoatRoughness:  0.12,                        // near-polished clearcoat → crisp edge catch
    envMapIntensity:     4.2,
    side:                THREE.FrontSide,
  })
  ```

  Key changes explained:
  - `transmission 0.96 → 0.88`: The face should look milky/frosted, not clear. 0.88 still allows some transmission but the scene (dark background) means the transmitted colour reads as near-black, giving the frosted grey appearance.
  - `thickness 3.0 → 5.0`: Increases the optical path used for attenuation calculation. The edges of the slab (where light travels through the most material) pick up more green tint.
  - `attenuationDistance 2.8 → 2.0`: Shorter distance = attenuation colour appears earlier. With `thickness: 5.0` this pushes the green tint to be very visible on the right-edge face.
  - `clearcoat 0.55 → 0.85` + `clearcoatRoughness 0.22 → 0.12`: Higher, polished clearcoat is what creates the sharp bright line at the chamfered corners in the reference.

- [ ] **Step 3: Update inner glow shell opacity and colour**

  The inner shell adds luminosity seen through the frosted face. With lower transmission, it needs slightly higher opacity to still be visible:

  Replace:
  ```ts
  const innerMat = new THREE.MeshBasicMaterial({
    color:       new THREE.Color(0xc0f0d8),
    transparent: true,
    opacity:     0.11,
    side:        THREE.BackSide,
  })
  ```
  With:
  ```ts
  const innerMat = new THREE.MeshBasicMaterial({
    color:       new THREE.Color(0xd4f5e5),
    transparent: true,
    opacity:     0.14,
    side:        THREE.BackSide,
  })
  ```

- [ ] **Step 4: Visual checkpoint**

  The front face should look milky/frosted — not clear. The right-edge strip should show a green-tinged brightness. If the face looks completely opaque (no light through), reduce transmission to `0.90`. If it still looks clear/glassy, drop to `0.85`.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/three/MonolithScene.tsx
  git commit -m "feat(monolith): frosted glass material with green attenuation"
  ```

---

## Task 4: Lighting rig — right-edge dominance

**Goal:** The right-side thickness face in Image #3 is brilliant white-green — much brighter than the front face. This requires a strong right-side key light aimed squarely at the thickness edge, plus a reduced left fill so the slab "sits in shadow" on the left.

**File:** `src/components/three/MonolithScene.tsx`

- [ ] **Step 1: Locate the lighting block**

  ```ts
  const greenLight = new THREE.PointLight(0x6aff9a, 4.5, 5.0)
  greenLight.position.set(0, -1.42, 0.68)
  ...
  const rimRight = new THREE.DirectionalLight(0xdff8ec, 6.5)
  rimRight.position.set(5, 2, 3)
  ...
  const rimLeft = new THREE.DirectionalLight(0xe8fff4, 5.0)
  rimLeft.position.set(-4.5, 2.0, -2.5)
  ...
  const topLight = new THREE.DirectionalLight(0xe0f5ea, 4.0)
  topLight.position.set(0, 7, 2)
  ...
  scene.add(new THREE.AmbientLight(0xffffff, 0.05))
  ```

- [ ] **Step 2: Replace the entire lighting block**

  Remove all existing lights and replace with:
  ```ts
  // ── Lighting ──────────────────────────────────────────────────────
  // KEY: Right edge — hits the thickness face, creates the bright strip
  const rimRight = new THREE.DirectionalLight(0xf0fff8, 11.0)
  rimRight.position.set(3.8, 1.8, 0.4)     // pushed to camera-right, in front of slab
  scene.add(rimRight)

  // FILL: Left — very subdued so left side reads dark/shadow
  const rimLeft = new THREE.DirectionalLight(0xdcf5ec, 1.8)
  rimLeft.position.set(-4.5, 2.0, -1.0)
  scene.add(rimLeft)

  // TOP: Slightly right-biased top light for top-edge bevel catch
  const topLight = new THREE.DirectionalLight(0xe8f8f0, 5.5)
  topLight.position.set(0.8, 9, 1.5)
  scene.add(topLight)

  // BACK: Very faint back-fill to prevent total silhouette on far edge
  const backLight = new THREE.DirectionalLight(0xccf0e0, 0.8)
  backLight.position.set(-1.5, 0, -5)
  scene.add(backLight)

  // UNDER-GLOW: Green floor caustic — elevated intensity
  const greenLight = new THREE.PointLight(0x52ff90, 6.0, 4.5)
  greenLight.position.set(0.3, -1.35, 0.75)
  scene.add(greenLight)

  const greenDeep = new THREE.PointLight(0x2ecc66, 3.5, 6.5)
  greenDeep.position.set(0.2, -2.5, 1.2)
  scene.add(greenDeep)

  // AMBIENT: Near-zero — slab should sit in deep dark
  scene.add(new THREE.AmbientLight(0xffffff, 0.04))
  ```

  Key rationale:
  - `rimRight` at intensity `11.0` with position `(3.8, 1.8, 0.4)` — the z=0.4 brings the light slightly in front of the slab plane, ensuring it catches the near-perpendicular right thickness face. The high intensity creates the brilliant strip in the reference.
  - `rimLeft` reduced to `1.8` — left side reads mostly dark as in Image #3.
  - `topLight` shifted right (`x: 0.8`) to bias toward the top-right bevel that catches bright light in the reference.
  - `backLight` at `0.8` — ensures the far-left edge has just enough light to read as "dark glass edge" rather than pure black void.

- [ ] **Step 3: Visual checkpoint**

  The right-side thickness strip should now be noticeably brighter than the front face. If the right strip is still dim, increase `rimRight.intensity` to `13.0` or move its position to `(3.5, 1.5, 0.2)`. If the front face is completely dark (left-face too dim), nudge `rimLeft` up to `2.5`.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/three/MonolithScene.tsx
  git commit -m "feat(monolith): right-edge dominant lighting rig matching reference"
  ```

---

## Task 5: Env map — amplify right-side reflection strips

**Goal:** The procedural HDR env map drives the glass surface reflections and clearcoat. Image #3 shows a strong bright reflection from the right side and top. The current env map has balanced left and right strips.

**File:** `src/components/three/MonolithScene.tsx`

- [ ] **Step 1: Locate the HDR env map generation loop**

  ```ts
  const eW = 512, eH = 256
  const eData = new Float32Array(eW * eH * 4)
  for (let y = 0; y < eH; y++) {
    for (let x = 0; x < eW; x++) {
      const i  = (y * eW + x) * 4
      const u  = x / eW, v = y / eH
      const ov = ...
      const rr = ...
      const lr = ...
      ...
      eData[i]   = ov * 4.0 + rr * 6.0 + lr * 6.5 + bt * 0.8 + re * 5.0 + le * 5.5 + 0.01
      eData[i+1] = ov * 4.5 + rr * 7.0 + lr * 7.5 + bt * 1.5 + re * 6.0 + le * 6.5 + 0.01
      eData[i+2] = ov * 4.0 + rr * 6.5 + lr * 7.0 + bt * 1.3 + re * 5.5 + le * 6.0 + 0.01
      eData[i+3] = 1.0
    }
  }
  ```

- [ ] **Step 2: Replace the env map channel writes**

  Replace only the three `eData[i]`, `eData[i+1]`, `eData[i+2]` lines (the `const` definitions above them remain the same):
  ```ts
  // Right strip (re) amplified, left strip (lr) reduced, top overhead (ov) boosted
  eData[i]   = ov * 5.0 + rr * 9.0 + lr * 3.5 + bt * 0.8 + re * 9.0 + le * 3.0 + 0.01
  eData[i+1] = ov * 5.5 + rr * 10.0 + lr * 4.0 + bt * 1.5 + re * 10.5 + le * 3.5 + 0.01
  eData[i+2] = ov * 5.0 + rr * 9.5 + lr * 3.5 + bt * 1.3 + re * 9.5 + le * 3.0 + 0.01
  ```

  Change summary:
  - `re` (right vertical strip): `5.0/6.0/5.5` → `9.0/10.5/9.5` — 2× stronger right-side reflection
  - `le` (left vertical strip): `5.5/6.5/6.0` → `3.0/3.5/3.0` — weaker left reflection (matches shadowed left side in reference)
  - `ov` (overhead): `4.0/4.5/4.0` → `5.0/5.5/5.0` — stronger top source

- [ ] **Step 3: Visual checkpoint**

  The glass clearcoat should now show a brighter reflection patch on the right side and upper portion. This affects the specular appearance of the front face too. If the front face becomes too mirror-like (losing the frosted look), reduce `envMapIntensity` in the material from `4.2` to `3.6`.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/three/MonolithScene.tsx
  git commit -m "feat(monolith): bias env map to right-side reflections"
  ```

---

## Task 6: Floor glow — stronger caustic pool

**Goal:** In Image #3 the green glow pool at the slab base is prominent — a bright oval of pure green that fades radially. The current glow is undersized and centered.

**File:** `src/components/three/MonolithScene.tsx`

- [ ] **Step 1: Locate the glow canvas and plane**

  ```ts
  const gCanvas = document.createElement('canvas')
  gCanvas.width = gCanvas.height = 512
  ...
  gGrad.addColorStop(0.00, 'rgba(80, 240, 130, 0.62)')
  gGrad.addColorStop(0.30, 'rgba(55, 185, 100, 0.30)')
  gGrad.addColorStop(0.60, 'rgba(25, 120,  65, 0.10)')
  gGrad.addColorStop(0.85, 'rgba(8,   70,  38, 0.03)')
  gGrad.addColorStop(1.00, 'rgba(0,    0,   0, 0.00)')
  ...
  const glowGeo = new THREE.PlaneGeometry(3.0, 1.8)
  ...
  glowPlane.position.set(0.04, -1.74, 0.22)
  ```

- [ ] **Step 2: Increase glow canvas brightness and plane size**

  Replace the gradient stops:
  ```ts
  gGrad.addColorStop(0.00, 'rgba(70, 255, 130, 0.75)')
  gGrad.addColorStop(0.22, 'rgba(50, 200, 105, 0.42)')
  gGrad.addColorStop(0.45, 'rgba(22, 130,  70, 0.18)')
  gGrad.addColorStop(0.70, 'rgba(8,   65,  35, 0.06)')
  gGrad.addColorStop(1.00, 'rgba(0,    0,   0, 0.00)')
  ```

  Replace the plane geometry and position:
  ```ts
  const glowGeo = new THREE.PlaneGeometry(4.0, 2.8)
  ```

  Replace the plane position init (the static `set` before animation tick):
  ```ts
  glowPlane.position.set(0.25, -1.72, 0.30)
  ```

  (Shifted right `x: 0.25` to follow the slab's 30° rotation — the glow pool should appear directly under the rotated slab, not centered.)

- [ ] **Step 3: Update animation tick glow position**

  Replace:
  ```ts
  glowPlane.position.y = -1.74 + f * 0.3
  ```
  With:
  ```ts
  glowPlane.position.y = -1.72 + f * 0.25
  ```

- [ ] **Step 4: Visual checkpoint**

  A bright oval green pool should be clearly visible at the base of the slab. If the glow looks washed out (too large, too dim), reduce the plane to `PlaneGeometry(3.5, 2.2)`. If it's too bright and bleeds into the slab body, lower the first gradient stop opacity to `0.65`.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/three/MonolithScene.tsx
  git commit -m "feat(monolith): larger, brighter floor caustic pool"
  ```

---

## Task 7: Fresnel shader and bloom calibration

**Goal:** Fresnel should add a thin white-green halo at all edges. Bloom should be barely perceptible — it halos the brightest points (right edge, top bevel) without washing the scene.

In Image #3 the Fresnel is subtle — you see it as a slightly brighter rim on all edges but it doesn't dominate. The bloom gives the right-edge strip a very faint luminous halo.

**File:** `src/components/three/MonolithScene.tsx`

- [ ] **Step 1: Locate Fresnel uniforms**

  ```ts
  uniforms: {
    glowColor: { value: new THREE.Color(0xc5f5e0) },
    intensity: { value: 0.32 },
    power:     { value: 4.5 },
  },
  ```

- [ ] **Step 2: Tune Fresnel to reference**

  Replace:
  ```ts
  uniforms: {
    glowColor: { value: new THREE.Color(0xdcfff0) },  // whiter green
    intensity: { value: 0.38 },    // slightly stronger for visible rim
    power:     { value: 4.0 },     // slightly wider band — more visible at bevel catch
  },
  ```

- [ ] **Step 3: Locate bloom pass**

  ```ts
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.28, 0.30, 0.82)
  ```

- [ ] **Step 4: Tune bloom**

  Replace:
  ```ts
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.32, 0.40, 0.78)
  ```
  - Intensity `0.28 → 0.32`: Fractionally stronger to halo the bright right edge
  - Radius `0.30 → 0.40`: Wider spread for a more diffuse natural glass glow
  - Threshold `0.82 → 0.78`: Lower threshold catches the green floor caustic as well

- [ ] **Step 5: Tune tonemapping exposure**

  Locate:
  ```ts
  renderer.toneMappingExposure = 1.05
  ```
  Replace:
  ```ts
  renderer.toneMappingExposure = 0.98
  ```
  Slightly lower exposure darkens the overall scene, pushing the background toward the near-black seen in Image #3 (since the canvas is transparent, this affects only the rendered geometry).

- [ ] **Step 6: Visual checkpoint — compare against reference**

  Side-by-side compare `MonolithScene` render against Image #3:
  - [ ] Right edge strip is brilliant white-green (brightest element)
  - [ ] Front face reads frosted/milky — not clear glass, not opaque solid
  - [ ] Hard chamfered corners catch bright lines at bevel edges
  - [ ] Green floor pool is visible and prominent beneath the slab
  - [ ] Left side of slab is subdued/dark
  - [ ] Thin Fresnel rim halo visible at all edges
  - [ ] Background matches site's `#111418` (the canvas is transparent — no green tint should bleed into the background area)

  If any item fails, refer to the parameter notes in the relevant task above.

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/three/MonolithScene.tsx
  git commit -m "feat(monolith): fresnel and bloom calibration for reference match"
  ```

---

## Task 8: Full build verification

**Goal:** Confirm the production build is clean and no TypeScript errors were introduced.

**File:** `src/components/three/MonolithScene.tsx` (read-only at this point)

- [ ] **Step 1: Run production build**

  ```bash
  npm run build
  ```
  Expected output:
  ```
  ✓ Compiled successfully
  ✓ Generating static pages (3/3)
  ```
  Any TypeScript error here is a bug introduced in the steps above. Fix before proceeding.

- [ ] **Step 2: Check no audit regressions**

  The impeccable audit score was 20/20 before this work. This task only modifies Three.js rendering constants — no Tailwind classes, no ARIA, no contrast. No regressions expected. If in doubt, run `$impeccable audit`.

- [ ] **Step 3: Final commit**

  ```bash
  git add src/components/three/MonolithScene.tsx
  git commit -m "feat(monolith): architectural glass slab reference match complete"
  ```

---

## Iteration Guide — Troubleshooting

Use this if visual output doesn't match after following all tasks.

| Symptom | Likely cause | Fix |
|---|---|---|
| Right edge strip not bright enough | `rimRight` intensity too low or position z too negative (behind slab plane) | Increase to `12.0–14.0`, move z to `0.5–0.6` |
| Front face too transparent (clear glass) | `transmission` too high | Drop to `0.84–0.86` |
| Front face too opaque (no glow through) | `transmission` too low or `roughness` too high | Raise transmission to `0.92`, lower roughness to `0.44` |
| Corners look faceted/polygon-y | Segments too low | Increase `RoundedBoxGeometry` segments from `4` to `6` |
| Floor glow too large / blown out | Gradient center stop too opaque | Lower `rgba(70, 255, 130, 0.75)` → `rgba(70, 255, 130, 0.55)` |
| Background gets a green tint | Bloom threshold too low + additive floor glow bleeds | Raise bloom threshold back to `0.82`; reduce floor `greenLight` intensity |
| Slab rotation hides front face entirely | `rotation.y` too high | Back off to `0.45` |
| No visible Fresnel | Fresnel intensity too low for post-processing output | Raise to `0.48`, lower power to `3.5` |

---

## Self-Review — Spec Coverage

Checking Image #3 features against tasks:

| Feature | Task |
|---|---|
| 3/4 camera angle showing right thickness edge | Task 1 |
| Hard chamfered corners | Task 2 |
| Frosted/milky semi-transparent face | Task 3 |
| Green attenuation tint on edges | Task 3 |
| Brilliant right-edge strip | Tasks 4 + 5 |
| Subdued left side | Task 4 |
| Green floor caustic pool | Task 6 |
| Fresnel rim halo | Task 7 |
| Bloom calibration | Task 7 |
| Near-black background | Task 7 (exposure) |
| Build passes | Task 8 |

No gaps found.
