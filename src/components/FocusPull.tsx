import React, { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useVoxDelay } from "../context";

export type FocusPullProps = {
  blurSteps?: number[];
  framesPerStep?: number;
  delay?: number;
  easing?: ((t: number) => number) | null;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const FocusPull: React.FC<FocusPullProps> = ({
  blurSteps = [0, 15, 10, 5, 15, 10, 5, 0],
  framesPerStep = 2,
  delay = 0,
  easing = null,
  children,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { delay: offsetDelay } = useVoxDelay();
  const totalDelay = delay + offsetDelay;

  const activeFrame = frame - totalDelay;

  let currentRadius: number;

  if (activeFrame < 0) {
    currentRadius = blurSteps[0];
  } else {
    const stepIndex = Math.floor(activeFrame / framesPerStep);

    if (stepIndex >= blurSteps.length) {
      currentRadius = blurSteps[blurSteps.length - 1];
    } else if (easing === null) {
      currentRadius = blurSteps[stepIndex];
    } else {
      // Interpolate between current and next step
      const nextIndex = Math.min(stepIndex + 1, blurSteps.length - 1);
      currentRadius = interpolate(
        activeFrame % framesPerStep,
        [0, framesPerStep],
        [blurSteps[stepIndex], blurSteps[nextIndex]],
        { easing }
      );
    }
  }

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        filter: `blur(${currentRadius}px)`,
        ...style,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
};
