import { Easing } from "remotion";

export const VoxTheme = {
  colors: {
    warmWhite: "#f5f0e8",
    warmGray: "#e8e0d4",
    black: "#1a1a1a",
    yellow: "#FFD700",
    highlightYellow: "#FFCC00",
    red: "#c0392b",
    deepGray: "#272727",
  },
  fonts: {
    headline: "Balto",
    headlineFallback: "DM Sans",
    body: "Sora",
    accent: "Bebas Neue",
  },
  easing: {
    highlightStroke: Easing.out(Easing.cubic),
    cameraPan: Easing.inOut(Easing.quad),
    trimPathReveal: Easing.out(Easing.quad),
    elementEntrance: Easing.out(Easing.back(1.2)),
    elementExit: Easing.in(Easing.quad),
  },
  treatment: {
    posterizeFps: 12,
    grain: 0.15,
    chromaticAberration: 0.8,
    vignette: 0.3,
    cameraShake: { frequency: 2, amplitude: 2 },
    roughenEdges: 3,
    brushHardness: 0.85,
  },
} as const;
