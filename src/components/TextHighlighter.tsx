import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { VoxTheme } from "../theme";
import { useVoxDelay } from "../context";
import { RoughenEdgesFilter } from "../utils/svg-filters";

export type TextHighlighterProps = {
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
  /** Background behind the text+highlight group. Use for visibility over busy images.
   *  e.g. "rgba(245,240,232,0.9)" for a warm paper-like backing. */
  background?: string | null;
  /** Padding around text when background is set (px). */
  padding?: number;
};

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  color = VoxTheme.colors.yellow,
  blendMode = "multiply",
  brushHardness = 0.85,
  strokeWidth = "auto",
  delay = 0,
  duration = 20,
  roughness = 3,
  sequential = true,
  fontSize = 42,
  fontFamily = VoxTheme.fonts.body,
  background = null,
  padding = 20,
}) => {
  const frame = useCurrentFrame();
  const { delay: offsetDelay } = useVoxDelay();
  const totalDelay = delay + offsetDelay;

  const lines = Array.isArray(text) ? text : [text];
  const lineHeight = fontSize * 1.4;
  const highlightHeight =
    strokeWidth === "auto" ? fontSize * 1.2 : strokeWidth;
  const displacementScale = roughness * (1 - brushHardness + 0.5);
  const filterId = `vox-highlight-roughen-${totalDelay}`;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        ...(background
          ? {
              backgroundColor: background,
              padding,
              borderRadius: 4,
            }
          : {}),
      }}
    >
      <RoughenEdgesFilter
        id={filterId}
        roughness={displacementScale}
        baseFrequency={0.04}
      />

      {lines.map((line, index) => {
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

        return (
          <div
            key={index}
            style={{
              position: "relative",
              lineHeight: `${lineHeight}px`,
            }}
          >
            {/* SVG highlight behind text */}
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${lineHeight}px`,
                overflow: "visible",
                pointerEvents: "none",
              }}
            >
              <defs>
                <clipPath id={`clip-highlight-${totalDelay}-${index}`}>
                  <rect
                    x={0}
                    y={0}
                    width={`${progress}%`}
                    height={lineHeight}
                  />
                </clipPath>
              </defs>
              <rect
                x={0}
                y={(lineHeight - highlightHeight) / 2}
                width="100%"
                height={highlightHeight}
                fill={color}
                clipPath={`url(#clip-highlight-${totalDelay}-${index})`}
                style={{
                  mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"],
                  filter: `url(#${filterId})`,
                }}
              />
            </svg>

            {/* Text */}
            <span
              style={{
                position: "relative",
                fontFamily,
                fontSize,
                color: VoxTheme.colors.black,
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </span>
          </div>
        );
      })}
    </div>
  );
};
