import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { posterizeFrame } from "../utils/posterize";
import { VoxTheme } from "../theme";
import { useVoxDelay } from "../context";
import { RoughenEdgesFilter } from "../utils/svg-filters";

type ScreenshotEntry = {
  src: string;
  wordPosition: { x: number; y: number } | "center";
};

export type TextMatchCutProps = {
  screenshots: ScreenshotEntry[];
  framesPerImage?: number;
  highlightWord?: boolean;
  highlightColor?: string;
  highlightBlend?: string;
  highlightRoughness?: number;
  highlightOpacity?: number;
  highlightDelay?: number;
  delay?: number;
  wordBox?: { width: number; height: number };
};

export const TextMatchCut: React.FC<TextMatchCutProps> = ({
  screenshots,
  framesPerImage = 4,
  highlightWord = true,
  highlightColor = VoxTheme.colors.yellow,
  highlightBlend = "normal",
  highlightRoughness = 12,
  highlightOpacity = 0.85,
  highlightDelay = 0,
  delay = 0,
  wordBox = { width: 200, height: 40 },
}) => {
  const frame = useCurrentFrame();
  const { fps: compositionFps, width: videoWidth, height: videoHeight } = useVideoConfig();
  const { delay: offsetDelay } = useVoxDelay();

  const totalDelay = delay + offsetDelay;
  const stepped = posterizeFrame(frame, compositionFps, VoxTheme.treatment.posterizeFps);

  const localFrame = stepped - totalDelay;

  if (localFrame < 0 || screenshots.length === 0) {
    return <AbsoluteFill />;
  }

  const totalMontageFrames = screenshots.length * framesPerImage;
  const montageEnded = localFrame >= totalMontageFrames;

  let currentIndex: number;
  if (montageEnded) {
    currentIndex = screenshots.length - 1;
  } else {
    currentIndex = Math.floor(localFrame / framesPerImage) % screenshots.length;
  }

  const current = screenshots[currentIndex];
  const pos = current.wordPosition;

  // Word alignment: translate image so wordPosition aligns to screen center
  let translateX = 0;
  let translateY = 0;
  if (pos !== "center") {
    translateX = videoWidth / 2 - pos.x;
    translateY = videoHeight / 2 - pos.y;
  }

  const showHighlight = highlightWord && montageEnded && localFrame >= totalMontageFrames + highlightDelay;

  const instanceId = `${totalDelay}-${screenshots.length}`;
  const filterId = `vox-matchcut-roughen-${instanceId}`;
  const clipId = `vox-matchcut-clip-${instanceId}`;

  // Highlight reveal: clip-path from 0 to full width
  const highlightLocalFrame = localFrame - totalMontageFrames - highlightDelay;
  const revealProgress = showHighlight ? Math.min(highlightLocalFrame / 6, 1) : 0;

  return (
    <AbsoluteFill>
      {/* SVG filter for highlight roughness */}
      {highlightWord && (
        <RoughenEdgesFilter id={filterId} roughness={highlightRoughness} />
      )}

      {/* Screenshot layer */}
      <AbsoluteFill
        style={{
          overflow: "hidden",
        }}
      >
        <Img
          src={current.src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `translate(${translateX}px, ${translateY}px)`,
          }}
        />
      </AbsoluteFill>

      {/* Highlight overlay */}
      {showHighlight && (
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <svg
            width={wordBox.width}
            height={wordBox.height}
            style={{
              overflow: "visible",
              mixBlendMode: highlightBlend as React.CSSProperties["mixBlendMode"],
              filter: `url(#${filterId})`,
            }}
          >
            <defs>
              <clipPath id={clipId}>
                <rect
                  x={0}
                  y={0}
                  width={wordBox.width * revealProgress}
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
              opacity={highlightOpacity}
              clipPath={`url(#${clipId})`}
            />
          </svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
