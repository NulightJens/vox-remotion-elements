import React, { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useVoxDelay } from "../context";

export type Article3DProps = {
  startSwivel?: number;
  endSwivel?: number;
  startTilt?: number;
  endTilt?: number;
  perspective?: number;
  startScale?: number;
  endScale?: number;
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
  shadow?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const Article3D: React.FC<Article3DProps> = ({
  startSwivel = 0,
  endSwivel = 15,
  startTilt = 0,
  endTilt = -5,
  perspective = 1200,
  startScale = 1,
  endScale = 1.05,
  duration = 60,
  delay = 0,
  easing = Easing.inOut(Easing.quad),
  shadow = true,
  children,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { delay: offsetDelay } = useVoxDelay();
  const totalDelay = delay + offsetDelay;

  const swivel = interpolate(
    frame,
    [totalDelay, totalDelay + duration],
    [startSwivel, endSwivel],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    }
  );

  const tilt = interpolate(
    frame,
    [totalDelay, totalDelay + duration],
    [startTilt, endTilt],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    }
  );

  const scale = interpolate(
    frame,
    [totalDelay, totalDelay + duration],
    [startScale, endScale],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    }
  );

  const shadowX = -swivel * 0.5;
  const shadowY = tilt * 0.5;
  const shadowBlur = 20 + Math.abs(swivel) * 0.5;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        perspective: `${perspective}px`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotateY(${swivel}deg) rotateX(${tilt}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
          ...(shadow
            ? {
                filter: `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.3))`,
              }
            : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
};
