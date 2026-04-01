// Components
export { AnalogTreatment } from "./components/AnalogTreatment";
export { TextHighlighter } from "./components/TextHighlighter";
export { HandDrawnReveal } from "./components/HandDrawnReveal";
export { OffsetGroup } from "./components/OffsetGroup";
export { ArticleZoom } from "./components/ArticleZoom";
export { TextMatchCut } from "./components/TextMatchCut";

// Theme and context
export { VoxTheme } from "./theme";
export { VoxOffsetContext, useVoxDelay } from "./context";

// Utilities
export { posterizeFrame } from "./utils/posterize";
export { seededNoise, wiggle } from "./utils/noise";
export {
  ChromaticAberrationFilter,
  RoughenEdgesFilter,
  GrainFilter,
} from "./utils/svg-filters";

// Presets
export {
  presetPaths,
  arrowPresets,
  circlePresets,
  underlinePresets,
} from "./presets";

// Bundled assets
export { paperWarm, paperCool } from "./assets/textures";
