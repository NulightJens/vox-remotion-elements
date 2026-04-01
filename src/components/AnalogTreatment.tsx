import React, { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { posterizeFrame } from "../utils/posterize";
import { wiggle } from "../utils/noise";
import {
  ChromaticAberrationFilter,
  GrainFilter,
} from "../utils/svg-filters";
import { VoxTheme } from "../theme";

type CameraShake = {
  frequency: number;
  amplitude: number;
};

export type AnalogTreatmentProps = {
  fps?: number;
  grain?: number;
  chromaticAberration?: number;
  vignette?: number;
  warmth?: string;
  paperTexture?: string | null;
  halftoneTexture?: string | null;
  cameraShake?: CameraShake;
  seed?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
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
  const frame = useCurrentFrame();
  const { fps: compositionFps } = useVideoConfig();

  const stepped = posterizeFrame(frame, compositionFps, fps);

  const shakeX = wiggle(stepped, cameraShake.frequency, cameraShake.amplitude, compositionFps, seed);
  const shakeY = wiggle(stepped, cameraShake.frequency, cameraShake.amplitude, compositionFps, seed + 1);

  const chromaticId = `vox-chromatic-${seed}`;
  const grainId = `vox-grain-${seed}`;

  return (
    <AbsoluteFill className={className} style={style}>
      {/* SVG filter definitions */}
      <ChromaticAberrationFilter id={chromaticId} offset={chromaticAberration} />
      {!paperTexture && <GrainFilter id={grainId} intensity={grain} />}

      {/* Layer 1: Warm background */}
      <AbsoluteFill style={{ backgroundColor: warmth }} />

      {/* Layer 2: Paper texture overlay */}
      {paperTexture && (
        <AbsoluteFill
          style={{
            backgroundImage: `url(${paperTexture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
            mixBlendMode: "multiply",
          }}
        />
      )}

      {/* Layer 3: Halftone overlay */}
      {halftoneTexture && (
        <AbsoluteFill
          style={{
            backgroundImage: `url(${halftoneTexture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
            mixBlendMode: "multiply",
          }}
        />
      )}

      {/* Layer 4: Content with chromatic aberration + camera shake */}
      <AbsoluteFill
        style={{
          filter: `url(#${chromaticId})`,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Layer 5: Procedural grain (only if no paper texture) */}
      {!paperTexture && (
        <AbsoluteFill
          style={{
            filter: `url(#${grainId})`,
            opacity: grain,
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
