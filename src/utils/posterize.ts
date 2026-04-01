/**
 * Steps frame values to simulate lower frame rates (cutting on twos/threes).
 * Core to the Vox analog feel — makes motion look hand-crafted rather than smooth.
 */
export function posterizeFrame(
  frame: number,
  compositionFps: number,
  targetFps: number
): number {
  if (targetFps >= compositionFps) {
    if (targetFps > compositionFps) {
      console.warn(
        `[vox] posterize targetFps (${targetFps}) exceeds composition fps (${compositionFps}). No stepping applied.`
      );
    }
    return frame;
  }
  const step = Math.max(1, Math.floor(compositionFps / targetFps));
  return Math.floor(frame / step) * step;
}
