// Components — v0.1.0
export { AnalogTreatment } from "./components/AnalogTreatment";
export { TextHighlighter } from "./components/TextHighlighter";
export { HandDrawnReveal } from "./components/HandDrawnReveal";
export { OffsetGroup } from "./components/OffsetGroup";
export { ArticleZoom } from "./components/ArticleZoom";
export { TextMatchCut } from "./components/TextMatchCut";

// Components — v0.2.0
export { TypewriterReveal } from "./components/TypewriterReveal";
export { GridBackground } from "./components/GridBackground";
export { FocusPull } from "./components/FocusPull";
export { FootageHomogenizer } from "./components/FootageHomogenizer";
export { LightLeak } from "./components/LightLeak";
export { Article3D } from "./components/Article3D";

// Component prop types — v0.1.0
export type { AnalogTreatmentProps } from "./components/AnalogTreatment";
export type { TextHighlighterProps } from "./components/TextHighlighter";
export type { HandDrawnRevealProps } from "./components/HandDrawnReveal";
export type { OffsetGroupProps } from "./components/OffsetGroup";
export type { ArticleZoomProps } from "./components/ArticleZoom";
export type { TextMatchCutProps } from "./components/TextMatchCut";

// Component prop types — v0.2.0
export type { TypewriterRevealProps } from "./components/TypewriterReveal";
export type { GridBackgroundProps } from "./components/GridBackground";
export type { FocusPullProps } from "./components/FocusPull";
export type { FootageHomogenizerProps } from "./components/FootageHomogenizer";
export type { LightLeakProps } from "./components/LightLeak";
export type { Article3DProps } from "./components/Article3D";

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

// Timing utilities — v0.2.0
export type { VoxEvent } from "./utils/timings";
export {
  getTypewriterTimings,
  getGridTimings,
  getFocusPullTimings,
  getHomogenizerTimings,
  getLightLeakTimings,
  getArticle3DTimings,
} from "./utils/timings";

// Presets
export {
  presetPaths,
  arrowPresets,
  circlePresets,
  underlinePresets,
} from "./presets";

// Bundled assets
export { paperWarm, paperCool } from "./assets/textures";
