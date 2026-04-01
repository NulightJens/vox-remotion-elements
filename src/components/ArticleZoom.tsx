import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { posterizeFrame } from "../utils/posterize";
import { seededNoise } from "../utils/noise";
import { VoxTheme } from "../theme";
import { useVoxDelay } from "../context";

export type ArticleZoomProps = {
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
  const frame = useCurrentFrame();
  const { fps: compositionFps } = useVideoConfig();
  const { delay: offsetDelay } = useVoxDelay();

  const totalDelay = delay + offsetDelay;
  const stepped = posterizeFrame(frame, compositionFps, VoxTheme.treatment.posterizeFps);

  const progress = interpolate(
    stepped - totalDelay,
    [0, duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: VoxTheme.easing.cameraPan }
  );

  const translateX = interpolate(progress, [0, 1], [startPosition.x, endPosition.x]);
  const translateY = interpolate(progress, [0, 1], [startPosition.y, endPosition.y]);
  const scale = interpolate(progress, [0, 1], [startScale, endScale]);

  const flickerOpacity = Math.abs(seededNoise(stepped, 42)) * flicker;

  const isVisible = frame >= totalDelay;

  if (!isVisible) {
    return <AbsoluteFill />;
  }

  return (
    <AbsoluteFill>
      {/* Layer 1: Image with camera transforms */}
      <AbsoluteFill
        style={{
          overflow: "hidden",
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `translate(${translateX}%, ${translateY}%) scale(${scale})`,
            transformOrigin: "center center",
          }}
        />
      </AbsoluteFill>

      {/* Layer 2: Scan lines */}
      {scanLines && (
        <AbsoluteFill
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(0,0,0,0.03) 7px, rgba(0,0,0,0.03) 8px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Layer 3: Flicker */}
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: flickerOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Layer 4: Screen tint */}
      {screenTint && (
        <AbsoluteFill
          style={{
            backgroundColor: screenTint,
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Layer 5: Depth of field (edge blur) */}
      {depthOfField > 0 && (
        <AbsoluteFill
          style={{
            backdropFilter: `blur(${depthOfField}px)`,
            WebkitBackdropFilter: `blur(${depthOfField}px)`,
            maskImage: `radial-gradient(ellipse at center, transparent 40%, black 100%)`,
            WebkitMaskImage: `radial-gradient(ellipse at center, transparent 40%, black 100%)`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
