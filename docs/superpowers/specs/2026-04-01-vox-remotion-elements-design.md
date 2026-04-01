# Vox Remotion Elements — Design Spec

**Date:** 2026-04-01
**Status:** Approved (rev 2 — post spec review)
**Scope:** Component library + Claude Code skill for Vox-style video editing in Remotion
**Target Resolution:** 1080x1920 (9:16 vertical) at 30fps — matches content-autopilot pipeline. All pixel values are absolute for this resolution.

---

## Overview

Three deliverables that bring Vox-style editing techniques to the Remotion video pipeline:

1. **npm package** (`vox-remotion-elements`) at `~/Projects/vox-remotion-elements/` — standalone, publishable GitHub repo
2. **Claude Code skill** at `~/.claude/skills/vox-editing/` — editorial knowledge layer with recipes and decision trees
3. **Content-autopilot integration** — consumer of the package, additive to existing compositions

### Design Philosophy

Vox's visual language is analog-first: screens feel like screens, paper feels like paper, nothing is sterile or purely digital. Every technique serves one goal — pull graphics away from the synthetic digital feel. This library encodes that philosophy as composable Remotion components.

### What This Is Not

- Not a full Vox documentary pipeline (that's stretch goal A)
- Not a replacement for existing Bold Creator or Nshnv styles
- Not an After Effects plugin — everything runs in Remotion (React + CSS + SVG)

---

## Source Material

Techniques distilled from 6 tutorial videos (~22,000 words of transcripts) stored in `~/Projects/vox-remotion-elements/research/transcripts/`:

| Video | Key Techniques |
|-------|---------------|
| How Vox Builds Their Animations in AE | Texture overlays (texturelabs.org), warm backgrounds, roughen edges, halftone overlays, chromatic aberration, vignetting, posterize time, screen emulation, footage homogenization |
| How to Design & Animate the Vox Style | Artboard layout, hand-drawn elements (Wacom), offset keyframes, posterized wiggle expression, focus pulls, callout lines with color offset, split-at-midpoint cuts |
| Vox Highlighter Effect in AE | Stroke on mask path, multiply blend mode, brush hardness ~85%, sequential mask animation, 3D camera with depth of field |
| Vox Style News Article Animation | Luma key headline extraction, paper texture overlay, highlight with rectangle mask + multiply + displacement/fast noise, flicker, displacement via paper texture |
| How to Make a Vox Style Intro | Image sequences, hand-drawn assets (arrows, circles), character animations, music-driven pacing, collage layouts, paper textures, posterize time, chromatic aberration, grid backgrounds |
| Text Match Cut & Highlight Effect | 4-frame rapid screenshot cuts, word alignment, yellow highlight with darken blend + roughen edges, Basic 3D rotation |

---

## Architecture

### Package Structure

```
vox-remotion-elements/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts                  # Public exports
│   ├── components/
│   │   ├── AnalogTreatment.tsx   # Wrapper: full analog treatment stack
│   │   ├── TextHighlighter.tsx   # Animated text highlight stroke
│   │   ├── HandDrawnReveal.tsx   # SVG trim-path line/arrow/circle reveals
│   │   ├── ArticleZoom.tsx       # Source material camera pan + screen emulation
│   │   ├── TextMatchCut.tsx      # Rapid screenshot montage with word alignment
│   │   └── OffsetGroup.tsx       # Stagger utility for entrance/exit timing
│   ├── theme.ts                  # VoxTheme design tokens + easings
│   ├── context.ts                # VoxOffsetContext + useVoxDelay() hook
│   ├── utils/
│   │   ├── posterize.ts          # Frame stepping math
│   │   ├── noise.ts              # Deterministic noise (shake, flicker, wiggle)
│   │   └── svg-filters.ts        # Reusable SVG filter definitions (roughen, displacement, grain)
│   └── presets/
│       ├── arrows.ts             # Built-in SVG path data
│       ├── circles.ts
│       └── underlines.ts
├── assets/
│   ├── textures/
│   │   ├── paper-warm.jpg
│   │   ├── paper-cool.jpg
│   │   ├── halftone-grunge.png
│   │   └── light-leak-01.jpg
│   └── svg/
│       ├── arrow-curly.svg
│       ├── arrow-straight.svg
│       ├── circle-wobbly.svg
│       ├── underline-rough.svg
│       └── bracket-left.svg
├── examples/
│   ├── ArticleReveal.tsx         # Recipe: ArticleZoom + TextHighlighter + HandDrawnReveal arrow callout
│   ├── SourceMontage.tsx         # Recipe: TextMatchCut rapid screenshots → TextHighlighter on settled image
│   └── AnnotatedExplainer.tsx    # Recipe: OffsetGroup staggering HandDrawnReveal lines + TextHighlighter
└── research/
    └── transcripts/              # Source tutorial transcripts (already populated)
```

### Dependencies

- **Peer dependencies:** `remotion`, `@remotion/core`, `react`
- **No runtime dependencies** — everything is CSS, SVG, and React
- Tree-shakeable ESM build via TypeScript

---

## Component Specifications

### 1. AnalogTreatment (Wrapper)

The foundational layer. Wraps any content and applies the Vox analog feel. Every other component can be used standalone, but wrapping in AnalogTreatment adds the cohesive Vox texture.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fps` | `number` | `12` | Posterize time frame rate (8=very choppy, 12=standard Vox, 15=subtle). Accepts any positive integer; warns if > composition FPS. |
| `grain` | `number` | `0.15` | Noise overlay opacity (0-1) |
| `chromaticAberration` | `number` | `0.8` | RGB channel offset in pixels |
| `vignette` | `number` | `0.3` | Vignette strength (0-1) |
| `warmth` | `string` | `#f5f0e8` | Background tint |
| `paperTexture` | `string \| null` | `null` | Texture image path via `staticFile()`. Falls back to procedural SVG feTurbulence. |
| `halftoneTexture` | `string \| null` | `null` | Halftone overlay path via `staticFile()` |
| `cameraShake` | `{ frequency: number; amplitude: number }` | `{ frequency: 2, amplitude: 2 }` | Wiggle-style camera shake |
| `seed` | `number` | `0` | Noise seed for deterministic but unique shake/flicker patterns across multiple instances |
| `className` | `string` | `''` | CSS class pass-through |
| `style` | `CSSProperties` | `{}` | Style pass-through |
| `children` | `ReactNode` | — | Content to wrap |

**Implementation:**

- **Posterize time:** `Math.floor(frame / step) * step` where `step = compositionFps / posterizeFps`. All children render at the stepped frame value, creating the choppy handcrafted feel.
- **Grain:** SVG `<feTurbulence type="fractal" baseFrequency="0.65" numOctaves="3" />` as a full-frame overlay. When `paperTexture` is provided, the image is overlaid with `mix-blend-mode: overlay` instead.
- **Chromatic aberration:** Single SVG filter definition using `<feColorMatrix>` to isolate R/G/B channels, `<feOffset>` to shift each, and `<feComposite>` to merge. Applied as `filter: url(#vox-chromatic-aberration)` on the content container — one render pass, not three copies of children. Defined in `svg-filters.ts` and injected into the DOM once. Subtle at 0.8px — the transcript warns "dialing it too much can look amateur."
- **Vignette:** Radial gradient overlay from `transparent` center to `rgba(0,0,0,vignette)` edges.
- **Camera shake:** Per-stepped-frame transform offset using deterministic noise seeded by frame number. `translateX(noise(frame) * amplitude)px translateY(noise(frame + 1000) * amplitude)px`.
- **Warmth:** Background `div` with the warm tint behind all children.
- **Halftone:** Image overlay with `mix-blend-mode: overlay`, same as paper texture but separate layer.

**Why this matters:** The transcript emphasizes that Vox makes "many small decisions that pull their graphics away from that digital synthetic feel." This component bundles those small decisions into one wrapper.

### 2. TextHighlighter

The single most recognizable Vox visual element. An animated highlight that sweeps across text with imperfect edges, letting the paper texture bleed through.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string \| string[]` | — | Text to display and highlight. Pass array for explicit line control (recommended for multi-line). |
| `color` | `string` | `#FFD700` | Highlight color |
| `blendMode` | `string` | `multiply` | CSS mix-blend-mode |
| `brushHardness` | `number` | `0.85` | Edge sharpness (0=soft, 1=hard) |
| `strokeWidth` | `number \| 'auto'` | `'auto'` | Highlight bar height (auto = 1.2x line height) |
| `delay` | `number` | `0` | Start frame offset |
| `duration` | `number` | `20` | Frames to complete stroke |
| `roughness` | `number` | `3` | Edge irregularity via SVG displacement |
| `sequential` | `boolean` | `true` | Multi-line highlights animate one after another |
| `fontSize` | `number` | `42` | Text size in px |
| `fontFamily` | `string` | `'Sora'` | Font family |

**Implementation:**

- Text rendered as a `<div>` with normal styling.
- Highlight is an SVG `<rect>` behind the text using `mix-blend-mode: multiply` — this is critical because multiply retains the paper grain and texture, making the highlight feel physical rather than digital.
- Animation via SVG `clip-path` or `mask` revealing left-to-right, driven by Remotion's `interpolate()`.
- Edge roughness via SVG filter chain: `<feTurbulence baseFrequency="0.04" numOctaves="4" />` → `<feDisplacementMap scale={roughness} />`. Brush hardness controls the displacement scale inversely — 0.85 hardness means scale of ~2-3px, enough for subtle imperfection without looking torn.
- Multi-line: when `text` is an array, each string gets its own SVG rect. When `sequential=true`, the second line starts animating only after the first completes. When `false`, all highlight simultaneously. Single string is treated as one line.
- The transcript specifically says "the more slightly imperfect that looks, the better."

### 3. HandDrawnReveal

SVG trim-path animation that makes lines, arrows, and circles appear to draw themselves on screen. Used for callouts, annotations, and decorative elements.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `svg` | `string \| null` | `null` | SVG path data (`d` attribute) or asset file path |
| `preset` | `'arrow-curly' \| 'arrow-straight' \| 'circle' \| 'underline' \| 'bracket' \| null` | `null` | Built-in SVG preset |
| `color` | `string` | `#000000` | Stroke color |
| `strokeWidth` | `number` | `3` | Line thickness |
| `duration` | `number` | `20` | Frames to complete draw |
| `delay` | `number` | `0` | Start frame offset |
| `colorOffset` | `{ color: string; leadFrames: number } \| null` | `null` | Offset duplicate line — `leadFrames` is how many frames the offset color appears before the main stroke |
| `roughness` | `number` | `2` | SVG displacement for hand-drawn feel |
| `cap` | `'round' \| 'butt'` | `'round'` | Stroke line cap |
| `fill` | `string \| null` | `null` | Optional fill color (for closed shapes like circles) |

**Implementation:**

- SVG `<path>` element with `pathLength="1"` attribute (normalizes all paths to length 1, avoiding DOM measurement via `getTotalLength()`). `stroke-dasharray="1"` and `stroke-dashoffset` animates from 1 to 0.
- Animation driven by `interpolate(frame, [delay, delay + duration], [1, 0], { easing: Easing.out(Easing.quad) })`.
- Color offset: a second identical `<path>` rendered behind the first, starting at `delay - colorOffset.leadFrames` with `colorOffset.color`. Creates the "yellow first, black 3 frames after" effect from the transcripts.
- Roughness via same feTurbulence + feDisplacementMap chain.
- Round cap gives the "pen tip" feel that the transcript recommends.
- Presets are pre-defined `d` attribute strings stored in `src/presets/`. They include multiple variants (e.g., 3 different curly arrows) so compositions don't look repetitive.

### 4. ArticleZoom

Shows source material (screenshots, articles, web pages) with a slow camera pan and screen emulation — the "you're discovering this alongside the narrator" effect.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Image/screenshot source path |
| `startPosition` | `{ x: number; y: number }` | `{ x: 0, y: 0 }` | Camera start (% offset) |
| `endPosition` | `{ x: number; y: number }` | `{ x: 0, y: -20 }` | Camera end (% offset) |
| `startScale` | `number` | `1.0` | Initial zoom |
| `endScale` | `number` | `1.1` | Final zoom |
| `scanLines` | `boolean` | `true` | Screen emulation overlay |
| `flicker` | `number` | `0.05` | Refresh rate flicker intensity |
| `depthOfField` | `number` | `0` | Edge blur radius (0=off) |
| `screenTint` | `string \| null` | `null` | Optional color wash |
| `duration` | `number` | `60` | Total frames |

**Implementation:**

- Image rendered larger than container, animated via `transform: translate(x%, y%) scale(s)` using Remotion `interpolate()` with eased timing.
- **Scan lines:** `repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(0,0,0,0.03) 7px, rgba(0,0,0,0.03) 8px)` overlay. The transcript uses Venetian blinds at 8px width with 1px feather — this CSS equivalent achieves the same look.
- **Flicker:** Overlay `<div>` with opacity driven by `noise(steppedFrame) * flicker` — creates the screen refresh feel. The transcript uses `wiggle(24, 0.05)` on an exposure layer.
- **Depth of field:** Radial CSS mask on a `filter: blur()` overlay — sharp center circle, blurred edges. The transcript creates this with a camera lens blur + radial mask in AE.
- **Screen tint:** Optional solid color overlay at low opacity for color temperature matching.

### 5. TextMatchCut

Rapid-fire screenshot switching with a consistent word position across all images. Creates the "evidence montage" effect used to establish that many sources are talking about the same thing.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `screenshots` | `Array<{ src: string; wordPosition: { x: number; y: number } \| 'center' }>` | — | Images with word anchor coordinates. Use `'center'` for simple centered alignment without precise word positioning. |
| `framesPerImage` | `number` | `4` | Duration per screenshot |
| `highlightWord` | `boolean` | `true` | Add highlight over aligned word |
| `highlightColor` | `string` | `#FFD700` | Highlight color |
| `highlightBlend` | `string` | `darken` | Blend mode for highlight |
| `highlightRoughness` | `number` | `12` | Roughen edges border size |
| `highlightDelay` | `number` | `0` | Frames after montage ends before highlight animates |
| `delay` | `number` | `0` | Start frame offset |
| `wordBox` | `{ width: number; height: number }` | `{ width: 200, height: 40 }` | Size of the word alignment region |

**Implementation:**

- Current screenshot: `screenshots[Math.floor((steppedFrame - delay) / framesPerImage) % length]`.
- Each image positioned so its `wordPosition` aligns to center screen (or a fixed anchor point). Transform: `translate(centerX - wordPosition.x, centerY - wordPosition.y)`.
- Highlight rect appears after the montage cycle, using the same roughened-edge SVG filter as TextHighlighter but with `darken` blend (the transcript uses darken for match cuts vs multiply for on-paper highlights).
- Optional: expose timing markers for SFX sync (shutter click per cut).

### 6. OffsetGroup (Utility)

Timing utility that staggers children's entrances and exits. Encodes the Vox principle that "elements never animate in together."

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stagger` | `number` | `3` | Frames between each child's entrance |
| `exitStagger` | `number \| null` | `null` | Exit stagger (defaults to `stagger`) |
| `exitAt` | `number \| null` | `null` | Frame at which exit animation begins |
| `direction` | `'forward' \| 'reverse' \| 'random'` | `'forward'` | Stagger order |
| `children` | `ReactNode` | — | Elements to stagger |

**Implementation:**

- Wraps each child in a Remotion `<Sequence>` with `from={index * stagger}`.
- Provides a `VoxOffsetContext` (React context) with `{ delay: number }` for each child. Library components consume this internally. Third-party components can use the exported `useVoxDelay()` hook. No `cloneElement` — context only.
- Exit: if `exitAt` is specified, children get a second sequence offset for their exit, staggered in reverse by default (last in, first out).
- The transcript emphasizes: "things aren't meant to be perfect... offsetting key frames adds spice."

---

## Design Tokens

```typescript
import { Easing } from 'remotion';

export const VoxTheme = {
  colors: {
    warmWhite: '#f5f0e8',      // Default background — never pure white
    warmGray: '#e8e0d4',       // Secondary background
    black: '#1a1a1a',          // Text and line work
    yellow: '#FFD700',         // Primary highlight
    highlightYellow: '#FFCC00', // Alternate highlight (Vox uses both)
    red: '#c0392b',            // Accent (bullet points, callout squares)
    deepGray: '#272727',       // Secondary text
  },
  fonts: {
    headline: 'Balto',         // Vox's headline font (commercial — requires license)
    headlineFallback: 'DM Sans', // Open-source fallback when Balto unavailable
    body: 'Sora',              // Clean sans-serif body
    accent: 'Bebas Neue',      // Bold display titles
  },
  easing: {
    highlightStroke: Easing.out(Easing.cubic),   // Fast start, slow end — mimics pen stroke
    cameraPan: Easing.inOut(Easing.quad),         // Smooth drift for ArticleZoom
    trimPathReveal: Easing.out(Easing.quad),      // Drawing feel for HandDrawnReveal
    elementEntrance: Easing.out(Easing.back(1.2)), // Slight overshoot for pop-in
    elementExit: Easing.in(Easing.quad),           // Gentle acceleration out
  },
  treatment: {
    posterizeFps: 12,          // Standard Vox choppiness
    grain: 0.15,               // Subtle grain overlay
    chromaticAberration: 0.8,  // "Pull back to 0.8 — getting excited with this looks amateur"
    vignette: 0.3,             // Guide eye to center
    cameraShake: { frequency: 2, amplitude: 2 },
    roughenEdges: 3,           // SVG displacement scale
    brushHardness: 0.85,       // "About 85 gives a nice soft edge"
  },
};
```

**Font note:** `Balto` is a commercial typeface by Tal Leming. If publishing the package or using without a license, fall back to `headlineFallback` (DM Sans). Components default to `headlineFallback` and accept an override prop.

---

## Skill Design

### Location

`~/.claude/skills/vox-editing/SKILL.md`

### Trigger Phrases

"vox style," "analog treatment," "vox editing," "highlighter effect," "hand-drawn reveal," "article zoom," "match cut," "vox intro," "analog feel," "paper texture"

### Contents

1. **Component quick reference** — props and recommended values for each component
2. **Recipes** — pre-configured composition patterns:
   - **Article Reveal:** `AnalogTreatment` > `ArticleZoom` + `TextHighlighter` + `HandDrawnReveal`
   - **Source Montage:** `AnalogTreatment` > `TextMatchCut` + `TextHighlighter`
   - **Annotated Explainer:** `AnalogTreatment` > `OffsetGroup` containing reveals and highlights
   - **Collage Intro:** `AnalogTreatment` > `OffsetGroup` of images + arrows + title card
   - **Quick Highlight:** Standalone `TextHighlighter` dropped into any composition
3. **Decision tree:** Which component for which editorial need
4. **Integration notes:** Mixing Vox elements with Bold Creator / Nshnv, SFX pairing
5. **Transcript knowledge base:** Key quotes and principles from the source tutorials

### Skill Does Not Contain

- Implementation code (lives in the package)
- Asset file paths (lives in the package)
- Anything that goes stale if the API changes

---

## Asset Delivery

Textures are small files (< 200KB each). Two delivery modes:

1. **Bundled (default):** Starter textures are base64-encoded and imported directly in component files. Components work out of the box with zero asset setup. Slight bundle size increase (~500KB total).
2. **External (opt-in):** Users pass texture paths via `paperTexture`/`halftoneTexture` props, resolved via Remotion's `staticFile()`. Users must copy assets to their `public/` directory. Components show a helpful console warning if a texture path resolves to nothing.

SVG presets (arrows, circles, underlines) are always bundled as path data strings in `src/presets/` — no file system dependency.

## Content-Autopilot Integration

- Install via local file reference or npm: `npm install vox-remotion-elements`
- Import: `import { AnalogTreatment, TextHighlighter } from 'vox-remotion-elements'`
- Bundled textures work immediately; optional high-res textures go in `public/vox/`
- New compositions in `Root.tsx` use Vox elements alongside existing components
- No changes to existing Bold Creator or Nshnv code — purely additive

---

## Implementation Priority

Build order based on dependency chain and impact:

**v1 (core package):**

1. **Package scaffold** — `package.json`, `tsconfig.json`, Remotion setup, `.gitignore`
2. **Utils** (`posterize.ts`, `noise.ts`, `svg-filters.ts`) — everything else depends on these
3. **VoxTheme** (`theme.ts`) — design tokens and easings referenced by all components
4. **VoxOffsetContext** (`context.ts`) — React context + `useVoxDelay()` hook
5. **AnalogTreatment** — the wrapper that ties everything together
6. **TextHighlighter** — highest-impact standalone element
7. **HandDrawnReveal** — second most impactful, needed by recipes
8. **OffsetGroup** — utility needed to compose elements together
9. **ArticleZoom** — composition-level component
10. **TextMatchCut** — composition-level component
11. **Presets** — built-in SVG arrow/circle/underline paths
12. **Assets** — source and base64-encode starter textures
13. **Examples** — recipe compositions demonstrating each pattern
14. **Package config** — npm publish setup, README, `index.ts` exports

**Post-v1:**

15. **Claude Code skill** — written from lived implementation experience, not spec assumptions. APIs will have been validated by this point.

---

## Success Criteria

- All 6 components render correctly in Remotion Studio
- AnalogTreatment produces a visibly "analog" feel on any wrapped content
- TextHighlighter is indistinguishable from the Vox original at normal playback speed
- Components compose cleanly (e.g., TextHighlighter inside AnalogTreatment inside OffsetGroup)
- Package installs and imports without errors in a fresh Remotion project
- Skill correctly guides component usage when invoked
- Examples render complete compositions demonstrating each recipe

---

## Review Amendments (Rev 2)

Changes made after spec review:

| Issue | Resolution |
|-------|-----------|
| **C1.** Chromatic aberration 3x children perf | Single SVG filter with `feColorMatrix` + `feOffset` + `feComposite` — one render pass |
| **C2.** `getTotalLength()` unavailable | Use `pathLength="1"` SVG attribute — no DOM measurement needed |
| **C3.** Asset delivery incomplete | Base64-encoded bundled textures as default; `staticFile()` for opt-in external textures with console warnings |
| **I1.** Multi-line detection | `text` prop accepts `string \| string[]` — array gives explicit line control |
| **I2.** OffsetGroup injection fragile | `VoxOffsetContext` + `useVoxDelay()` hook — context only, no `cloneElement` |
| **I3.** No easing specification | Added `VoxTheme.easing` with per-component defaults (cubic for highlights, quad for pans/reveals) |
| **I4.** Manual word coordinates | Added `'center'` option to `wordPosition` for simple centered alignment |
| **I5.** Balto commercial font | Documented as optional with `headlineFallback: 'DM Sans'`; components default to fallback |
| **I6.** No resolution spec | Added target resolution 1080x1920 at 30fps in header |
| **M1.** FPS union type | Changed to `number` with runtime warning |
| **M2.** No className/style | Added `className` and `style` pass-through on AnalogTreatment |
| **M3.** colorOffset.frames ambiguous | Renamed to `leadFrames` |
| **M4.** Examples unspecified | Added descriptions to each example file in package structure |
| **M5.** Noise seed missing | Added `seed` prop to AnalogTreatment |
| **Scope** | Skill moved to post-v1 — write from lived implementation experience |
