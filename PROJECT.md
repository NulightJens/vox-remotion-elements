# Vox Remotion Elements — Project Overview

**Repo:** https://github.com/NulightJens/vox-remotion-elements
**Location:** `~/Projects/vox-remotion-elements/`
**Stack:** Remotion 4.0.421, React 19, TypeScript 5.7+
**Target:** 1080x1920 (9:16 vertical) at 30fps
**License:** MIT

## What This Is

A standalone npm package of composable Remotion components that bring Vox-style analog editing techniques to programmatic video. Vox's visual language is analog-first: screens feel like screens, paper feels like paper, nothing is sterile or purely digital. This library encodes that philosophy as React components.

## Components (12)

| Component | Purpose | Key Feature |
|-----------|---------|-------------|
| **AnalogTreatment** | Wrapper — full analog treatment stack | Posterize (12fps), grain, chromatic aberration, vignette, camera shake |
| **TextHighlighter** | Animated text highlight stroke | Multiply blend, roughen edges, sequential multi-line, background panel |
| **HandDrawnReveal** | SVG trim-path draw-on animation | pathLength="1" trick, color offset trails, preset library |
| **OffsetGroup** | Stagger utility for entrance timing | VoxOffsetContext, forward/reverse/random direction |
| **ArticleZoom** | Camera pan over source material | Scan lines, flicker, depth of field, screen tint |
| **TextMatchCut** | Rapid screenshot montage | Word alignment, 4-frame cuts, highlight after settle |

### v0.2.0

| Component | Purpose | Key Feature |
|-----------|---------|-------------|
| **TypewriterReveal** | Letter-by-letter text reveal | Vox title cards, optional cursor/roughness, SFX timing |
| **GridBackground** | Graph paper overlay with mask | Blob/rect/ellipse masks, wiggle, feathered edges |
| **FocusPull** | Blur cycling transition | Posterized or eased blur steps between scenes |
| **FootageHomogenizer** | Shared source treatment | B&W + grain + blur + flicker to normalize mixed clips |
| **LightLeak** | Additive light overlay | Drift animation, procedural fallback, fade in/out |
| **Article3D** | CSS perspective transforms | Animated swivel/tilt, dynamic shadow |

## Utilities

| File | Exports |
|------|---------|
| `src/utils/posterize.ts` | `posterizeFrame(frame, compositionFps, targetFps)` |
| `src/utils/noise.ts` | `seededNoise(frame, seed)`, `wiggle(frame, freq, amp, fps, seed)` |
| `src/utils/svg-filters.tsx` | `ChromaticAberrationFilter`, `RoughenEdgesFilter`, `GrainFilter` |
| `src/utils/timings.ts` | `VoxEvent`, `getTypewriterTimings`, `getGridTimings`, `getFocusPullTimings`, `getHomogenizerTimings`, `getLightLeakTimings`, `getArticle3DTimings` |

## Theme & Context

| File | Exports |
|------|---------|
| `src/theme.ts` | `VoxTheme` — colors, fonts (Balto/DM Sans fallback), easings, treatment defaults |
| `src/context.ts` | `VoxOffsetContext`, `useVoxDelay()` hook |

## Presets (5 SVG paths)

`arrow-curly`, `arrow-straight`, `circle`, `underline`, `bracket` — in `src/presets/`

## Recipe Examples (5)

### v0.1.0

| Example | Components Used | Duration |
|---------|----------------|----------|
| `ArticleReveal` | AnalogTreatment + ArticleZoom + TextHighlighter + HandDrawnReveal | 120 frames (4s) |
| `SourceMontage` | AnalogTreatment + TextMatchCut + TextHighlighter | 120 frames (4s) |
| `AnnotatedExplainer` | AnalogTreatment + OffsetGroup + TextHighlighter + HandDrawnReveal | 150 frames (5s) |

### v0.2.0

| Example | Components Used | Duration |
|---------|----------------|----------|
| `TitleCardReveal` | AnalogTreatment + GridBackground + TypewriterReveal + TextHighlighter | 150 frames (5s) |
| `ArchivalMontage` | FootageHomogenizer + FocusPull + Article3D + LightLeak | 180 frames (6s) |

## File Structure

```
src/
├── index.ts                    # Public API exports (all components, types, utils, presets)
├── entry.ts                    # Remotion Studio entry
├── Root.tsx                    # 9 compositions (6 tests + 3 examples) in Folders
├── theme.ts                    # VoxTheme design tokens
├── context.ts                  # VoxOffsetContext + useVoxDelay()
├── components/
│   ├── AnalogTreatment.tsx
│   ├── TextHighlighter.tsx
│   ├── HandDrawnReveal.tsx
│   ├── OffsetGroup.tsx
│   ├── ArticleZoom.tsx
│   ├── TextMatchCut.tsx
│   ├── TypewriterReveal.tsx      # v0.2.0
│   ├── GridBackground.tsx        # v0.2.0
│   ├── FocusPull.tsx             # v0.2.0
│   ├── FootageHomogenizer.tsx    # v0.2.0
│   ├── LightLeak.tsx            # v0.2.0
│   └── Article3D.tsx            # v0.2.0
├── utils/
│   ├── posterize.ts
│   ├── noise.ts
│   ├── svg-filters.tsx
│   └── timings.ts                # v0.2.0 — SFX sync utilities
├── presets/
│   ├── index.ts
│   ├── arrows.ts
│   ├── circles.ts
│   └── underlines.ts
└── assets/
    └── textures.ts             # Null stubs — components fall back to procedural grain
examples/
├── ArticleReveal.tsx
├── SourceMontage.tsx
├── AnnotatedExplainer.tsx
├── TitleCardReveal.tsx           # v0.2.0
└── ArchivalMontage.tsx           # v0.2.0
```

## Commands

```bash
npx remotion studio src/entry.ts    # Open Remotion Studio
npx tsc --noEmit                    # Type check
npx remotion render src/entry.ts <CompositionId> out/<name>.mp4  # Render
```

## Research

Tutorial transcripts (~22,000 words) from 6 YouTube videos on Vox editing techniques:
`~/Projects/vox-remotion-elements/research/transcripts/`

| File | Video | Key Techniques |
|------|-------|---------------|
| `sACZlG7z35Q.md` | How Vox Builds Their Animations in AE | Texture overlays, warm backgrounds, roughen edges, halftone, chromatic aberration, vignetting, posterize time, screen emulation, footage homogenization |
| `4OzFNpnXcZg.md` | How to Design & Animate the Vox Style | Artboard layout, hand-drawn elements, offset keyframes, posterized wiggle, focus pulls, callout lines with color offset |
| `a0T3kcizcOY.md` | Vox Highlighter Effect in AE | Stroke on mask path, multiply blend, brush hardness ~85%, sequential mask animation, 3D camera + depth of field |
| `8WJYHEkr0Ac.md` | Vox Style News Article Animation (DaVinci) | Luma key headlines, paper texture overlay, highlight with displacement/noise, flicker |
| `GFbh6RuuFVA.md` | How to Make a Vox Style Intro (AE) | Image sequences, hand-drawn arrows/circles, character animations, music-driven pacing, collage layouts, grid backgrounds |
| `LJcAPKDVhqc.md` | Text Match Cut & Highlight Effect (Premiere) | 4-frame rapid cuts, word alignment, yellow highlight with darken blend + roughen edges |

## Specs & Plans

- v0.1.0 design spec: `docs/superpowers/specs/2026-04-01-vox-remotion-elements-design.md`
- v0.2.0 design spec: `docs/superpowers/specs/2026-04-01-vox-remotion-elements-v020-design.md`
- v0.1.0 implementation plan: `docs/superpowers/plans/2026-04-01-vox-remotion-elements.md`
