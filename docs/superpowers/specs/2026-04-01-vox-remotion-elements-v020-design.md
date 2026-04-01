# Vox Remotion Elements v0.2.0 — Design Spec

**Date:** 2026-04-01
**Status:** Approved
**Scope:** 6 new components + shared timing utility + 2 recipe examples
**Target Resolution:** 1080x1920 (9:16 vertical) at 30fps
**Depends on:** v0.1.0 core (AnalogTreatment, TextHighlighter, HandDrawnReveal, OffsetGroup, ArticleZoom, TextMatchCut, utils, theme, context, presets)

---

## Overview

v0.2.0 adds 6 independent components sourced from unbuilt techniques in the research transcripts, plus a shared SFX timing utility that makes it easy for users to sync sound effects to visual events.

### Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Scope | 6 components in a single release | All independent — no dependency chain between them |
| Article3D | Standalone component | 3D rotation applies to any content, not just ArticleZoom screenshots |
| FootageHomogenizer | Layered opt-in with defaults on | Different productions need different treatment subsets |
| TypewriterReveal | Text + timing markers | SFX sync is a first-class concern |
| SFX sync pattern | Pure `getTimings()` utility functions per component | Simplest, most testable, works with Remotion's declarative model |
| GridBackground mask | Presets + custom SVG path | Two transcripts use different mask shapes (blob vs rect) |

### Source Material

Techniques from 6 tutorial transcripts (~22K words) at `research/transcripts/`:

| Component | Primary Source | Key Technique |
|---|---|---|
| TypewriterReveal | GFbh6RuuFVA | "typewriter" AE animation preset on title cards |
| GridBackground | 4OzFNpnXcZg, GFbh6RuuFVA | Grid effect + wiggle + blobby mask at 30% opacity |
| FocusPull | 4OzFNpnXcZg | Blur cycling every 2 frames between scenes |
| FootageHomogenizer | sACZlG7z35Q | Shared B&W + blur + grain to blend mismatched clips |
| LightLeak | sACZlG7z35Q | Additive blend light leak texture for organic discoloration |
| Article3D | LJcAPKDVhqc | Basic 3D swivel + tilt on article screenshots |

---

## Shared Timing Utility — `src/utils/timings.ts`

Pure utility functions for SFX synchronization. One per component. Returns frame-level event markers that users wire to Remotion `<Audio>` elements.

### Type

```typescript
export type VoxEvent = {
  frame: number;       // Absolute frame number
  type: string;        // Event name (e.g., 'letter', 'blur-peak', 'cut')
  label?: string;      // Human-readable detail (e.g., the character that appeared)
};
```

### Exported Functions

| Function | Signature | Events |
|---|---|---|
| `getTypewriterTimings` | `(props: { text: string \| string[]; delay?: number; framesPerChar?: number; sequential?: boolean }) => VoxEvent[]` | `'letter'` per character (label = the char), `'line-complete'` per line, `'complete'` at end |
| `getGridTimings` | `(props: { delay?: number; enterDuration?: number \| null }) => VoxEvent[]` | `'grid-in'` at entrance start, `'grid-settled'` at entrance end |
| `getFocusPullTimings` | `(props: { blurSteps?: number[]; framesPerStep?: number; delay?: number }) => VoxEvent[]` | `'blur-peak'` at local max blur frames, `'sharp'` at zero-blur frames |
| `getHomogenizerTimings` | `(props: { delay?: number }) => VoxEvent[]` | `'treatment-start'`, `'treatment-complete'` |
| `getLightLeakTimings` | `(props: { delay?: number; duration?: number; enterDuration?: number \| null; exitDuration?: number \| null }) => VoxEvent[]` | `'leak-in'` at fade start, `'leak-peak'` at full opacity, `'leak-out'` at fade-out start |
| `getArticle3DTimings` | `(props: { delay?: number; duration?: number }) => VoxEvent[]` | `'rotation-start'` at delay, `'rotation-land'` at delay + duration |

### Usage Pattern

```tsx
import { TypewriterReveal, getTypewriterTimings } from 'vox-remotion-elements';
import { Audio, staticFile } from 'remotion';

const timingProps = { text: 'CAMERA', delay: 10, framesPerChar: 3 };
const events = getTypewriterTimings(timingProps);

export const TitleCard = () => (
  <>
    <TypewriterReveal {...timingProps} />
    {events
      .filter(e => e.type === 'letter')
      .map((e, i) => (
        <Audio key={i} startFrom={e.frame} src={staticFile('typewriter-click.wav')} />
      ))}
  </>
);
```

---

## Component Specifications

### 1. TypewriterReveal

Letter-by-letter text reveal for Vox title cards. Source: GFbh6RuuFVA (AE "typewriter" animation preset).

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string \| string[]` | — | Text to reveal. Array for explicit multi-line control. |
| `framesPerChar` | `number` | `2` | Frames between each character appearing. At 30fps, `2` = 15 chars/second. |
| `delay` | `number` | `0` | Start frame offset |
| `cursor` | `boolean` | `false` | Optional blinking cursor |
| `cursorChar` | `string` | `'▌'` | Cursor character when enabled |
| `cursorBlinkRate` | `number` | `8` | Frames per blink cycle |
| `roughness` | `number` | `0` | Edge roughness via SVG displacement. 0 = clean text. Non-zero activates RoughenEdgesFilter for hand-stamped look. |
| `fontSize` | `number` | `72` | Text size in px |
| `fontFamily` | `string` | `VoxTheme.fonts.accent` | Font — defaults to Bebas Neue via theme token |
| `color` | `string` | `'#1a1a1a'` | Text color |
| `lineSpacing` | `number` | `1.2` | Line height multiplier |
| `sequential` | `boolean` | `true` | Multi-line: next line starts after previous completes |
| `className` | `string` | `''` | CSS class pass-through |
| `style` | `CSSProperties` | `{}` | Style pass-through |

**Implementation:**

- Renders text as a `<span>` per character inside a `<div>`. Each character's `opacity` toggles 0→1 based on `frame >= delay + (charIndex * framesPerChar)`.
- Uses `posterizeFrame()` from existing utils so character appearances align with posterized frame rate inside AnalogTreatment.
- Multi-line (`string[]`): each line is a separate `<div>`. When `sequential=true`, line N starts at the frame after line N-1's last character. When `false`, all lines start simultaneously at `delay`.
- Cursor: trailing `<span>` with opacity toggling every `cursorBlinkRate` frames. Positioned after last visible character. Disappears after reveal completes.
- Roughness: when `roughness > 0`, the text container gets an SVG filter using the existing `RoughenEdgesFilter` from `svg-filters.tsx`. Applied to the container, not individual characters.

**Composition:**
- Inside AnalogTreatment → choppy posterized title card
- Followed by TextHighlighter (via Sequence) → reveal then highlight
- Inside OffsetGroup → staggered multi-block title

---

### 2. GridBackground

Graph paper / grid overlay with organic mask and wiggle. Source: 4OzFNpnXcZg (grid + wiggle + blobby mask at 30%), GFbh6RuuFVA (rectangular grid behind title cards).

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `cellSize` | `number` | `40` | Grid cell size in px |
| `lineWidth` | `number` | `1` | Grid line thickness |
| `color` | `string` | `'#cccccc'` | Grid line color |
| `opacity` | `number` | `0.3` | Overall opacity (transcript: 30%) |
| `mask` | `'blob' \| 'rect' \| 'ellipse' \| string` | `'blob'` | Mask shape. String = custom SVG path data. |
| `maskFeather` | `number` | `80` | Edge feather in px (transcript ~600 at 4K, ~80 at 1080) |
| `maskScale` | `number` | `0.7` | Mask size relative to container (0-1) |
| `maskPosition` | `{ x: number; y: number }` | `{ x: 0.5, y: 0.5 }` | Mask center (0-1 normalized) |
| `wiggle` | `{ frequency: number; amplitude: number }` | `{ frequency: 2, amplitude: 3 }` | Grid position wiggle |
| `enterDuration` | `number \| null` | `null` | Frames to scale-in. Null = already visible. |
| `delay` | `number` | `0` | Start frame offset |
| `seed` | `number` | `0` | Noise seed for wiggle determinism |
| `className` | `string` | `''` | CSS class pass-through |
| `style` | `CSSProperties` | `{}` | Style pass-through |

**Implementation:**

- Grid via `repeating-linear-gradient` in both axes on a `<div>`. No SVG, no canvas — pure CSS.
- Wiggle: container `transform: translate()` driven by `wiggle()` from existing `noise.ts`, applied to posterized frame.
- Mask: SVG `<clipPath>` on the grid container.
  - `'blob'`: procedural 8-point radial polygon. Base radius = `maskScale * min(width, height) / 2`. Each vertex perturbed by ±15% using `seededNoise(vertexIndex, seed)`. Produces organic, non-repeating shapes.
  - `'rect'`: simple rectangle at `maskScale` size.
  - `'ellipse'`: ellipse at `maskScale` size.
  - Custom string: raw SVG path data in the `<clipPath>`.
- Feather: `<feGaussianBlur>` on the mask via SVG filter.
- Entrance: when `enterDuration` is set, scale from 0 to `maskScale` using `VoxTheme.easing.elementEntrance`.

---

### 3. FocusPull

Blur transition between scenes. Designed to span scene cuts — place it as a `<Sequence>` overlapping the transition point so blur ramps up during scene A's exit and ramps back down during scene B's entry, creating a "rack focus" lens effect that masks the cut. Source: 4OzFNpnXcZg (blur keyframed every 2 frames: 15→10→5→15→10→5).

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `blurSteps` | `number[]` | `[0, 15, 10, 5, 15, 10, 5, 0]` | Sequence of blur radius values |
| `framesPerStep` | `number` | `2` | Frames each blur value is held |
| `delay` | `number` | `0` | Start frame offset |
| `easing` | `EasingFunction \| null` | `null` | Null = hard steps (posterized). Easing = smooth interpolation between steps. |
| `children` | `ReactNode` | — | Content to blur |
| `className` | `string` | `''` | CSS class pass-through |
| `style` | `CSSProperties` | `{}` | Style pass-through |

**Implementation:**

- Wrapper `<div>` with `filter: blur(Npx)` on children.
- Current radius: `blurSteps[Math.floor((frame - delay) / framesPerStep) % blurSteps.length]`.
- When `easing` is null, hard-steps between values (posterized feel).
- When `easing` is provided, `interpolate()` between adjacent steps.
- Total duration: `blurSteps.length * framesPerStep` frames.

---

### 4. FootageHomogenizer

Shared treatment wrapper for normalizing mismatched source clips. Source: sACZlG7z35Q ("run everything through a shared treatment... could be as simple as forcing black and white, adding some heavy grain").

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `grayscale` | `boolean \| number` | `true` | True = full B&W. Number = partial desaturation (0-1). |
| `grain` | `number` | `0.3` | Heavy grain opacity (heavier than AnalogTreatment's 0.15) |
| `blur` | `number` | `4` | Edge blur radius for depth-of-field |
| `blurMask` | `'radial' \| 'none'` | `'radial'` | Radial = sharp center, blurred edges. None = uniform. |
| `chromaticAberration` | `number` | `1.5` | Stronger than AnalogTreatment's 0.8 |
| `flicker` | `number` | `0.05` | Exposure flicker (transcript: `wiggle(24, 0.05)`) |
| `vignette` | `number` | `0.4` | Stronger vignette to force eye to center |
| `warmth` | `string \| null` | `null` | Optional color temperature tint |
| `seed` | `number` | `0` | Noise seed |
| `children` | `ReactNode` | — | Source clip content |
| `className` | `string` | `''` | CSS class pass-through |
| `style` | `CSSProperties` | `{}` | Style pass-through |

**Implementation:**

- Layer stack (bottom to top): grayscale CSS filter → radial blur (inverted radial SVG mask, feathered) → chromatic aberration SVG filter → flicker overlay → grain overlay → vignette gradient.
- Grayscale: `filter: grayscale()` applied first.
- Radial blur: `filter: blur()` with inverted radial mask (sharp center, blurred edges).
- Reuses `ChromaticAberrationFilter` and `GrainFilter` from existing `svg-filters.tsx`.
- Flicker: overlay `<div>` with `opacity: seededNoise(frame, seed) * flicker`.
- **Key difference from AnalogTreatment:** No posterize time, no camera shake, no paper textures. This normalizes visual quality; AnalogTreatment adds analog aesthetic. Users compose both if needed.

---

### 5. LightLeak

Additive blend light leak overlay for organic discoloration. Source: sACZlG7z35Q ("light leak texture... blend mode to add... just a little bit of discoloration").

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string \| null` | `null` | Light leak texture path via `staticFile()`. Null = procedural gradient fallback. |
| `blendMode` | `string` | `'screen'` | CSS blend mode (AE `add` → CSS `screen`) |
| `opacity` | `number` | `0.25` | Overlay opacity |
| `animate` | `boolean` | `true` | Slowly drift texture position |
| `driftSpeed` | `number` | `0.5` | Pixels per frame of drift |
| `driftAngle` | `number` | `30` | Drift direction in degrees |
| `enterDuration` | `number \| null` | `null` | Frames to fade in. Null = already visible. |
| `exitDuration` | `number \| null` | `null` | Frames to fade out. Null = stays. |
| `delay` | `number` | `0` | Start frame offset |
| `duration` | `number` | `60` | Total duration in frames (needed by timing utility to calculate exit events) |
| `seed` | `number` | `0` | Noise seed for drift variation |
| `className` | `string` | `''` | CSS class pass-through |
| `style` | `CSSProperties` | `{}` | Style pass-through |

**Implementation:**

- With `src`: `<Img>` element with texture, blended via `mix-blend-mode`. Absolutely positioned over parent.
- Without `src`: procedural radial CSS gradient (warm amber → transparent) simulating a basic light leak.
- Drift: `transform: translate()` shifts position using `frame * driftSpeed` at the given angle.
- Enter/exit: opacity interpolated from 0 to target over duration. Exit starts at `delay + duration - exitDuration`.

---

### 6. Article3D

Standalone CSS perspective transforms with animated swivel/tilt. Source: LJcAPKDVhqc ("Apply the basic 3D effect... animate swivel and tilt... that dynamic rotating look").

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `startSwivel` | `number` | `0` | Initial Y-axis rotation (degrees) |
| `endSwivel` | `number` | `15` | Final Y-axis rotation |
| `startTilt` | `number` | `0` | Initial X-axis rotation (degrees) |
| `endTilt` | `number` | `-5` | Final X-axis rotation |
| `perspective` | `number` | `1200` | CSS perspective distance (px) |
| `startScale` | `number` | `1` | Initial scale |
| `endScale` | `number` | `1.05` | Final scale |
| `duration` | `number` | `60` | Animation duration in frames |
| `delay` | `number` | `0` | Start frame offset |
| `easing` | `EasingFunction` | `Easing.inOut(Easing.quad)` | Animation easing |
| `shadow` | `boolean` | `true` | Dynamic drop shadow shifting with rotation |
| `children` | `ReactNode` | — | Content to rotate |
| `className` | `string` | `''` | CSS class pass-through |
| `style` | `CSSProperties` | `{}` | Style pass-through |

**Implementation:**

- Outer `<div>` with `perspective`. Inner `<div>` with animated `transform: rotateY(swivel) rotateX(tilt) scale(s)`.
- All values interpolated start→end over duration via `interpolate()` with easing.
- Shadow: `filter: drop-shadow()` with offset calculated from rotation angle.
- Composes with ArticleZoom: `<Article3D><ArticleZoom /></Article3D>`.
- Composes with AnalogTreatment for posterized 3D movement.

---

## Recipe Examples

| Example | File | Components | Duration | Description |
|---|---|---|---|---|
| `TitleCardReveal` | `examples/TitleCardReveal.tsx` | AnalogTreatment + GridBackground + TypewriterReveal + TextHighlighter | 150 frames (5s) | Grid fades in → text typewriters on → highlight sweeps key word |
| `ArchivalMontage` | `examples/ArchivalMontage.tsx` | FootageHomogenizer + FocusPull + Article3D + LightLeak | 180 frames (6s) | Three mismatched sources normalized, FocusPull transitions, Article3D on final, LightLeak over all |

---

## File Structure (additions to v0.1.0)

```
src/
├── components/
│   ├── TypewriterReveal.tsx    # NEW
│   ├── GridBackground.tsx      # NEW
│   ├── FocusPull.tsx           # NEW
│   ├── FootageHomogenizer.tsx  # NEW
│   ├── LightLeak.tsx           # NEW
│   └── Article3D.tsx           # NEW
├── utils/
│   └── timings.ts              # NEW — VoxEvent type + 6 timing functions
├── index.ts                    # MODIFIED — add new exports
├── Root.tsx                    # MODIFIED — add 6 test compositions + 2 recipe compositions
examples/
├── TitleCardReveal.tsx         # NEW
└── ArchivalMontage.tsx         # NEW
```

## Exports (additions to index.ts)

```typescript
// Components
export { TypewriterReveal } from './components/TypewriterReveal';
export { GridBackground } from './components/GridBackground';
export { FocusPull } from './components/FocusPull';
export { FootageHomogenizer } from './components/FootageHomogenizer';
export { LightLeak } from './components/LightLeak';
export { Article3D } from './components/Article3D';

// Types
export type { TypewriterRevealProps } from './components/TypewriterReveal';
export type { GridBackgroundProps } from './components/GridBackground';
export type { FocusPullProps } from './components/FocusPull';
export type { FootageHomogenizerProps } from './components/FootageHomogenizer';
export type { LightLeakProps } from './components/LightLeak';
export type { Article3DProps } from './components/Article3D';

// Timing utilities
export type { VoxEvent } from './utils/timings';
export {
  getTypewriterTimings,
  getGridTimings,
  getFocusPullTimings,
  getHomogenizerTimings,
  getLightLeakTimings,
  getArticle3DTimings,
} from './utils/timings';
```

---

## Known Gaps from v0.1.0

- **className/style pass-through**: AnalogTreatment has className/style props, but ArticleZoom, TextHighlighter, HandDrawnReveal, and TextMatchCut do not. All v0.2.0 components include them. Adding className/style to the 4 v0.1.0 components is deferred to a separate patch (not part of this spec).

---

## Build Order

All components are independent. Build order optimizes for shared infrastructure first:

1. `src/utils/timings.ts` — VoxEvent type + all 6 timing functions
2. `src/components/TypewriterReveal.tsx` + test composition
3. `src/components/GridBackground.tsx` + test composition
4. `src/components/FocusPull.tsx` + test composition
5. `src/components/FootageHomogenizer.tsx` + test composition
6. `src/components/LightLeak.tsx` + test composition
7. `src/components/Article3D.tsx` + test composition
8. `examples/TitleCardReveal.tsx` + recipe composition
9. `examples/ArchivalMontage.tsx` + recipe composition
10. Update `src/index.ts` with all new exports
11. Update `src/Root.tsx` with all new compositions
12. Update `CHANGELOG.md` with full v0.2.0 entry
13. Type check (`npx tsc --noEmit`)

---

## Success Criteria

- All 6 new components render correctly in Remotion Studio
- All timing utility functions return correct frame numbers matching visual events
- Components compose cleanly with v0.1.0 components (especially AnalogTreatment and OffsetGroup)
- No new dependencies — everything is CSS, SVG, and React
- All component prop types exported from index.ts
- CHANGELOG.md contains full v0.2.0 entry with every component, prop, and utility documented
- `npx tsc --noEmit` passes clean
