import React, { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { useVoxDelay } from "../context";
import { seededNoise } from "../utils/noise";

export type LightLeakProps = {
  src?: string | null;
  blendMode?: string;
  opacity?: number;
  animate?: boolean;
  driftSpeed?: number;
  driftAngle?: number;
  enterDuration?: number | null;
  exitDuration?: number | null;
  delay?: number;
  duration?: number;
  seed?: number;
  className?: string;
  style?: CSSProperties;
};

export const LightLeak: React.FC<LightLeakProps> = ({
  src = null,
  blendMode = "screen",
  opacity: targetOpacity = 0.25,
  animate = true,
  driftSpeed = 0.5,
  driftAngle = 30,
  enterDuration = null,
  exitDuration = null,
  delay = 0,
  duration = 60,
  seed = 0,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { delay: offsetDelay } = useVoxDelay();
  const totalDelay = delay + offsetDelay;

  const activeFrame = frame - totalDelay;

  // Calculate current opacity
  let currentOpacity: number;

  if (activeFrame < 0) {
    currentOpacity = 0;
  } else if (activeFrame >= duration) {
    currentOpacity = 0;
  } else if (enterDuration && activeFrame < enterDuration) {
    currentOpacity = interpolate(
      activeFrame,
      [0, enterDuration],
      [0, targetOpacity],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  } else if (exitDuration && activeFrame > duration - exitDuration) {
    currentOpacity = interpolate(
      activeFrame,
      [duration - exitDuration, duration],
      [targetOpacity, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  } else {
    currentOpacity = targetOpacity;
  }

  // Calculate drift position
  let dx = 0;
  let dy = 0;

  if (animate && activeFrame >= 0) {
    const angleRad = (driftAngle * Math.PI) / 180;
    dx = activeFrame * driftSpeed * Math.cos(angleRad);
    dy = activeFrame * driftSpeed * Math.sin(angleRad);

    // Add subtle noise variation for organic feel
    dx += seededNoise(frame, seed) * 2;
    dy += seededNoise(frame, seed + 1) * 2;
  }

  const driftTransform = `translate(${dx}px, ${dy}px)`;

  return (
    <AbsoluteFill
      className={className}
      style={{
        pointerEvents: "none",
        opacity: currentOpacity,
        mixBlendMode: blendMode as CSSProperties["mixBlendMode"],
        ...style,
      }}
    >
      {src ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: driftTransform,
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(255, 180, 80, 0.6) 0%, rgba(255, 120, 50, 0.3) 40%, transparent 70%)",
            transform: driftTransform,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
