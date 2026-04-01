import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { VoxTheme } from "../theme";
import { useVoxDelay } from "../context";
import { RoughenEdgesFilter } from "../utils/svg-filters";
import { presetPaths } from "../presets";

export type HandDrawnRevealProps = {
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
  color = "#1a1a1a",
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

  const filterId = `vox-hand-drawn-roughen-${totalDelay}`;

  // Main path animation: stroke-dashoffset from 1 -> 0
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

  // Color offset path (starts earlier by leadFrames)
  let colorOffsetProgress = 1;
  if (colorOffset) {
    const offsetStart = totalDelay - colorOffset.leadFrames;
    colorOffsetProgress = interpolate(
      frame,
      [offsetStart, offsetStart + duration],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: VoxTheme.easing.trimPathReveal,
      }
    );
  }

  // Fill opacity tied to main path completion
  const fillOpacity = fill
    ? interpolate(mainProgress, [0.1, 0], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div style={{ position: "relative", width, height, display: "inline-block" }}>
      <RoughenEdgesFilter id={filterId} roughness={roughness} baseFrequency={0.04} />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ overflow: "visible", filter: `url(#${filterId})` }}
      >
        {/* Color offset path (behind main) */}
        {colorOffset && (
          <path
            d={pathData}
            fill="none"
            stroke={colorOffset.color}
            strokeWidth={strokeWidth + 2}
            strokeLinecap={cap}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={colorOffsetProgress}
          />
        )}

        {/* Main path */}
        <path
          d={pathData}
          fill={fill ?? "none"}
          fillOpacity={fillOpacity}
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
