import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AnalogTreatment } from "../src/components/AnalogTreatment";
import { GridBackground } from "../src/components/GridBackground";
import { TypewriterReveal } from "../src/components/TypewriterReveal";
import { TextHighlighter } from "../src/components/TextHighlighter";
import { VoxTheme } from "../src/theme";

/**
 * Recipe: TitleCardReveal
 * Grid fades in → text typewriters on → highlight sweeps key word.
 * Demonstrates: GridBackground + TypewriterReveal + TextHighlighter inside AnalogTreatment.
 */
export const TitleCardReveal: React.FC = () => (
  <AnalogTreatment fps={12} vignette={0.35}>
    {/* Grid background fades in over 20 frames */}
    <GridBackground
      cellSize={50}
      color="#d4cfc4"
      opacity={0.25}
      mask="blob"
      maskScale={0.65}
      maskFeather={100}
      enterDuration={20}
      delay={0}
      seed={42}
    />

    {/* Title typewriters in starting at frame 15 */}
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <TypewriterReveal
        text={["THE INVENTION", "OF THE CAMERA"]}
        fontSize={88}
        fontFamily={VoxTheme.fonts.accent}
        color={VoxTheme.colors.black}
        framesPerChar={2}
        delay={15}
        sequential={true}
        lineSpacing={1.1}
      />
    </AbsoluteFill>

    {/* Highlight sweeps "CAMERA" after typewriter completes */}
    <Sequence from={75}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 50,
        }}
      >
        <TextHighlighter
          text="CAMERA"
          fontSize={88}
          fontFamily={VoxTheme.fonts.accent}
          color={VoxTheme.colors.yellow}
          duration={18}
          delay={0}
        />
      </AbsoluteFill>
    </Sequence>
  </AnalogTreatment>
);
