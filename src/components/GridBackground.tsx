import React, { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { VoxTheme } from "../theme";
import { useVoxDelay } from "../context";
import { wiggle as wiggleFn, seededNoise } from "../utils/noise";

export type GridBackgroundProps = {
  cellSize?: number;
  lineWidth?: number;
  color?: string;
  opacity?: number;
  mask?: "blob" | "rect" | "ellipse" | string;
  maskFeather?: number;
  maskScale?: number;
  maskPosition?: { x: number; y: number };
  wiggle?: { frequency: number; amplitude: number };
  enterDuration?: number | null;
  delay?: number;
  seed?: number;
  className?: string;
  style?: CSSProperties;
};

/* Target canvas dimensions (standard vertical video). */
const TARGET_W = 1080;
const TARGET_H = 1920;

/**
 * Build an SVG data-URI mask for the grid container.
 * The shape is drawn in white on a transparent canvas and blurred by maskFeather
 * so the grid fades smoothly at the edges.
 */
function buildMaskSvg(
  mask: "blob" | "rect" | "ellipse" | string,
  maskScale: number,
  maskPosition: { x: number; y: number },
  maskFeather: number,
  seed: number
): string {
  const cx = maskPosition.x * TARGET_W;
  const cy = maskPosition.y * TARGET_H;
  const blur = maskFeather / 4;

  let shapeMarkup: string;

  if (mask === "blob") {
    const baseRadius = (maskScale * Math.min(TARGET_W, TARGET_H)) / 2;
    const vertices = 8;
    const points: string[] = [];
    for (let i = 0; i < vertices; i++) {
      const angle = i * ((2 * Math.PI) / vertices);
      const perturbation = 1 + seededNoise(i, seed) * 0.15;
      const r = baseRadius * perturbation;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      points.push(`${px},${py}`);
    }
    shapeMarkup = `<polygon points='${points.join(" ")}' fill='white' filter='url(#f)'/>`;
  } else if (mask === "rect") {
    const rw = TARGET_W * maskScale;
    const rh = TARGET_H * maskScale;
    const rx = cx - rw / 2;
    const ry = cy - rh / 2;
    shapeMarkup = `<rect x='${rx}' y='${ry}' width='${rw}' height='${rh}' fill='white' filter='url(#f)'/>`;
  } else if (mask === "ellipse") {
    const erx = (TARGET_W * maskScale) / 2;
    const ery = (TARGET_H * maskScale) / 2;
    shapeMarkup = `<ellipse cx='${cx}' cy='${cy}' rx='${erx}' ry='${ery}' fill='white' filter='url(#f)'/>`;
  } else {
    /* Custom SVG path string */
    shapeMarkup = `<path d='${mask}' fill='white' filter='url(#f)'/>`;
  }

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${TARGET_W}' height='${TARGET_H}'>` +
    `<defs><filter id='f'><feGaussianBlur stdDeviation='${blur}'/></filter></defs>` +
    shapeMarkup +
    `</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  cellSize = 40,
  lineWidth = 1,
  color = "#cccccc",
  opacity = 0.3,
  mask = "blob",
  maskFeather = 80,
  maskScale = 0.7,
  maskPosition = { x: 0.5, y: 0.5 },
  wiggle: wiggleOpts = { frequency: 2, amplitude: 3 },
  enterDuration = null,
  delay = 0,
  seed = 0,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { delay: offsetDelay } = useVoxDelay();

  const totalDelay = delay + offsetDelay;

  /* ── Wiggle ── */
  const wiggleX = wiggleFn(frame, wiggleOpts.frequency, wiggleOpts.amplitude, fps, seed);
  const wiggleY = wiggleFn(frame, wiggleOpts.frequency, wiggleOpts.amplitude, fps, seed + 999);

  /* ── Entrance scale ── */
  let entranceScale = 1;
  if (enterDuration !== null && enterDuration > 0) {
    entranceScale = interpolate(
      frame - totalDelay,
      [0, enterDuration],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: VoxTheme.easing.elementEntrance,
      }
    );
  }

  /* ── Visibility ── */
  const isVisible = frame >= totalDelay;
  if (!isVisible) {
    return null;
  }

  /* ── Grid gradients ── */
  const gap = cellSize - lineWidth;
  const horizontalLines =
    `repeating-linear-gradient(0deg, transparent, transparent ${gap}px, ${color} ${gap}px, ${color} ${cellSize}px)`;
  const verticalLines =
    `repeating-linear-gradient(90deg, transparent, transparent ${gap}px, ${color} ${gap}px, ${color} ${cellSize}px)`;

  /* ── Mask ── */
  const maskSvg = buildMaskSvg(mask, maskScale, maskPosition, maskFeather, seed);

  const containerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    ...style,
  };

  const gridStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `${horizontalLines}, ${verticalLines}`,
    opacity,
    transform: `translate(${wiggleX}px, ${wiggleY}px) scale(${entranceScale})`,
    transformOrigin: "center center",
    WebkitMaskImage: maskSvg,
    maskImage: maskSvg,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%" as string,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat" as string,
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={gridStyle} />
    </div>
  );
};
