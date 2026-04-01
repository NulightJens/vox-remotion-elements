import React from "react";
import { AbsoluteFill } from "remotion";
import { AnalogTreatment } from "../src/components/AnalogTreatment";
import { ArticleZoom } from "../src/components/ArticleZoom";
import { TextHighlighter } from "../src/components/TextHighlighter";
import { HandDrawnReveal } from "../src/components/HandDrawnReveal";
import { VoxTheme } from "../src/theme";

export const ArticleReveal: React.FC<{ src?: string }> = ({
  src = "https://picsum.photos/seed/article/1080/1920",
}) => (
  <AnalogTreatment fps={12} vignette={0.4}>
    <ArticleZoom
      src={src}
      startPosition={{ x: 0, y: 10 }}
      endPosition={{ x: 0, y: -15 }}
      startScale={1.05}
      endScale={1.15}
      scanLines={true}
      flicker={0.04}
      depthOfField={4}
      duration={75}
    />
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextHighlighter
        text="key finding"
        fontSize={56}
        delay={40}
        duration={18}
        color={VoxTheme.colors.highlightYellow}
      />
    </AbsoluteFill>
    <div style={{ position: "absolute", top: 850, left: 700 }}>
      <HandDrawnReveal
        preset="arrow-curly"
        width={200}
        height={200}
        color={VoxTheme.colors.black}
        strokeWidth={4}
        delay={55}
        duration={20}
      />
    </div>
  </AnalogTreatment>
);
