# Vox Remotion Elements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone npm package of 6 composable Remotion components that bring Vox-style analog editing techniques to video compositions.

**Architecture:** Component library with zero runtime dependencies — everything is React + CSS + SVG. Components work standalone or composed together. Procedural defaults with optional texture overrides. React context for inter-component communication (OffsetGroup stagger delays).

**Tech Stack:** Remotion 4.x, React 19, TypeScript 5.7+, SVG filters, CSS mix-blend-modes

**Spec:** `docs/superpowers/specs/2026-04-01-vox-remotion-elements-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Package config, peer deps (remotion, react), scripts |
| `tsconfig.json` | TypeScript config matching content-autopilot patterns |
| `src/index.ts` | Public API — re-exports all components, theme, context, presets |
| `src/theme.ts` | `VoxTheme` design tokens: colors, fonts, easings, treatment defaults |
| `src/context.ts` | `VoxOffsetContext` + `useVoxDelay()` hook |
| `src/utils/posterize.ts` | `posterizeFrame()` — frame stepping math |
| `src/utils/noise.ts` | `seededNoise()` — deterministic noise for shake/flicker |
| `src/utils/svg-filters.ts` | SVG filter definitions: chromatic aberration, roughen edges, grain |
| `src/components/AnalogTreatment.tsx` | Wrapper: posterize + grain + chromatic aberration + vignette + shake |
| `src/components/TextHighlighter.tsx` | Animated highlight stroke with multiply blend |
| `src/components/HandDrawnReveal.tsx` | SVG trim-path draw-on animation |
| `src/components/OffsetGroup.tsx` | Stagger utility wrapping children in offset `<Sequence>`s |
| `src/components/ArticleZoom.tsx` | Camera pan + screen emulation over source material |
| `src/components/TextMatchCut.tsx` | Rapid screenshot montage with word alignment |
| `src/presets/arrows.ts` | SVG path data for arrow presets |
| `src/presets/circles.ts` | SVG path data for wobbly circle presets |
| `src/presets/underlines.ts` | SVG path data for rough underline presets |
| `src/presets/index.ts` | Re-exports all presets as a lookup map |
| `src/assets/textures.ts` | Base64-encoded bundled texture data URIs |
| `examples/ArticleReveal.tsx` | Recipe composition: ArticleZoom + TextHighlighter + HandDrawnReveal |
| `examples/SourceMontage.tsx` | Recipe composition: TextMatchCut → TextHighlighter |
| `examples/AnnotatedExplainer.tsx` | Recipe composition: OffsetGroup + HandDrawnReveal + TextHighlighter |
| `src/Root.tsx` | Remotion Studio root registering example compositions |
| `src/entry.ts` | Remotion Studio entry point |
| `README.md` | Package usage docs |

---

### Task 1: Package Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/entry.ts`
- Create: `src/Root.tsx`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "vox-remotion-elements",
  "version": "0.1.0",
  "description": "Vox-style analog editing elements for Remotion",
  "main": "src/index.ts",
  "scripts": {
    "studio": "remotion studio src/entry.ts",
    "build": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "remotion": "^4.0.0"
  },
  "dependencies": {
    "@remotion/cli": "4.0.421",
    "@remotion/media": "4.0.421",
    "@remotion/studio": "4.0.421",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "remotion": "4.0.421"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "typescript": "^5.7.0"
  },
  "license": "MIT"
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "preserve",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src", "examples"]
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
dist/
out/
.DS_Store
*.log
```

- [ ] **Step 4: Create minimal Remotion entry point**

`src/entry.ts`:
```typescript
import { registerRoot } from "remotion";
import { Root } from "./Root";

registerRoot(Root);
```

`src/Root.tsx` (placeholder — will be populated with example compositions in Task 13):
```tsx
import { Composition } from "remotion";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Placeholder"
        component={() => <div style={{ background: '#f5f0e8', width: '100%', height: '100%' }} />}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
```

- [ ] **Step 5: Install dependencies and verify studio launches**

Run: `cd ~/Projects/vox-remotion-elements && npm install`
Expected: Clean install, no errors.

Run: `npx remotion studio src/entry.ts`
Expected: Remotion Studio opens with Placeholder composition.

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json .gitignore src/entry.ts src/Root.tsx package-lock.json
git commit -m "feat: scaffold Remotion package with studio entry point"
```

---

### Task 2: Utility — posterize.ts

**Files:**
- Create: `src/utils/posterize.ts`

- [ ] **Step 1: Create posterize utility**

```typescript
/**
 * Steps frame values to simulate lower frame rates (cutting on twos/threes).
 * Core to the Vox analog feel — makes motion look hand-crafted rather than smooth.
 */
export function posterizeFrame(
  frame: number,
  compositionFps: number,
  targetFps: number
): number {
  if (targetFps >= compositionFps) {
    if (targetFps > compositionFps) {
      console.warn(
        `[vox] posterize targetFps (${targetFps}) exceeds composition fps (${compositionFps}). No stepping applied.`
      );
    }
    return frame;
  }
  const step = Math.round(compositionFps / targetFps);
  return Math.floor(frame / step) * step;
}
```

- [ ] **Step 2: Verify build**

Run: `cd ~/Projects/vox-remotion-elements && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/utils/posterize.ts
git commit -m "feat: add posterizeFrame utility for frame rate stepping"
```

---

### Task 3: Utility — noise.ts

**Files:**
- Create: `src/utils/noise.ts`

- [ ] **Step 1: Create deterministic noise utility**

Uses a simple hash-based PRNG seeded by frame + seed offset. Produces consistent values per frame for reproducible Remotion renders.

```typescript
/**
 * Deterministic noise function for camera shake, flicker, and wiggle effects.
 * Same (frame, seed) always produces the same output — critical for Remotion's
 * frame-by-frame rendering model.
 *
 * Returns a value between -1 and 1.
 */
export function seededNoise(frame: number, seed: number = 0): number {
  const n = frame + seed * 9999;
  // Simple hash — fast and deterministic
  const x = Math.sin(n * 12.9898 + n * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/**
 * Generate a wiggle value that changes at a given frequency.
 * Equivalent to AE's wiggle(frequency, amplitude) but deterministic.
 *
 * @param frame - Current frame number
 * @param frequency - Changes per second (at 30fps, frequency=2 means change every 15 frames)
 * @param amplitude - Maximum displacement in pixels
 * @param fps - Composition frame rate
 * @param seed - Unique seed for this instance
 */
export function wiggle(
  frame: number,
  frequency: number,
  amplitude: number,
  fps: number,
  seed: number = 0
): number {
  const framesPerChange = Math.max(1, Math.round(fps / frequency));
  const steppedFrame = Math.floor(frame / framesPerChange);
  return seededNoise(steppedFrame, seed) * amplitude;
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/utils/noise.ts
git commit -m "feat: add deterministic noise and wiggle utilities"
```

---

### Task 4: Utility — svg-filters.ts

**Files:**
- Create: `src/utils/svg-filters.ts`

- [ ] **Step 1: Create SVG filter definitions**

These are React components that render `<svg>` definitions to the DOM once. Components reference them by `filter: url(#filterId)`.

```tsx
import React from "react";

/**
 * Chromatic aberration as a single SVG filter.
 * Isolates R/G/B channels via feColorMatrix, offsets them, and recomposites.
 * Applied as: style={{ filter: `url(#${id})` }}
 */
export const ChromaticAberrationFilter: React.FC<{
  id?: string;
  offset?: number;
}> = ({ id = "vox-chromatic-aberration", offset = 0.8 }) => (
  <svg
    style={{ position: "absolute", width: 0, height: 0 }}
    aria-hidden="true"
  >
    <defs>
      <filter id={id} colorInterpolationFilters="sRGB">
        {/* Extract red channel */}
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
          in="SourceGraphic"
          result="red"
        />
        {/* Extract green channel (no offset — serves as anchor) */}
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
          in="SourceGraphic"
          result="green"
        />
        {/* Extract blue channel */}
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
          in="SourceGraphic"
          result="blue"
        />
        {/* Offset red left */}
        <feOffset in="red" dx={-offset} dy={0} result="redShifted" />
        {/* Offset blue right */}
        <feOffset in="blue" dx={offset} dy={0} result="blueShifted" />
        {/* Composite: red + green */}
        <feComposite
          in="redShifted"
          in2="green"
          operator="arithmetic"
          k1={0}
          k2={1}
          k3={1}
          k4={0}
          result="rg"
        />
        {/* Composite: (red + green) + blue */}
        <feComposite
          in="rg"
          in2="blueShifted"
          operator="arithmetic"
          k1={0}
          k2={1}
          k3={1}
          k4={0}
        />
      </filter>
    </defs>
  </svg>
);

/**
 * Roughen edges filter — adds organic imperfection to shapes.
 * Used by TextHighlighter and HandDrawnReveal for the hand-drawn feel.
 * Applied as: style={{ filter: `url(#${id})` }}
 */
export const RoughenEdgesFilter: React.FC<{
  id?: string;
  roughness?: number;
  baseFrequency?: number;
}> = ({
  id = "vox-roughen-edges",
  roughness = 3,
  baseFrequency = 0.04,
}) => (
  <svg
    style={{ position: "absolute", width: 0, height: 0 }}
    aria-hidden="true"
  >
    <defs>
      <filter id={id}>
        <feTurbulence
          type="turbulence"
          baseFrequency={baseFrequency}
          numOctaves={4}
          seed={1}
          result="turbulence"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="turbulence"
          scale={roughness}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);

/**
 * Procedural grain overlay filter.
 * Used as fallback when no paper texture is provided.
 * Applied as: style={{ filter: `url(#${id})` }}
 */
export const GrainFilter: React.FC<{
  id?: string;
  intensity?: number;
}> = ({ id = "vox-grain", intensity = 0.15 }) => (
  <svg
    style={{ position: "absolute", width: 0, height: 0 }}
    aria-hidden="true"
  >
    <defs>
      <filter id={id}>
        <feTurbulence
          type="fractal"
          baseFrequency={0.65}
          numOctaves={3}
          result="grain"
        />
        <feColorMatrix
          type="saturate"
          values="0"
          in="grain"
          result="grainBW"
        />
        <feBlend in="SourceGraphic" in2="grainBW" mode="overlay" />
      </filter>
    </defs>
  </svg>
);
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/utils/svg-filters.ts
git commit -m "feat: add SVG filter definitions for chromatic aberration, roughen edges, grain"
```

---

### Task 5: Theme + Context

**Files:**
- Create: `src/theme.ts`
- Create: `src/context.ts`

- [ ] **Step 1: Create VoxTheme**

```typescript
import { Easing } from "remotion";

export const VoxTheme = {
  colors: {
    warmWhite: "#f5f0e8",
    warmGray: "#e8e0d4",
    black: "#1a1a1a",
    yellow: "#FFD700",
    highlightYellow: "#FFCC00",
    red: "#c0392b",
    deepGray: "#272727",
  },
  fonts: {
    headline: "Balto",
    headlineFallback: "DM Sans",
    body: "Sora",
    accent: "Bebas Neue",
  },
  easing: {
    highlightStroke: Easing.out(Easing.cubic),
    cameraPan: Easing.inOut(Easing.quad),
    trimPathReveal: Easing.out(Easing.quad),
    elementEntrance: Easing.out(Easing.back(1.2)),
    elementExit: Easing.in(Easing.quad),
  },
  treatment: {
    posterizeFps: 12,
    grain: 0.15,
    chromaticAberration: 0.8,
    vignette: 0.3,
    cameraShake: { frequency: 2, amplitude: 2 },
    roughenEdges: 3,
    brushHardness: 0.85,
  },
} as const;
```

- [ ] **Step 2: Create VoxOffsetContext and useVoxDelay hook**

```typescript
import { createContext, useContext } from "react";

type VoxOffsetValue = {
  delay: number;
};

export const VoxOffsetContext = createContext<VoxOffsetValue>({ delay: 0 });

/**
 * Hook for child components to consume the stagger delay from OffsetGroup.
 * Returns the delay in frames that this child should add to its animations.
 *
 * Usage inside a Vox component:
 *   const { delay: offsetDelay } = useVoxDelay();
 *   const totalDelay = props.delay + offsetDelay;
 */
export function useVoxDelay(): VoxOffsetValue {
  return useContext(VoxOffsetContext);
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/theme.ts src/context.ts
git commit -m "feat: add VoxTheme design tokens, easings, and VoxOffsetContext"
```

---

### Task 6: AnalogTreatment Component

**Files:**
- Create: `src/components/AnalogTreatment.tsx`

- [ ] **Step 1: Create AnalogTreatment**

```tsx
import React, { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { posterizeFrame } from "../utils/posterize";
import { wiggle } from "../utils/noise";
import {
  ChromaticAberrationFilter,
  GrainFilter,
} from "../utils/svg-filters";
import { VoxTheme } from "../theme";

type AnalogTreatmentProps = {
  fps?: number;
  grain?: number;
  chromaticAberration?: number;
  vignette?: number;
  warmth?: string;
  paperTexture?: string | null;
  halftoneTexture?: string | null;
  cameraShake?: { frequency: number; amplitude: number };
  seed?: number;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
};

export const AnalogTreatment: React.FC<AnalogTreatmentProps> = ({
  fps = VoxTheme.treatment.posterizeFps,
  grain = VoxTheme.treatment.grain,
  chromaticAberration = VoxTheme.treatment.chromaticAberration,
  vignette = VoxTheme.treatment.vignette,
  warmth = VoxTheme.colors.warmWhite,
  paperTexture = null,
  halftoneTexture = null,
  cameraShake = VoxTheme.treatment.cameraShake,
  seed = 0,
  className = "",
  style = {},
  children,
}) => {
  const rawFrame = useCurrentFrame();
  const { fps: compositionFps } = useVideoConfig();
  const frame = posterizeFrame(rawFrame, compositionFps, fps);

  // Camera shake offsets
  const shakeX = wiggle(frame, cameraShake.frequency, cameraShake.amplitude, compositionFps, seed);
  const shakeY = wiggle(frame, cameraShake.frequency, cameraShake.amplitude, compositionFps, seed + 7777);

  // Unique filter IDs to avoid collisions when multiple AnalogTreatments exist
  const chromaticId = `vox-chromatic-${seed}`;
  const grainId = `vox-grain-${seed}`;

  return (
    <AbsoluteFill className={className} style={style}>
      {/* SVG filter definitions */}
      {chromaticAberration > 0 && (
        <ChromaticAberrationFilter id={chromaticId} offset={chromaticAberration} />
      )}
      {!paperTexture && grain > 0 && <GrainFilter id={grainId} />}

      {/* Warm background — never pure white */}
      <AbsoluteFill style={{ backgroundColor: warmth }} />

      {/* Paper texture overlay (opt-in) */}
      {paperTexture && (
        <AbsoluteFill
          style={{
            backgroundImage: `url(${paperTexture})`,
            backgroundSize: "cover",
            mixBlendMode: "overlay",
            opacity: grain > 0 ? grain * 3 : 0.4,
          }}
        />
      )}

      {/* Halftone texture overlay (opt-in) */}
      {halftoneTexture && (
        <AbsoluteFill
          style={{
            backgroundImage: `url(${halftoneTexture})`,
            backgroundSize: "cover",
            mixBlendMode: "overlay",
            opacity: 0.3,
          }}
        />
      )}

      {/* Content with chromatic aberration + camera shake */}
      <AbsoluteFill
        style={{
          filter: chromaticAberration > 0 ? `url(#${chromaticId})` : undefined,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Procedural grain overlay (when no paper texture) */}
      {!paperTexture && grain > 0 && (
        <AbsoluteFill
          style={{
            filter: `url(#${grainId})`,
            opacity: grain,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Vignette overlay */}
      {vignette > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${vignette}) 100%)`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Add a quick test composition to Root.tsx**

Update `src/Root.tsx`:
```tsx
import { Composition } from "remotion";
import { AnalogTreatment } from "./components/AnalogTreatment";

const AnalogTest: React.FC = () => (
  <AnalogTreatment>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        fontSize: 72,
        fontWeight: "bold",
        color: "#1a1a1a",
      }}
    >
      Analog Treatment Test
    </div>
  </AnalogTreatment>
);

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="AnalogTest"
        component={AnalogTest}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
```

- [ ] **Step 4: Visual verification in Remotion Studio**

Run: `npx remotion studio src/entry.ts`
Expected: AnalogTest composition shows warm-tinted background with subtle grain, chromatic aberration, vignette, and choppy frame stepping.

- [ ] **Step 5: Commit**

```bash
git add src/components/AnalogTreatment.tsx src/Root.tsx
git commit -m "feat: add AnalogTreatment wrapper with posterize, grain, chromatic aberration, vignette, shake"
```

---

### Task 7: TextHighlighter Component

**Files:**
- Create: `src/components/TextHighlighter.tsx`

- [ ] **Step 1: Create TextHighlighter**

```tsx
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { RoughenEdgesFilter } from "../utils/svg-filters";
import { VoxTheme } from "../theme";
import { useVoxDelay } from "../context";

type TextHighlighterProps = {
  text: string | string[];
  color?: string;
  blendMode?: string;
  brushHardness?: number;
  strokeWidth?: number | "auto";
  delay?: number;
  duration?: number;
  roughness?: number;
  sequential?: boolean;
  fontSize?: number;
  fontFamily?: string;
};

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  color = VoxTheme.colors.yellow,
  blendMode = "multiply",
  brushHardness = VoxTheme.treatment.brushHardness,
  strokeWidth = "auto",
  delay = 0,
  duration = 20,
  roughness = VoxTheme.treatment.roughenEdges,
  sequential = true,
  fontSize = 42,
  fontFamily = VoxTheme.fonts.body,
}) => {
  const frame = useCurrentFrame();
  const { delay: offsetDelay } = useVoxDelay();
  const totalDelay = delay + offsetDelay;

  const lines = Array.isArray(text) ? text : [text];
  const lineHeight = fontSize * 1.4;
  const highlightHeight =
    strokeWidth === "auto" ? fontSize * 1.2 : strokeWidth;

  // Displacement scale: inverse of brush hardness
  // 0.85 hardness → ~2.25 displacement (subtle imperfection)
  // 0.5 hardness → ~7.5 displacement (very rough)
  const displacementScale = roughness * (1 - brushHardness + 0.5);
  const filterId = `vox-highlight-rough-${Math.round(brushHardness * 100)}`;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <RoughenEdgesFilter
        id={filterId}
        roughness={displacementScale}
        baseFrequency={0.04}
      />

      {lines.map((line, index) => {
        // Sequential: each line starts after the previous finishes
        // Parallel: all lines start at the same time
        const lineDelay = sequential
          ? totalDelay + index * duration
          : totalDelay;

        const progress = interpolate(
          frame,
          [lineDelay, lineDelay + duration],
          [0, 100],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: VoxTheme.easing.highlightStroke,
          }
        );

        const highlightTop =
          index * lineHeight + (lineHeight - highlightHeight) / 2;

        return (
          <div key={index} style={{ position: "relative" }}>
            {/* Highlight bar behind text */}
            <svg
              style={{
                position: "absolute",
                top: highlightTop,
                left: 0,
                width: "100%",
                height: highlightHeight,
                overflow: "visible",
                mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"],
                filter: roughness > 0 ? `url(#${filterId})` : undefined,
              }}
            >
              <defs>
                <clipPath id={`vox-highlight-clip-${index}-${totalDelay}`}>
                  <rect
                    x={0}
                    y={0}
                    width={`${progress}%`}
                    height={highlightHeight}
                  />
                </clipPath>
              </defs>
              <rect
                x={0}
                y={0}
                width="100%"
                height={highlightHeight}
                fill={color}
                clipPath={`url(#vox-highlight-clip-${index}-${totalDelay})`}
              />
            </svg>

            {/* Text on top */}
            <div
              style={{
                position: "relative",
                fontSize,
                fontFamily,
                fontWeight: 600,
                lineHeight: `${lineHeight}px`,
                color: VoxTheme.colors.black,
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: Add test composition to Root.tsx**

Add to `src/Root.tsx` imports and compositions:
```tsx
import { TextHighlighter } from "./components/TextHighlighter";

const HighlighterTest: React.FC = () => (
  <AnalogTreatment>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: 80,
      }}
    >
      <TextHighlighter text="Single Line Highlight" fontSize={64} />
      <TextHighlighter
        text={["First Line", "Second Line"]}
        fontSize={52}
        sequential={true}
        delay={25}
        color="#FFCC00"
      />
    </div>
  </AnalogTreatment>
);
```

Add composition:
```tsx
<Composition
  id="HighlighterTest"
  component={HighlighterTest}
  durationInFrames={120}
  fps={30}
  width={1080}
  height={1920}
/>
```

- [ ] **Step 3: Visual verification in Remotion Studio**

Run: `npx remotion studio src/entry.ts`
Expected: HighlighterTest shows two highlight groups — single line sweeps first, then two-line sequential highlight with rough edges and multiply blend.

- [ ] **Step 4: Commit**

```bash
git add src/components/TextHighlighter.tsx src/Root.tsx
git commit -m "feat: add TextHighlighter with animated stroke, multiply blend, roughen edges"
```

---

### Task 8: HandDrawnReveal Component

**Files:**
- Create: `src/components/HandDrawnReveal.tsx`

- [ ] **Step 1: Create HandDrawnReveal**

```tsx
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { RoughenEdgesFilter } from "../utils/svg-filters";
import { VoxTheme } from "../theme";
import { useVoxDelay } from "../context";
import { presetPaths } from "../presets";

type HandDrawnRevealProps = {
  svg?: string | null;
  preset?: keyof typeof presetPaths | null;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
  colorOffset?: { color: string; leadFrames: number } | null;
  roughness?: number;
  cap?: "round" | "butt";
  fill?: string | null;
  width?: number;
  height?: number;
};

export const HandDrawnReveal: React.FC<HandDrawnRevealProps> = ({
  svg = null,
  preset = null,
  color = VoxTheme.colors.black,
  strokeWidth = 3,
  duration = 20,
  delay = 0,
  colorOffset = null,
  roughness = 2,
  cap = "round",
  fill = null,
  width = 200,
  height = 200,
}) => {
  const frame = useCurrentFrame();
  const { delay: offsetDelay } = useVoxDelay();
  const totalDelay = delay + offsetDelay;

  const pathData = preset ? presetPaths[preset] : svg;
  if (!pathData) return null;

  const filterId = `vox-drawn-rough-${roughness}`;

  // Main stroke progress
  const mainProgress = interpolate(
    frame,
    [totalDelay, totalDelay + duration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: VoxTheme.easing.trimPathReveal,
    }
  );

  // Color offset stroke progress (leads the main stroke)
  const offsetProgress = colorOffset
    ? interpolate(
        frame,
        [
          totalDelay - colorOffset.leadFrames,
          totalDelay - colorOffset.leadFrames + duration,
        ],
        [1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: VoxTheme.easing.trimPathReveal,
        }
      )
    : 1;

  return (
    <div style={{ position: "relative", width, height }}>
      {roughness > 0 && (
        <RoughenEdgesFilter id={filterId} roughness={roughness} />
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{
          overflow: "visible",
          filter: roughness > 0 ? `url(#${filterId})` : undefined,
        }}
      >
        {/* Color offset path (behind main) */}
        {colorOffset && (
          <path
            d={pathData}
            fill="none"
            stroke={colorOffset.color}
            strokeWidth={strokeWidth}
            strokeLinecap={cap}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={offsetProgress}
          />
        )}

        {/* Main path */}
        <path
          d={pathData}
          fill={fill ?? "none"}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap={cap}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={mainProgress}
        />
      </svg>
    </div>
  );
};
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: Will fail because `presetPaths` doesn't exist yet. That's expected — we create it in Task 11. For now, create a temporary stub.

Create `src/presets/index.ts`:
```typescript
// Temporary stub — populated in Task 11
export const presetPaths: Record<string, string> = {};
```

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Add test composition to Root.tsx**

Add to imports and compositions:
```tsx
import { HandDrawnReveal } from "./components/HandDrawnReveal";

const HandDrawnTest: React.FC = () => (
  <AnalogTreatment>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: 60,
      }}
    >
      {/* Simple arrow with custom SVG path */}
      <HandDrawnReveal
        svg="M 20 100 Q 100 20 180 100"
        width={200}
        height={120}
        color={VoxTheme.colors.black}
        strokeWidth={4}
        duration={25}
      />
      {/* Arrow with yellow color offset */}
      <HandDrawnReveal
        svg="M 10 60 C 50 10 150 10 190 60"
        width={200}
        height={80}
        color={VoxTheme.colors.black}
        strokeWidth={4}
        duration={25}
        delay={20}
        colorOffset={{ color: VoxTheme.colors.yellow, leadFrames: 3 }}
      />
    </div>
  </AnalogTreatment>
);
```

Add composition:
```tsx
<Composition
  id="HandDrawnTest"
  component={HandDrawnTest}
  durationInFrames={120}
  fps={30}
  width={1080}
  height={1920}
/>
```

- [ ] **Step 4: Visual verification**

Run: `npx remotion studio src/entry.ts`
Expected: HandDrawnTest shows two SVG paths drawing themselves on screen — the second with a yellow lead line appearing 3 frames before the black stroke.

- [ ] **Step 5: Commit**

```bash
git add src/components/HandDrawnReveal.tsx src/presets/index.ts src/Root.tsx
git commit -m "feat: add HandDrawnReveal with trim-path animation and color offset"
```

---

### Task 9: OffsetGroup Component

**Files:**
- Create: `src/components/OffsetGroup.tsx`

- [ ] **Step 1: Create OffsetGroup**

```tsx
import React, { Children } from "react";
import { Sequence } from "remotion";
import { VoxOffsetContext } from "../context";

type OffsetGroupProps = {
  stagger?: number;
  exitStagger?: number | null;
  exitAt?: number | null;
  direction?: "forward" | "reverse" | "random";
  children: React.ReactNode;
};

export const OffsetGroup: React.FC<OffsetGroupProps> = ({
  stagger = 3,
  exitStagger = null,
  exitAt = null,
  direction = "forward",
  children,
}) => {
  const childArray = Children.toArray(children);
  const count = childArray.length;
  const effectiveExitStagger = exitStagger ?? stagger;

  // Compute order indices based on direction
  const getIndex = (i: number): number => {
    switch (direction) {
      case "reverse":
        return count - 1 - i;
      case "random":
        // Deterministic "random" — hash the index
        return ((i * 2654435761) >>> 0) % count;
      default:
        return i;
    }
  };

  return (
    <>
      {childArray.map((child, i) => {
        const orderIndex = getIndex(i);
        const entranceDelay = orderIndex * stagger;

        // Exit: reverse order by default (last in, first out)
        const exitIndex = count - 1 - orderIndex;
        const exitDelay = exitAt
          ? exitAt + exitIndex * effectiveExitStagger
          : undefined;

        const sequenceDuration = exitDelay
          ? exitDelay + effectiveExitStagger * 2 - entranceDelay
          : undefined;

        return (
          <Sequence
            key={i}
            from={entranceDelay}
            durationInFrames={sequenceDuration}
          >
            <VoxOffsetContext.Provider value={{ delay: entranceDelay }}>
              {child}
            </VoxOffsetContext.Provider>
          </Sequence>
        );
      })}
    </>
  );
};
```

- [ ] **Step 2: Add test composition to Root.tsx**

```tsx
import { OffsetGroup } from "./components/OffsetGroup";

const OffsetGroupTest: React.FC = () => (
  <AnalogTreatment>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: 40,
      }}
    >
      <OffsetGroup stagger={5}>
        <TextHighlighter text="First element" fontSize={48} duration={15} />
        <TextHighlighter text="Second element" fontSize={48} duration={15} />
        <TextHighlighter text="Third element" fontSize={48} duration={15} />
      </OffsetGroup>
    </div>
  </AnalogTreatment>
);
```

Add composition:
```tsx
<Composition
  id="OffsetGroupTest"
  component={OffsetGroupTest}
  durationInFrames={120}
  fps={30}
  width={1080}
  height={1920}
/>
```

- [ ] **Step 3: Visual verification**

Run: `npx remotion studio src/entry.ts`
Expected: Three highlights animate in sequence, each starting 5 frames after the previous.

- [ ] **Step 4: Commit**

```bash
git add src/components/OffsetGroup.tsx src/Root.tsx
git commit -m "feat: add OffsetGroup stagger utility with VoxOffsetContext"
```

---

### Task 10: ArticleZoom Component

**Files:**
- Create: `src/components/ArticleZoom.tsx`

- [ ] **Step 1: Create ArticleZoom**

```tsx
import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { posterizeFrame } from "../utils/posterize";
import { seededNoise } from "../utils/noise";
import { VoxTheme } from "../theme";
import { useVoxDelay } from "../context";

type ArticleZoomProps = {
  src: string;
  startPosition?: { x: number; y: number };
  endPosition?: { x: number; y: number };
  startScale?: number;
  endScale?: number;
  scanLines?: boolean;
  flicker?: number;
  depthOfField?: number;
  screenTint?: string | null;
  duration?: number;
  delay?: number;
};

export const ArticleZoom: React.FC<ArticleZoomProps> = ({
  src,
  startPosition = { x: 0, y: 0 },
  endPosition = { x: 0, y: -20 },
  startScale = 1.0,
  endScale = 1.1,
  scanLines = true,
  flicker = 0.05,
  depthOfField = 0,
  screenTint = null,
  duration = 60,
  delay = 0,
}) => {
  const rawFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { delay: offsetDelay } = useVoxDelay();
  const totalDelay = delay + offsetDelay;

  // Posterize for the Vox choppy feel
  const frame = posterizeFrame(rawFrame, fps, VoxTheme.treatment.posterizeFps);

  const progress = interpolate(
    frame,
    [totalDelay, totalDelay + duration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: VoxTheme.easing.cameraPan,
    }
  );

  const x = interpolate(progress, [0, 1], [startPosition.x, endPosition.x]);
  const y = interpolate(progress, [0, 1], [startPosition.y, endPosition.y]);
  const scale = interpolate(progress, [0, 1], [startScale, endScale]);

  // Flicker: random exposure shifts per frame
  const flickerOpacity =
    flicker > 0
      ? Math.abs(seededNoise(frame, 42)) * flicker
      : 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Source image with camera movement */}
      <Img
        src={src}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${x}%, ${y}%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      />

      {/* Scan lines overlay */}
      {scanLines && (
        <AbsoluteFill
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(0,0,0,0.03) 7px, rgba(0,0,0,0.03) 8px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Flicker overlay */}
      {flicker > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "white",
            opacity: flickerOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Screen tint */}
      {screenTint && (
        <AbsoluteFill
          style={{
            backgroundColor: screenTint,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Depth of field — blurred edges */}
      {depthOfField > 0 && (
        <AbsoluteFill
          style={{
            backdropFilter: `blur(${depthOfField}px)`,
            WebkitBackdropFilter: `blur(${depthOfField}px)`,
            maskImage: `radial-gradient(ellipse at center, transparent 40%, black 80%)`,
            WebkitMaskImage: `radial-gradient(ellipse at center, transparent 40%, black 80%)`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Add test composition**

Add to `src/Root.tsx`:
```tsx
import { ArticleZoom } from "./components/ArticleZoom";

const ArticleZoomTest: React.FC = () => (
  <AnalogTreatment>
    <ArticleZoom
      src="https://picsum.photos/1080/1920"
      startPosition={{ x: 0, y: 10 }}
      endPosition={{ x: 0, y: -10 }}
      startScale={1.1}
      endScale={1.2}
      scanLines={true}
      flicker={0.05}
      depthOfField={3}
      duration={90}
    />
  </AnalogTreatment>
);
```

Add composition:
```tsx
<Composition
  id="ArticleZoomTest"
  component={ArticleZoomTest}
  durationInFrames={120}
  fps={30}
  width={1080}
  height={1920}
/>
```

- [ ] **Step 3: Visual verification**

Run: `npx remotion studio src/entry.ts`
Expected: Slow pan over image with scan lines, subtle flicker, and blurred edges.

- [ ] **Step 4: Commit**

```bash
git add src/components/ArticleZoom.tsx src/Root.tsx
git commit -m "feat: add ArticleZoom with camera pan, scan lines, flicker, depth of field"
```

---

### Task 11: TextMatchCut Component

**Files:**
- Create: `src/components/TextMatchCut.tsx`

- [ ] **Step 1: Create TextMatchCut**

```tsx
import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { posterizeFrame } from "../utils/posterize";
import { RoughenEdgesFilter } from "../utils/svg-filters";
import { VoxTheme } from "../theme";
import { useVoxDelay } from "../context";

type Screenshot = {
  src: string;
  wordPosition: { x: number; y: number } | "center";
};

type TextMatchCutProps = {
  screenshots: Screenshot[];
  framesPerImage?: number;
  highlightWord?: boolean;
  highlightColor?: string;
  highlightBlend?: string;
  highlightRoughness?: number;
  highlightDelay?: number;
  delay?: number;
  wordBox?: { width: number; height: number };
};

export const TextMatchCut: React.FC<TextMatchCutProps> = ({
  screenshots,
  framesPerImage = 4,
  highlightWord = true,
  highlightColor = VoxTheme.colors.yellow,
  highlightBlend = "darken",
  highlightRoughness = 12,
  highlightDelay = 0,
  delay = 0,
  wordBox = { width: 200, height: 40 },
}) => {
  const rawFrame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delay: offsetDelay } = useVoxDelay();
  const totalDelay = delay + offsetDelay;

  const frame = posterizeFrame(rawFrame, fps, VoxTheme.treatment.posterizeFps);

  const totalMontageFrames = screenshots.length * framesPerImage;
  const montageEnd = totalDelay + totalMontageFrames;

  // During montage: cycle through screenshots
  const isMontageActive =
    frame >= totalDelay && frame < montageEnd;
  const montageIndex = isMontageActive
    ? Math.floor((frame - totalDelay) / framesPerImage) % screenshots.length
    : screenshots.length - 1; // Settle on last screenshot after montage

  const currentShot = screenshots[montageIndex];
  const centerX = width / 2;
  const centerY = height / 2;

  // Position image so word aligns to center
  const translateX =
    currentShot.wordPosition === "center"
      ? 0
      : centerX - currentShot.wordPosition.x;
  const translateY =
    currentShot.wordPosition === "center"
      ? 0
      : centerY - currentShot.wordPosition.y;

  // Highlight animation (after montage settles)
  const highlightStart = montageEnd + highlightDelay;
  const highlightProgress = highlightWord
    ? interpolate(frame, [highlightStart, highlightStart + 15], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: VoxTheme.easing.highlightStroke,
      })
    : 0;

  const filterId = "vox-matchcut-rough";

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {highlightWord && highlightRoughness > 0 && (
        <RoughenEdgesFilter id={filterId} roughness={highlightRoughness} />
      )}

      {/* Screenshot */}
      <Img
        src={currentShot.src}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform:
            currentShot.wordPosition === "center"
              ? undefined
              : `translate(${translateX}px, ${translateY}px)`,
        }}
      />

      {/* Word highlight (appears after montage) */}
      {highlightWord && highlightProgress > 0 && (
        <svg
          style={{
            position: "absolute",
            left: centerX - wordBox.width / 2,
            top: centerY - wordBox.height / 2,
            width: wordBox.width,
            height: wordBox.height,
            overflow: "visible",
            mixBlendMode: highlightBlend as React.CSSProperties["mixBlendMode"],
            filter:
              highlightRoughness > 0 ? `url(#${filterId})` : undefined,
          }}
        >
          <defs>
            <clipPath id="vox-matchcut-clip">
              <rect
                x={0}
                y={0}
                width={`${highlightProgress}%`}
                height={wordBox.height}
              />
            </clipPath>
          </defs>
          <rect
            x={0}
            y={0}
            width={wordBox.width}
            height={wordBox.height}
            fill={highlightColor}
            clipPath="url(#vox-matchcut-clip)"
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Add test composition**

```tsx
import { TextMatchCut } from "./components/TextMatchCut";

const MatchCutTest: React.FC = () => (
  <AnalogTreatment>
    <TextMatchCut
      screenshots={[
        { src: "https://picsum.photos/seed/1/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/2/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/3/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/4/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/5/1080/1920", wordPosition: "center" },
      ]}
      framesPerImage={4}
      highlightWord={true}
      highlightDelay={5}
    />
  </AnalogTreatment>
);
```

Add composition:
```tsx
<Composition
  id="MatchCutTest"
  component={MatchCutTest}
  durationInFrames={90}
  fps={30}
  width={1080}
  height={1920}
/>
```

- [ ] **Step 3: Visual verification**

Run: `npx remotion studio src/entry.ts`
Expected: Rapid 4-frame image cycling, settling on last image, then yellow highlight sweeps in.

- [ ] **Step 4: Commit**

```bash
git add src/components/TextMatchCut.tsx src/Root.tsx
git commit -m "feat: add TextMatchCut with rapid montage and word highlight"
```

---

### Task 12: SVG Presets

**Files:**
- Create: `src/presets/arrows.ts`
- Create: `src/presets/circles.ts`
- Create: `src/presets/underlines.ts`
- Modify: `src/presets/index.ts`

- [ ] **Step 1: Create arrow presets**

`src/presets/arrows.ts`:
```typescript
/** Hand-drawn arrow SVG path data. ViewBox: 200x200. */
export const arrowPresets = {
  "arrow-curly": "M 20 150 C 40 80 80 40 120 60 C 160 80 140 130 100 120 C 80 115 90 90 110 85 L 130 75 M 110 85 L 105 105",
  "arrow-straight": "M 20 100 C 60 98 140 102 170 100 M 170 100 L 155 85 M 170 100 L 155 115",
} as const;
```

- [ ] **Step 2: Create circle presets**

`src/presets/circles.ts`:
```typescript
/** Hand-drawn wobbly circle SVG path data. ViewBox: 200x200. */
export const circlePresets = {
  circle:
    "M 100 20 C 145 18 180 55 182 100 C 184 145 148 182 102 180 C 56 178 20 142 22 98 C 24 54 58 22 100 20 Z",
} as const;
```

- [ ] **Step 3: Create underline presets**

`src/presets/underlines.ts`:
```typescript
/** Hand-drawn underline SVG path data. ViewBox: 200x40. */
export const underlinePresets = {
  underline: "M 5 20 C 30 25 60 15 100 22 C 140 29 170 18 195 20",
  bracket: "M 10 5 L 10 35 M 10 35 L 30 35 M 170 35 L 190 35 M 190 35 L 190 5",
} as const;
```

- [ ] **Step 4: Update presets index**

`src/presets/index.ts`:
```typescript
import { arrowPresets } from "./arrows";
import { circlePresets } from "./circles";
import { underlinePresets } from "./underlines";

export const presetPaths: Record<string, string> = {
  ...arrowPresets,
  ...circlePresets,
  ...underlinePresets,
};

export { arrowPresets, circlePresets, underlinePresets };
```

- [ ] **Step 5: Update HandDrawnReveal test in Root.tsx to use presets**

Update HandDrawnTest in `src/Root.tsx` — replace the inline SVG paths:
```tsx
const HandDrawnTest: React.FC = () => (
  <AnalogTreatment>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: 60,
      }}
    >
      <HandDrawnReveal
        preset="arrow-curly"
        width={200}
        height={200}
        color={VoxTheme.colors.black}
        strokeWidth={4}
        duration={25}
      />
      <HandDrawnReveal
        preset="arrow-straight"
        width={200}
        height={200}
        color={VoxTheme.colors.black}
        strokeWidth={4}
        duration={25}
        delay={20}
        colorOffset={{ color: VoxTheme.colors.yellow, leadFrames: 3 }}
      />
      <HandDrawnReveal
        preset="circle"
        width={200}
        height={200}
        color={VoxTheme.colors.red}
        strokeWidth={3}
        duration={30}
        delay={40}
      />
    </div>
  </AnalogTreatment>
);
```

- [ ] **Step 6: Visual verification**

Run: `npx remotion studio src/entry.ts`
Expected: HandDrawnTest now shows preset arrows and circle drawing on screen with proper timing.

- [ ] **Step 7: Commit**

```bash
git add src/presets/
git commit -m "feat: add SVG presets for arrows, circles, underlines, brackets"
```

---

### Task 13: Bundled Texture Assets

**Files:**
- Create: `src/assets/textures.ts`

- [ ] **Step 1: Source textures from texturelabs.org**

Download 3 textures to `assets/textures/`:
- A warm paper texture (~100KB JPEG)
- A cool paper texture (~100KB JPEG)
- A halftone grunge pattern (~80KB PNG)

Run:
```bash
cd ~/Projects/vox-remotion-elements
mkdir -p assets/textures
# Download free textures from texturelabs.org
curl -L "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1080&q=80" -o assets/textures/paper-warm.jpg
curl -L "https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=1080&q=80" -o assets/textures/paper-cool.jpg
```

Note: If the above URLs fail, any warm-toned and cool-toned paper/parchment textures work. The specific images are less important than having something to encode.

- [ ] **Step 2: Create base64 texture module**

Run a script to encode the textures, then create `src/assets/textures.ts`:

```bash
cd ~/Projects/vox-remotion-elements
node -e "
const fs = require('fs');
const files = ['paper-warm.jpg', 'paper-cool.jpg'];
let out = '// Auto-generated base64 texture data URIs\n// Source: assets/textures/\n\n';
for (const f of files) {
  const path = 'assets/textures/' + f;
  if (fs.existsSync(path)) {
    const data = fs.readFileSync(path).toString('base64');
    const ext = f.endsWith('.png') ? 'png' : 'jpeg';
    const name = f.replace(/[-.]./g, c => c[1].toUpperCase()).replace(/\.\w+$/, '');
    out += 'export const ' + name + ' = \"data:image/' + ext + ';base64,' + data + '\";\n\n';
  }
}
fs.writeFileSync('src/assets/textures.ts', out);
console.log('Done');
"
```

If the curl downloads didn't work, create a minimal fallback:
```typescript
// Bundled texture data URIs — replace with real textures
// For now, components fall back to procedural SVG grain when these are empty

export const paperWarm: string | null = null;
export const paperCool: string | null = null;
```

- [ ] **Step 3: Commit**

```bash
git add src/assets/ assets/
git commit -m "feat: add bundled texture assets (paper warm/cool)"
```

---

### Task 14: Example Compositions

**Files:**
- Create: `examples/ArticleReveal.tsx`
- Create: `examples/SourceMontage.tsx`
- Create: `examples/AnnotatedExplainer.tsx`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Create ArticleReveal example**

`examples/ArticleReveal.tsx`:
```tsx
import React from "react";
import { AbsoluteFill } from "remotion";
import { AnalogTreatment } from "../src/components/AnalogTreatment";
import { ArticleZoom } from "../src/components/ArticleZoom";
import { TextHighlighter } from "../src/components/TextHighlighter";
import { HandDrawnReveal } from "../src/components/HandDrawnReveal";
import { VoxTheme } from "../src/theme";

/**
 * Recipe: Article Reveal
 * Zoom into source material, highlight key text, add arrow callout.
 */
export const ArticleReveal: React.FC<{ src: string }> = ({
  src = "https://picsum.photos/seed/article/1080/1920",
}) => (
  <AnalogTreatment fps={12} vignette={0.4}>
    {/* Camera pan over article */}
    <ArticleZoom
      src={src}
      startPosition={{ x: 0, y: 10 }}
      endPosition={{ x: 0, y: -15 }}
      startScale={1.05}
      endScale={1.15}
      scanLines={true}
      flicker={0.04}
      depthOfField={4}
      duration={75}
    />

    {/* Highlight appears mid-zoom */}
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextHighlighter
        text="key finding"
        fontSize={56}
        delay={40}
        duration={18}
        color={VoxTheme.colors.highlightYellow}
      />
    </AbsoluteFill>

    {/* Arrow callout pointing to highlight */}
    <div style={{ position: "absolute", top: 850, left: 700 }}>
      <HandDrawnReveal
        preset="arrow-curly"
        width={200}
        height={200}
        color={VoxTheme.colors.black}
        strokeWidth={4}
        delay={55}
        duration={20}
      />
    </div>
  </AnalogTreatment>
);
```

- [ ] **Step 2: Create SourceMontage example**

`examples/SourceMontage.tsx`:
```tsx
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AnalogTreatment } from "../src/components/AnalogTreatment";
import { TextMatchCut } from "../src/components/TextMatchCut";
import { TextHighlighter } from "../src/components/TextHighlighter";
import { VoxTheme } from "../src/theme";

/**
 * Recipe: Source Montage
 * Rapid screenshots cycling through sources → settle → highlight phrase.
 */
export const SourceMontage: React.FC = () => (
  <AnalogTreatment fps={12}>
    <TextMatchCut
      screenshots={[
        { src: "https://picsum.photos/seed/src1/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/src2/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/src3/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/src4/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/src5/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/src6/1080/1920", wordPosition: "center" },
      ]}
      framesPerImage={4}
      highlightWord={true}
      highlightColor={VoxTheme.colors.yellow}
      highlightDelay={8}
      wordBox={{ width: 300, height: 50 }}
    />

    {/* Additional highlight text after montage settles */}
    <Sequence from={50}>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 400,
        }}
      >
        <TextHighlighter
          text="everyone is talking about it"
          fontSize={44}
          duration={20}
          color={VoxTheme.colors.highlightYellow}
        />
      </AbsoluteFill>
    </Sequence>
  </AnalogTreatment>
);
```

- [ ] **Step 3: Create AnnotatedExplainer example**

`examples/AnnotatedExplainer.tsx`:
```tsx
import React from "react";
import { AbsoluteFill } from "remotion";
import { AnalogTreatment } from "../src/components/AnalogTreatment";
import { OffsetGroup } from "../src/components/OffsetGroup";
import { HandDrawnReveal } from "../src/components/HandDrawnReveal";
import { TextHighlighter } from "../src/components/TextHighlighter";
import { VoxTheme } from "../src/theme";

/**
 * Recipe: Annotated Explainer
 * Build up annotations piece by piece using OffsetGroup stagger.
 */
export const AnnotatedExplainer: React.FC = () => (
  <AnalogTreatment fps={12} vignette={0.2}>
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
      }}
    >
      <OffsetGroup stagger={8}>
        {/* Title highlight */}
        <TextHighlighter
          text="The Discovery"
          fontSize={72}
          fontFamily={VoxTheme.fonts.accent}
          duration={18}
          color={VoxTheme.colors.yellow}
        />

        {/* Arrow pointing down */}
        <div style={{ marginLeft: -100 }}>
          <HandDrawnReveal
            preset="arrow-straight"
            width={200}
            height={200}
            strokeWidth={4}
            duration={20}
            colorOffset={{ color: VoxTheme.colors.yellow, leadFrames: 3 }}
          />
        </div>

        {/* Supporting text */}
        <TextHighlighter
          text={["three separate studies", "confirmed the result"]}
          fontSize={48}
          duration={15}
          sequential={true}
          color={VoxTheme.colors.highlightYellow}
        />

        {/* Circle emphasis */}
        <HandDrawnReveal
          preset="circle"
          width={250}
          height={250}
          color={VoxTheme.colors.red}
          strokeWidth={3}
          duration={25}
        />
      </OffsetGroup>
    </AbsoluteFill>
  </AnalogTreatment>
);
```

- [ ] **Step 4: Update Root.tsx with all example compositions**

Replace `src/Root.tsx` entirely with the final version that registers all test + example compositions:

```tsx
import React from "react";
import { Composition, Folder } from "remotion";
import { AnalogTreatment } from "./components/AnalogTreatment";
import { TextHighlighter } from "./components/TextHighlighter";
import { HandDrawnReveal } from "./components/HandDrawnReveal";
import { OffsetGroup } from "./components/OffsetGroup";
import { ArticleZoom } from "./components/ArticleZoom";
import { TextMatchCut } from "./components/TextMatchCut";
import { VoxTheme } from "./theme";
import { ArticleReveal } from "../examples/ArticleReveal";
import { SourceMontage } from "../examples/SourceMontage";
import { AnnotatedExplainer } from "../examples/AnnotatedExplainer";

// --- Test compositions (component isolation) ---

const AnalogTest: React.FC = () => (
  <AnalogTreatment>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        fontSize: 72,
        fontWeight: "bold",
        color: VoxTheme.colors.black,
      }}
    >
      Analog Treatment Test
    </div>
  </AnalogTreatment>
);

const HighlighterTest: React.FC = () => (
  <AnalogTreatment>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: 80,
      }}
    >
      <TextHighlighter text="Single Line Highlight" fontSize={64} />
      <TextHighlighter
        text={["First Line", "Second Line"]}
        fontSize={52}
        sequential={true}
        delay={25}
        color="#FFCC00"
      />
    </div>
  </AnalogTreatment>
);

const HandDrawnTest: React.FC = () => (
  <AnalogTreatment>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: 60,
      }}
    >
      <HandDrawnReveal
        preset="arrow-curly"
        width={200}
        height={200}
        color={VoxTheme.colors.black}
        strokeWidth={4}
        duration={25}
      />
      <HandDrawnReveal
        preset="arrow-straight"
        width={200}
        height={200}
        color={VoxTheme.colors.black}
        strokeWidth={4}
        duration={25}
        delay={20}
        colorOffset={{ color: VoxTheme.colors.yellow, leadFrames: 3 }}
      />
      <HandDrawnReveal
        preset="circle"
        width={200}
        height={200}
        color={VoxTheme.colors.red}
        strokeWidth={3}
        duration={30}
        delay={40}
      />
    </div>
  </AnalogTreatment>
);

const OffsetGroupTest: React.FC = () => (
  <AnalogTreatment>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: 40,
      }}
    >
      <OffsetGroup stagger={5}>
        <TextHighlighter text="First element" fontSize={48} duration={15} />
        <TextHighlighter text="Second element" fontSize={48} duration={15} />
        <TextHighlighter text="Third element" fontSize={48} duration={15} />
      </OffsetGroup>
    </div>
  </AnalogTreatment>
);

const ArticleZoomTest: React.FC = () => (
  <AnalogTreatment>
    <ArticleZoom
      src="https://picsum.photos/seed/article-test/1080/1920"
      startPosition={{ x: 0, y: 10 }}
      endPosition={{ x: 0, y: -10 }}
      startScale={1.1}
      endScale={1.2}
      scanLines={true}
      flicker={0.05}
      depthOfField={3}
      duration={90}
    />
  </AnalogTreatment>
);

const MatchCutTest: React.FC = () => (
  <AnalogTreatment>
    <TextMatchCut
      screenshots={[
        { src: "https://picsum.photos/seed/1/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/2/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/3/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/4/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/5/1080/1920", wordPosition: "center" },
      ]}
      framesPerImage={4}
      highlightWord={true}
      highlightDelay={5}
    />
  </AnalogTreatment>
);

// --- Root ---

export const Root: React.FC = () => {
  return (
    <>
      <Folder name="Component-Tests">
        <Composition id="AnalogTest" component={AnalogTest} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="HighlighterTest" component={HighlighterTest} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="HandDrawnTest" component={HandDrawnTest} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="OffsetGroupTest" component={OffsetGroupTest} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="ArticleZoomTest" component={ArticleZoomTest} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="MatchCutTest" component={MatchCutTest} durationInFrames={90} fps={30} width={1080} height={1920} />
      </Folder>

      <Folder name="Recipe-Examples">
        <Composition id="ArticleReveal" component={() => <ArticleReveal src="https://picsum.photos/seed/reveal/1080/1920" />} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="SourceMontage" component={SourceMontage} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="AnnotatedExplainer" component={AnnotatedExplainer} durationInFrames={150} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
```

- [ ] **Step 5: Visual verification of all compositions**

Run: `npx remotion studio src/entry.ts`
Expected: Two folders in studio — Component-Tests (6 compositions) and Recipe-Examples (3 compositions). All render without errors.

- [ ] **Step 6: Commit**

```bash
git add examples/ src/Root.tsx
git commit -m "feat: add recipe example compositions (ArticleReveal, SourceMontage, AnnotatedExplainer)"
```

---

### Task 15: Package Exports and README

**Files:**
- Create: `src/index.ts`
- Create: `README.md`

- [ ] **Step 1: Create public API exports**

`src/index.ts`:
```typescript
// Components
export { AnalogTreatment } from "./components/AnalogTreatment";
export { TextHighlighter } from "./components/TextHighlighter";
export { HandDrawnReveal } from "./components/HandDrawnReveal";
export { OffsetGroup } from "./components/OffsetGroup";
export { ArticleZoom } from "./components/ArticleZoom";
export { TextMatchCut } from "./components/TextMatchCut";

// Theme and context
export { VoxTheme } from "./theme";
export { VoxOffsetContext, useVoxDelay } from "./context";

// Utilities
export { posterizeFrame } from "./utils/posterize";
export { seededNoise, wiggle } from "./utils/noise";
export {
  ChromaticAberrationFilter,
  RoughenEdgesFilter,
  GrainFilter,
} from "./utils/svg-filters";

// Presets
export { presetPaths, arrowPresets, circlePresets, underlinePresets } from "./presets";

// Bundled assets
export { paperWarm, paperCool } from "./assets/textures";
```

- [ ] **Step 2: Create README.md**

```markdown
# vox-remotion-elements

Vox-style analog editing elements for [Remotion](https://www.remotion.dev/). Composable React components that bring the Vox documentary aesthetic — paper textures, hand-drawn reveals, text highlights, and choppy analog motion — to programmatic video.

## Install

```bash
npm install vox-remotion-elements
```

Requires `remotion` and `react` as peer dependencies.

## Components

### AnalogTreatment

Wrapper that applies the full Vox analog feel: posterized frame rate, grain, chromatic aberration, vignette, and camera shake.

```tsx
import { AnalogTreatment } from 'vox-remotion-elements';

<AnalogTreatment fps={12} grain={0.15} vignette={0.3}>
  {/* Your content here */}
</AnalogTreatment>
```

### TextHighlighter

Animated highlight that sweeps across text with imperfect edges and multiply blend mode.

```tsx
import { TextHighlighter } from 'vox-remotion-elements';

<TextHighlighter
  text={["First line", "Second line"]}
  color="#FFD700"
  sequential={true}
  duration={20}
/>
```

### HandDrawnReveal

SVG trim-path animation for lines, arrows, and circles that draw themselves on screen.

```tsx
import { HandDrawnReveal } from 'vox-remotion-elements';

<HandDrawnReveal
  preset="arrow-curly"
  colorOffset={{ color: '#FFD700', leadFrames: 3 }}
  duration={25}
/>
```

### ArticleZoom

Camera pan over source material with screen emulation (scan lines, flicker, depth of field).

```tsx
import { ArticleZoom } from 'vox-remotion-elements';

<ArticleZoom
  src={staticFile('article-screenshot.png')}
  startScale={1.05}
  endScale={1.15}
  scanLines={true}
/>
```

### TextMatchCut

Rapid-fire screenshot montage with word alignment and highlight.

```tsx
import { TextMatchCut } from 'vox-remotion-elements';

<TextMatchCut
  screenshots={[
    { src: staticFile('source1.png'), wordPosition: 'center' },
    { src: staticFile('source2.png'), wordPosition: { x: 540, y: 800 } },
  ]}
  framesPerImage={4}
/>
```

### OffsetGroup

Stagger utility that offsets children's entrances by N frames.

```tsx
import { OffsetGroup, TextHighlighter } from 'vox-remotion-elements';

<OffsetGroup stagger={5}>
  <TextHighlighter text="First" />
  <TextHighlighter text="Second" />
  <TextHighlighter text="Third" />
</OffsetGroup>
```

## Theme

Access design tokens via `VoxTheme`:

```tsx
import { VoxTheme } from 'vox-remotion-elements';

VoxTheme.colors.yellow      // '#FFD700'
VoxTheme.easing.highlightStroke  // Easing.out(Easing.cubic)
VoxTheme.treatment.posterizeFps  // 12
```

## Presets

Built-in SVG paths for HandDrawnReveal: `arrow-curly`, `arrow-straight`, `circle`, `underline`, `bracket`.

## Development

```bash
npm install
npx remotion studio src/entry.ts
```

## License

MIT
```

- [ ] **Step 3: Verify build one final time**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/index.ts README.md
git commit -m "feat: add public API exports and README"
```

---

### Task 16: Final Verification

- [ ] **Step 1: Clean install test**

```bash
cd ~/Projects/vox-remotion-elements
rm -rf node_modules package-lock.json
npm install
```
Expected: Clean install, no errors.

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Studio launch and visual check of all compositions**

Run: `npx remotion studio src/entry.ts`
Expected: All 9 compositions (6 tests + 3 examples) render without errors. Verify:
- AnalogTest: warm background, grain, vignette, choppy motion
- HighlighterTest: yellow highlights sweeping with rough edges
- HandDrawnTest: SVG paths drawing themselves, color offset visible
- OffsetGroupTest: staggered entrance of 3 highlights
- ArticleZoomTest: slow pan with scan lines and blurred edges
- MatchCutTest: rapid image cycling then highlight
- ArticleReveal: combined zoom + highlight + arrow
- SourceMontage: rapid montage → settle → highlight
- AnnotatedExplainer: staggered build-up of annotations

- [ ] **Step 4: Final commit with any fixes**

```bash
git add -A
git status
# Only commit if there are changes
git commit -m "chore: final verification fixes" || echo "Nothing to commit"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] AnalogTreatment with all props (fps, grain, chromaticAberration, vignette, warmth, paperTexture, halftoneTexture, cameraShake, seed, className, style) → Task 6
- [x] TextHighlighter with string | string[], sequential, brushHardness, roughness → Task 7
- [x] HandDrawnReveal with pathLength="1", presets, colorOffset.leadFrames → Task 8
- [x] OffsetGroup with VoxOffsetContext, useVoxDelay() → Task 9
- [x] ArticleZoom with scanLines, flicker, depthOfField → Task 10
- [x] TextMatchCut with wordPosition 'center' option → Task 11
- [x] VoxTheme with colors, fonts (headlineFallback), easings, treatment → Task 5
- [x] VoxOffsetContext + useVoxDelay hook → Task 5
- [x] SVG filters (chromatic, roughen, grain) → Task 4
- [x] Posterize utility → Task 2
- [x] Noise/wiggle utility → Task 3
- [x] Presets (arrows, circles, underlines) → Task 12
- [x] Bundled textures → Task 13
- [x] Example compositions (3 recipes) → Task 14
- [x] Public exports (index.ts) → Task 15
- [x] README → Task 15
- [x] Package scaffold → Task 1

**Placeholder scan:** No TBD, TODO, or "implement later" found.

**Type consistency:** All prop types, function signatures, and import paths are consistent across tasks.
