/**
 * Deterministic noise function for camera shake, flicker, and wiggle effects.
 * Same (frame, seed) always produces the same output — critical for Remotion's
 * frame-by-frame rendering model.
 *
 * Returns a value between -1 and 1.
 */
export function seededNoise(frame: number, seed: number = 0): number {
  const n = frame + seed * 9999;
  const x = Math.sin(n * 12.9898 + n * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/**
 * Generate a wiggle value that changes at a given frequency.
 * Equivalent to AE's wiggle(frequency, amplitude) but deterministic.
 */
export function wiggle(
  frame: number,
  frequency: number,
  amplitude: number,
  fps: number,
  seed: number = 0
): number {
  const framesPerChange = Math.max(1, Math.round(fps / frequency));
  const steppedFrame = Math.floor(frame / framesPerChange);
  return seededNoise(steppedFrame, seed) * amplitude;
}
