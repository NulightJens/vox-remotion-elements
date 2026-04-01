import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { AnalogTreatment } from "./components/AnalogTreatment";
import { TextHighlighter } from "./components/TextHighlighter";
import { HandDrawnReveal } from "./components/HandDrawnReveal";
import { OffsetGroup } from "./components/OffsetGroup";
import { VoxTheme } from "./theme";

const AnalogTestContent: React.FC = () => (
  <AnalogTreatment>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: VoxTheme.fonts.headline,
          fontSize: 80,
          color: VoxTheme.colors.black,
          textAlign: "center",
          padding: 40,
        }}
      >
        Analog Treatment Test
      </div>
    </AbsoluteFill>
  </AnalogTreatment>
);

const HighlighterTestContent: React.FC = () => (
  <AnalogTreatment>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 80,
      }}
    >
      {/* Single-line highlight */}
      <TextHighlighter text="Single Line Highlight" fontSize={48} />

      {/* Multi-line sequential highlight */}
      <TextHighlighter
        text={["First line revealed", "Then the second", "And finally the third"]}
        fontSize={42}
        sequential={true}
        delay={10}
        color={VoxTheme.colors.highlightYellow}
      />
    </AbsoluteFill>
  </AnalogTreatment>
);

const HandDrawnTestContent: React.FC = () => (
  <AnalogTreatment>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 60,
      }}
    >
      {/* Inline SVG path */}
      <HandDrawnReveal
        svg="M 20 100 Q 100 20 180 100"
        color={VoxTheme.colors.black}
        strokeWidth={4}
        duration={25}
        width={200}
        height={120}
      />

      {/* With color offset */}
      <HandDrawnReveal
        svg="M 20 100 Q 100 20 180 100"
        color={VoxTheme.colors.black}
        strokeWidth={4}
        duration={25}
        delay={30}
        width={200}
        height={120}
        colorOffset={{ color: VoxTheme.colors.yellow, leadFrames: 3 }}
      />
    </AbsoluteFill>
  </AnalogTreatment>
);

const OffsetGroupTestContent: React.FC = () => (
  <AnalogTreatment>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <OffsetGroup stagger={5}>
        <TextHighlighter text="First staggered line" fontSize={40} duration={15} />
        <TextHighlighter text="Second staggered line" fontSize={40} duration={15} />
        <TextHighlighter text="Third staggered line" fontSize={40} duration={15} />
      </OffsetGroup>
    </AbsoluteFill>
  </AnalogTreatment>
);

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Placeholder"
        component={() => <div style={{ background: '#f5f0e8', width: '100%', height: '100%' }} />}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AnalogTest"
        component={AnalogTestContent}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HighlighterTest"
        component={HighlighterTestContent}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HandDrawnTest"
        component={HandDrawnTestContent}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OffsetGroupTest"
        component={OffsetGroupTestContent}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
