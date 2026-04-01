import React, { ReactNode } from "react";
import { Sequence } from "remotion";
import { VoxOffsetContext } from "../context";

export type OffsetGroupProps = {
  stagger?: number;
  exitStagger?: number | null;
  exitAt?: number | null;
  direction?: "forward" | "reverse" | "random";
  children: ReactNode;
};

/**
 * Deterministic hash for "random" ordering.
 * Returns a stable shuffle index based on child index and count.
 */
function deterministicOrder(index: number, count: number): number {
  // Simple hash: use a prime multiplier and mod by count
  const hash = ((index + 1) * 2654435761) >>> 0;
  return hash % count;
}

function buildOrderIndices(
  count: number,
  direction: "forward" | "reverse" | "random"
): number[] {
  if (direction === "reverse") {
    return Array.from({ length: count }, (_, i) => count - 1 - i);
  }
  if (direction === "random") {
    // Build a deterministic permutation
    const indices = Array.from({ length: count }, (_, i) => i);
    // Fisher-Yates with deterministic seed
    for (let i = count - 1; i > 0; i--) {
      const j = deterministicOrder(i, i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }
  // forward
  return Array.from({ length: count }, (_, i) => i);
}

export const OffsetGroup: React.FC<OffsetGroupProps> = ({
  stagger = 3,
  exitStagger: _exitStagger = null,
  exitAt: _exitAt = null,
  direction = "forward",
  children,
}) => {
  const childArray = React.Children.toArray(children);
  const count = childArray.length;
  const orderIndices = buildOrderIndices(count, direction);
  // exitStagger and exitAt are accepted props but duration is not restricted —
  // parent composition controls when children unmount.
  void _exitStagger;
  void _exitAt;

  return (
    <>
      {childArray.map((child, i) => {
        const orderIndex = orderIndices[i];
        const entranceDelay = orderIndex * stagger;

        // Don't restrict sequence duration — let parent composition control it
        const sequenceDuration = undefined;

        return (
          <Sequence
            key={i}
            from={entranceDelay}
            durationInFrames={sequenceDuration}
            layout="none"
          >
            <VoxOffsetContext.Provider value={{ delay: 0 }}>
              {child}
            </VoxOffsetContext.Provider>
          </Sequence>
        );
      })}
    </>
  );
};
