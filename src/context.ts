import { createContext, useContext } from "react";

type VoxOffsetValue = {
  delay: number;
};

export const VoxOffsetContext = createContext<VoxOffsetValue>({ delay: 0 });

/**
 * Hook for child components to consume the stagger delay from OffsetGroup.
 * Returns the delay in frames that this child should add to its animations.
 */
export function useVoxDelay(): VoxOffsetValue {
  return useContext(VoxOffsetContext);
}
