import React from "react";
import { AbsoluteFill } from "remotion";
import { AnalogTreatment } from "../src/components/AnalogTreatment";
import { OffsetGroup } from "../src/components/OffsetGroup";
import { HandDrawnReveal } from "../src/components/HandDrawnReveal";
import { TextHighlighter } from "../src/components/TextHighlighter";
import { VoxTheme } from "../src/theme";

export const AnnotatedExplainer: React.FC = () => (
  <AnalogTreatment fps={12} vignette={0.2}>
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
      }}
    >
      <OffsetGroup stagger={8}>
        <TextHighlighter
          text="The Discovery"
          fontSize={72}
          fontFamily={VoxTheme.fonts.accent}
          duration={18}
          color={VoxTheme.colors.yellow}
        />
        <div style={{ marginLeft: -100 }}>
          <HandDrawnReveal
            preset="arrow-straight"
            width={200}
            height={200}
            strokeWidth={4}
            duration={20}
            colorOffset={{
              color: VoxTheme.colors.yellow,
              leadFrames: 3,
            }}
          />
        </div>
        <TextHighlighter
          text={["three separate studies", "confirmed the result"]}
          fontSize={48}
          duration={15}
          sequential={true}
          color={VoxTheme.colors.highlightYellow}
        />
        <HandDrawnReveal
          preset="circle"
          width={250}
          height={250}
          color={VoxTheme.colors.red}
          strokeWidth={3}
          duration={25}
        />
      </OffsetGroup>
    </AbsoluteFill>
  </AnalogTreatment>
);
