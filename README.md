# vox-remotion-elements

Analog-style editing elements for Remotion. Inspired by Vox's signature visual treatment: posterized frame rates, hand-drawn annotations, textured grain, and chromatic aberration.

## Install

```bash
npm install vox-remotion-elements
```

Peer dependencies: `react >= 19`, `remotion >= 4`.

## Components

### AnalogTreatment

Wraps children with the full analog post-processing pipeline: posterized frame rate, film grain, chromatic aberration, vignette, warmth overlay, and camera shake.

```tsx
import { AnalogTreatment } from "vox-remotion-elements";

<AnalogTreatment fps={12} grain={0.15} vignette={0.3}>
  {children}
</AnalogTreatment>
```

### TextHighlighter

Animated marker-pen highlight that wipes across text. Supports single or multi-line with sequential reveal.

```tsx
import { TextHighlighter } from "vox-remotion-elements";

<TextHighlighter
  text={["Line one", "Line two"]}
  fontSize={48}
  sequential={true}
  color="#FFCC00"
  duration={20}
/>
```

### HandDrawnReveal

Animated SVG path drawing with roughened edges and optional color offset (shadow lead).

```tsx
import { HandDrawnReveal } from "vox-remotion-elements";

// Use a preset
<HandDrawnReveal preset="arrow-curly" width={200} height={200} duration={20} />

// Or supply a raw SVG path
<HandDrawnReveal svg="M 20 100 Q 100 20 180 100" width={200} height={120} />
```

### OffsetGroup

Staggers the entry timing of child elements using Remotion Sequences and the VoxOffsetContext.

```tsx
import { OffsetGroup, TextHighlighter } from "vox-remotion-elements";

<OffsetGroup stagger={5}>
  <TextHighlighter text="First" fontSize={40} duration={15} />
  <TextHighlighter text="Second" fontSize={40} duration={15} />
  <TextHighlighter text="Third" fontSize={40} duration={15} />
</OffsetGroup>
```

### ArticleZoom

Slow pan-and-zoom over a screenshot with scan lines, flicker, and depth-of-field blur.

```tsx
import { ArticleZoom } from "vox-remotion-elements";

<ArticleZoom
  src="https://example.com/screenshot.png"
  startPosition={{ x: 0, y: 10 }}
  endPosition={{ x: 0, y: -15 }}
  startScale={1.05}
  endScale={1.15}
  scanLines={true}
  flicker={0.04}
  duration={75}
/>
```

### TextMatchCut

Rapid-fire montage of screenshots with an optional highlighted word box, cut to a posterized frame rate.

```tsx
import { TextMatchCut } from "vox-remotion-elements";

<TextMatchCut
  screenshots={[
    { src: "https://example.com/1.png", wordPosition: "center" },
    { src: "https://example.com/2.png", wordPosition: "center" },
  ]}
  framesPerImage={4}
  highlightWord={true}
/>
```

## VoxTheme

All components reference a shared theme for consistent styling:

| Token | Value |
|-------|-------|
| `colors.warmWhite` | `#f5f0e8` |
| `colors.black` | `#1a1a1a` |
| `colors.yellow` | `#FFD700` |
| `colors.highlightYellow` | `#FFCC00` |
| `colors.red` | `#c0392b` |
| `fonts.headline` | `Balto` |
| `fonts.body` | `Sora` |
| `fonts.accent` | `Bebas Neue` |
| `treatment.posterizeFps` | `12` |
| `treatment.grain` | `0.15` |

Import and use directly:

```tsx
import { VoxTheme } from "vox-remotion-elements";

<TextHighlighter color={VoxTheme.colors.highlightYellow} />
```

## Presets

Hand-drawn SVG path presets for use with `HandDrawnReveal`:

| Preset | Description |
|--------|-------------|
| `arrow-curly` | Curly arrow with arrowhead |
| `arrow-straight` | Straight arrow with V arrowhead |
| `circle` | Hand-drawn circle (closed path) |
| `underline` | Wavy underline stroke |
| `bracket` | L-shaped bracket pair |

```tsx
<HandDrawnReveal preset="circle" width={250} height={250} duration={25} />
```

## Development

```bash
npm install
npm run studio    # Launch Remotion Studio
npm run build     # Type check (tsc --noEmit)
```

The studio loads `src/Root.tsx` which contains two folders:

- **Component-Tests** -- isolated test compositions for each component
- **Recipe-Examples** -- full recipe compositions combining multiple components

## License

MIT
