import { arrowPresets } from "./arrows";
import { circlePresets } from "./circles";
import { underlinePresets } from "./underlines";

export const presetPaths: Record<string, string> = {
  ...arrowPresets,
  ...circlePresets,
  ...underlinePresets,
};

export { arrowPresets, circlePresets, underlinePresets };
