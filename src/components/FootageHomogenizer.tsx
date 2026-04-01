import React, { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { seededNoise } from "../utils/noise";
import {
  ChromaticAberrationFilter,
  GrainFilter,
} from "../utils/svg-filters";

export type FootageHomogenizerProps = {
  grayscale?: boolean | number;
  grain?: number;
  blur?: number;
  blurMask?: "radial" | "none";
  chromaticAberration?: number;
  flicker?: number;
  vignette?: number;
  warmth?: string | null;
  seed?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const FootageHomogenizer: React.FC<FootageHomogenizerProps> = ({
  grayscale = true,
  grain = 0.3,
  blur = 4,
  blurMask = "radial",
  chromaticAberration = 1.5,
  flicker = 0.05,
  vignette = 0.4,
  warmth = null,
  seed = 0,
  children,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chromaticId = `vox-homogenizer-chromatic-${seed}`;
  const grainId = `vox-homogenizer-grain-${seed}`;

  // Build grayscale filter string
  const grayscaleFilter =
    grayscale === true
      ? "grayscale(1)"
      : typeof grayscale === "number"
        ? `grayscale(${grayscale})`
        : "";

  // Build chromatic aberration filter string
  const chromaticFilter =
    chromaticAberration > 0 ? `url(#${chromaticId})` : "";

  // Combined content filter
  const contentFilter = [grayscaleFilter, chromaticFilter]
    .filter(Boolean)
    .join(" ");

  // Flicker opacity
  const flickerOpacity = Math.abs(seededNoise(frame, seed + 100)) * flicker;

  // Blur overlay styles
  const blurOverlayStyle: CSSProperties =
    blur > 0
      ? {
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          pointerEvents: "none",
          ...(blurMask === "radial"
            ? {
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, transparent 40%, black 80%)",
                maskImage:
                  "radial-gradient(ellipse at center, transparent 40%, black 80%)",
              }
            : {}),
        }
      : {};

  return (
    <AbsoluteFill className={className} style={style}>
      {/* SVG filter definitions */}
      <ChromaticAberrationFilter id={chromaticId} offset={chromaticAberration} />
      <GrainFilter id={grainId} intensity={grain} />

      {/* Layer 1: Warm background (optional) */}
      {warmth !== null && (
        <AbsoluteFill style={{ backgroundColor: warmth }} />
      )}

      {/* Layer 2: Content with grayscale + chromatic aberration */}
      <AbsoluteFill
        style={{
          filter: contentFilter || undefined,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Layer 3: Edge blur overlay */}
      {blur > 0 && <AbsoluteFill style={blurOverlayStyle} />}

      {/* Layer 4: Flicker overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: flickerOpacity,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Layer 5: Grain overlay */}
      {grain > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "rgba(128,128,128,0.3)",
            filter: `url(#${grainId})`,
            opacity: grain * 0.6,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Layer 6: Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${vignette}) 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
