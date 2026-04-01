# Changelog

## v0.2.0 — 2026-04-01

### New Components

- **TypewriterReveal** — Letter-by-letter text reveal for Vox title cards. Configurable `framesPerChar` timing, optional blinking cursor, optional `roughness` for hand-stamped look via RoughenEdgesFilter. Supports `string | string[]` for multi-line with sequential/parallel modes. Default font: VoxTheme.fonts.accent (Bebas Neue).
- **GridBackground** — Graph paper / grid overlay with organic mask and wiggle. Pure CSS grid via `repeating-linear-gradient`. Mask presets: `'blob'` (procedural 8-point polygon with noise-perturbed vertices), `'rect'`, `'ellipse'`, or custom SVG path data. Feathered edges, configurable wiggle via `noise.ts`, optional scale-in entrance animation.
- **FocusPull** — Blur transition wrapper for scene changes. Designed to span scene cuts: blur ramps up as scene A ends, ramps back down as scene B starts, creating a "rack focus" lens effect that masks the transition. Cycles through an array of blur radius values (`blurSteps`) held for `framesPerStep` frames each. Hard-steps by default (posterized feel) or smooth interpolation with optional easing. Default sequence: `[0, 15, 10, 5, 15, 10, 5, 0]` at 2 frames/step = ~0.5s total.
- **FootageHomogenizer** — Shared treatment wrapper for normalizing mismatched source clips. Layered opt-in: grayscale (full or partial), heavy grain, radial edge blur, chromatic aberration, exposure flicker, vignette, optional warmth tint. All layers default on. Reuses `ChromaticAberrationFilter` and `GrainFilter` from v0.1.0 svg-filters.
- **LightLeak** — Additive blend light leak overlay for organic discoloration. Accepts texture image via `src` or falls back to procedural radial gradient (warm amber). Animated drift with configurable speed/angle. Fade-in/fade-out via `enterDuration`/`exitDuration`.
- **Article3D** — Standalone CSS perspective transforms with animated swivel (Y-axis) and tilt (X-axis) rotation. Dynamic drop shadow shifts with rotation angle. Composes with ArticleZoom for camera pan + 3D rotation, or wraps any content independently.

### New Utilities

- **`src/utils/timings.ts`** — SFX timing system. Pure functions that return `VoxEvent[]` frame markers for audio synchronization:
  - `getTypewriterTimings()` — `'letter'` per character (with label), `'line-complete'`, `'complete'`
  - `getGridTimings()` — `'grid-in'`, `'grid-settled'`
  - `getFocusPullTimings()` — `'blur-peak'` at local maxima, `'sharp'` at zero-blur frames
  - `getHomogenizerTimings()` — `'treatment-start'`, `'treatment-complete'`
  - `getLightLeakTimings()` — `'leak-in'`, `'leak-peak'`, `'leak-out'`
  - `getArticle3DTimings()` — `'rotation-start'`, `'rotation-land'`
- **`VoxEvent` type** — `{ frame: number; type: string; label?: string }` — shared event marker type for all timing functions

### New Examples

- **TitleCardReveal** — AnalogTreatment + GridBackground + TypewriterReveal + TextHighlighter (5s, 150 frames)
- **ArchivalMontage** — FootageHomogenizer + FocusPull + Article3D + LightLeak (6s, 180 frames)

### Infrastructure

- All 6 new component prop types exported from index.ts
- All 6 timing functions + VoxEvent type exported from index.ts
- 6 new Remotion Studio test compositions in V020-Component-Tests folder
- 2 new recipe compositions in Recipe-Examples folder
- All v0.2.0 components include `className` and `style` pass-through props
- All v0.2.0 components consume `useVoxDelay()` for OffsetGroup compatibility

---

## v0.1.0 — 2026-04-01 (Initial Release)

### Components
- **AnalogTreatment** — Wrapper with posterized frame rate (12fps default), procedural grain, chromatic aberration (single SVG filter pass), radial vignette, deterministic camera shake, warm background tint. Accepts optional paper/halftone texture overlays via `staticFile()`.
- **TextHighlighter** — Animated brush-stroke highlight behind text. Multiply blend mode, SVG roughen edges filter, configurable brush hardness (85% default). Supports `string | string[]` for multi-line with sequential/parallel modes. Added `background` prop for paper-like backing panel when used over busy images.
- **HandDrawnReveal** — SVG trim-path draw-on animation using `pathLength="1"` (no DOM measurement). Color offset trails (yellow leads black by N frames). 5 built-in presets: arrow-curly, arrow-straight, circle, underline, bracket.
- **OffsetGroup** — Stagger utility wrapping children in Remotion `<Sequence>` with configurable frame offsets. Forward/reverse/random direction. Provides `VoxOffsetContext` so children auto-consume delay via `useVoxDelay()` hook.
- **ArticleZoom** — Camera pan over source material with eased timing. Screen emulation: repeating-gradient scan lines, noise-driven flicker, radial depth-of-field blur, optional screen tint.
- **TextMatchCut** — Rapid-fire screenshot montage with word position alignment. 4-frame default cuts. Highlights after montage settles with roughened SVG rect. Supports `'center'` shorthand for simple centered alignment.

### Utilities
- `posterizeFrame()` — Frame stepping for lower frame rate simulation
- `seededNoise()` / `wiggle()` — Deterministic noise for camera shake, flicker, wiggle
- `ChromaticAberrationFilter` — Single SVG filter using feColorMatrix + feOffset + feComposite
- `RoughenEdgesFilter` — feTurbulence + feDisplacementMap for organic edge imperfection
- `GrainFilter` — Procedural fractal noise overlay

### Theme
- `VoxTheme` — Design tokens: colors (warmWhite, yellow, highlightYellow, red, deepGray), fonts (Balto/DM Sans fallback, Sora, Bebas Neue), easings (per-component defaults), treatment defaults
- `VoxOffsetContext` + `useVoxDelay()` — React context for stagger delay propagation

### Presets
- 5 hand-drawn SVG path presets: `arrow-curly`, `arrow-straight`, `circle`, `underline`, `bracket`

### Examples
- `ArticleReveal` — ArticleZoom + TextHighlighter + HandDrawnReveal arrow callout
- `SourceMontage` — TextMatchCut rapid screenshots → TextHighlighter
- `AnnotatedExplainer` — OffsetGroup staggering HandDrawnReveal + TextHighlighter annotations

### Infrastructure
- npm package scaffold with Remotion 4.0.421 peer dependency
- TypeScript strict mode, ESM build
- All component prop types exported
- 9 Remotion Studio compositions (6 component tests + 3 recipe examples)
- Research transcripts from 6 Vox tutorial videos (~22K words)

### Bug Fixes (during v0.1.0 development)
- Fixed chromatic aberration: single SVG filter pass instead of 3x children clones
- Fixed HandDrawnReveal: `pathLength="1"` instead of `getTotalLength()` DOM API
- Fixed OffsetGroup: removed double-counted delay (Sequence + context)
- Fixed TextMatchCut: unique SVG IDs per instance (was hardcoded, broke with multiple)
- Fixed blend modes: paper/halftone textures use overlay not multiply
- Fixed posterize step: `Math.floor` not `Math.round` for correct FPS targeting
- Fixed grain: added visible background for SVG filter to process
- Fixed highlight visibility: background prop + reduced grain haze for over-image use
- Exported all component prop types from index.ts
