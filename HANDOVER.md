# Handover — Vox Remotion Elements v0.1.0

## Resume Prompt

Copy this into a new conversation to continue working on the project:

---

**Resume working on the Vox Remotion Elements project.**

Read these files in order:
1. `~/Projects/vox-remotion-elements/PROJECT.md` — full project overview, file structure, components, commands
2. `~/Projects/vox-remotion-elements/CHANGELOG.md` — what's been built, all bug fixes applied
3. `~/Projects/vox-remotion-elements/docs/superpowers/specs/2026-04-01-vox-remotion-elements-design.md` — the design spec (rev 2)

The v0.1.0 core is complete with 6 components (AnalogTreatment, TextHighlighter, HandDrawnReveal, OffsetGroup, ArticleZoom, TextMatchCut), 3 utils, theme, context, 5 SVG presets, and 3 recipe examples. All type-check clean. Repo is live at https://github.com/NulightJens/vox-remotion-elements.

**Research transcripts** from 6 YouTube tutorials on Vox editing techniques (~22K words) are at `~/Projects/vox-remotion-elements/research/transcripts/`. These contain the source material for all techniques — read them when designing new effects.

**Rendered showcase videos** are at `~/Projects/vox-remotion-elements/out/` (9 MP4s: 6 component tests + 3 recipe examples).

**What's next — effects to consider for v0.2.0:**

From the transcripts, these techniques were identified but NOT yet built:

- **Footage Homogenization** — shared B&W + grain + blur treatment for mixed source clips (makes mismatched footage cohesive)
- **Focus Pull Transitions** — blur cycling between scenes (Gaussian 15→0)
- **Grid/Graph Paper Background** — masked graph paper overlay with wiggle, 30% opacity
- **Screen Emulation (full)** — current ArticleZoom has basic scan lines, but full Vox screen treatment includes Venetian blinds, CC Ball Action pixelation, exposure flicker expression, and heavy grain
- **Collage Intro Sequence** — image sequences with music-driven pacing, character cutouts, title cards (the full Vox opener pattern)
- **3D Article Movement** — Basic 3D rotation on article screenshots (swivel + tilt animation)
- **Character Blink/Animation** — masked character cutouts with hat bounce, pupil movement, blink frames
- **Typewriter Text Reveal** — letter-by-letter text appearance (used in Vox title cards)
- **Offset Callout Lines** — dual-color callout lines with yellow-then-black sequential reveal (HandDrawnReveal has colorOffset, but this is a higher-level composition pattern)
- **Light Leak Overlay** — additive blend light leak texture for organic discoloration

The Claude Code skill (`~/.claude/skills/vox-editing/SKILL.md`) is planned as post-v1 — write it once the component APIs are validated through real usage.

---

## Current State Summary

| Aspect | Status |
|--------|--------|
| 6 core components | Built, type-checked, rendered |
| 3 recipe examples | Built, rendered to MP4 |
| SVG presets | 5 paths (arrows, circle, underline, bracket) |
| Bundled textures | Null stubs — components use procedural grain |
| npm publishable | Yes (needs `npm publish` when ready) |
| GitHub | https://github.com/NulightJens/vox-remotion-elements |
| Claude Code skill | Not yet built (post-v1) |
| Content-autopilot integration | Not yet connected |

## Known Limitations

1. **Textures are procedural only** — no real paper/halftone textures bundled yet. Components fall back to SVG feTurbulence grain. Real textures from texturelabs.org would improve the analog feel significantly.
2. **SVG presets are minimal** — only 5 paths. Real Vox productions use dozens of hand-drawn arrow, circle, and underline variants. The preset system supports adding more easily.
3. **No audio/SFX integration** — Vox uses typewriter clicks, shutter sounds, and riser SFX synced to visual events. Components don't emit timing markers for audio sync yet.
4. **TextMatchCut word alignment is manual** — users must provide pixel coordinates for each screenshot's word position. No automated detection.
5. **AnalogTreatment grain** is procedural and basic — real Vox uses scanned film grain overlays with much more organic character.
