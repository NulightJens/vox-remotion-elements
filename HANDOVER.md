# Handover — Vox Remotion Elements v0.2.0

## Resume Prompt

Copy this into a new conversation to continue working on the project:

---

**Resume working on the Vox Remotion Elements project.**

Read these files in order:
1. `~/Projects/vox-remotion-elements/PROJECT.md` — full project overview, file structure, components, commands
2. `~/Projects/vox-remotion-elements/CHANGELOG.md` — what's been built, all bug fixes applied
3. `~/Projects/vox-remotion-elements/HANDOVER.md` — next effects list, known limitations
4. `~/Projects/vox-remotion-elements/docs/superpowers/specs/2026-04-01-vox-remotion-elements-v020-design.md` — the v0.2.0 design spec

The v0.2.0 release is complete with 12 total components (6 from v0.1.0 + 6 new), 4 utils (including SFX timing system), theme, context, 5 SVG presets, and 5 recipe examples. All type-check clean. Repo is live at https://github.com/NulightJens/vox-remotion-elements.

**Research transcripts** from 6 YouTube tutorials on Vox editing techniques (~22K words) are at `~/Projects/vox-remotion-elements/research/transcripts/`. These contain the source material for all techniques — read them when designing new effects.

**Rendered showcase videos** are at `~/Projects/vox-remotion-elements/out/`.

---

## Current State Summary

| Aspect | Status |
|--------|--------|
| 12 components (6 v0.1.0 + 6 v0.2.0) | Built, type-checked |
| 5 recipe examples | Built |
| SVG presets | 5 paths (arrows, circle, underline, bracket) |
| SFX timing system | VoxEvent type + 6 getTimings() functions |
| Bundled textures | Null stubs — components use procedural grain/gradients |
| npm publishable | Yes (needs `npm publish` when ready) |
| GitHub | https://github.com/NulightJens/vox-remotion-elements |
| Claude Code skill | Not yet built (post-v1) |
| Content-autopilot integration | Not yet connected |

## v0.1.0 Components

| Component | Purpose |
|-----------|---------|
| AnalogTreatment | Full analog treatment wrapper (posterize, grain, chromatic aberration, vignette, shake) |
| TextHighlighter | Animated highlight stroke with multiply blend |
| HandDrawnReveal | SVG trim-path draw-on animation |
| OffsetGroup | Stagger utility for entrance timing |
| ArticleZoom | Camera pan over source material with screen emulation |
| TextMatchCut | Rapid screenshot montage with word alignment |

## v0.2.0 Components

| Component | Purpose |
|-----------|---------|
| TypewriterReveal | Letter-by-letter text reveal with optional cursor/roughness |
| GridBackground | Graph paper overlay with blob/rect/ellipse masks + wiggle |
| FocusPull | Blur cycling transition wrapper |
| FootageHomogenizer | Shared B&W + grain + blur treatment for mixed clips |
| LightLeak | Additive blend overlay with drift animation |
| Article3D | CSS perspective transforms with animated swivel/tilt |

## What's Next — Effects to Consider for v0.3.0

From the transcripts, these techniques were identified but NOT yet built:

- **Screen Emulation (enhanced)** — current ArticleZoom has basic scan lines, but full Vox treatment includes CC Ball Action pixelation grid, enhanced flicker expression, and heavy grain
- **Collage Intro Sequence** — image sequences with music-driven pacing, character cutouts, title cards (the full Vox opener pattern). More of a recipe than a component.
- **Character Blink/Animation** — masked character cutouts with hat bounce, pupil movement, blink frames (very specialized, requires pre-masked assets)
- **Offset Callout Lines** — higher-level composition pattern using HandDrawnReveal's colorOffset with specific Vox-style timing
- **Paper Texture Displacement** — using paper texture as a displacement map for subtle organic movement across the entire composition
- **Image Sequence Transition** — pan-up position transitions between image sequences with null object controllers and music-driven pacing markers

The Claude Code skill (`~/.claude/skills/vox-editing/SKILL.md`) is planned as post-v1 — write it once the component APIs are validated through real usage.

## Known Limitations

1. **Textures are procedural only** — no real paper/halftone/light-leak textures bundled yet. Components fall back to SVG feTurbulence grain and CSS gradients. Real textures from texturelabs.org would improve the analog feel significantly.
2. **SVG presets are minimal** — only 5 paths. Real Vox productions use dozens of hand-drawn arrow, circle, and underline variants.
3. **No audio/SFX integration** — timing utilities provide frame markers, but no actual audio files are bundled. Users must supply their own SFX.
4. **TextMatchCut word alignment is manual** — users must provide pixel coordinates for each screenshot's word position.
5. **AnalogTreatment grain** is procedural and basic — real Vox uses scanned film grain overlays.
6. **v0.1.0 components lack className/style** — TextHighlighter, HandDrawnReveal, ArticleZoom, TextMatchCut don't have className/style pass-through (AnalogTreatment does). All v0.2.0 components include them.
7. **GridBackground mask is static** — the blob shape is generated once per seed; it doesn't animate/morph.
