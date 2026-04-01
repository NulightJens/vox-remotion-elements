import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { AnalogTreatment } from "./components/AnalogTreatment";
import { TextHighlighter } from "./components/TextHighlighter";
import { HandDrawnReveal } from "./components/HandDrawnReveal";
import { OffsetGroup } from "./components/OffsetGroup";
import { ArticleZoom } from "./components/ArticleZoom";
import { TextMatchCut } from "./components/TextMatchCut";
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

const ArticleZoomTestContent: React.FC = () => (
  <AnalogTreatment>
    <ArticleZoom
      src="https://picsum.photos/seed/article-test/1080/1920"
      startPosition={{ x: 0, y: 10 }}
      endPosition={{ x: 0, y: -10 }}
      startScale={1.1}
      endScale={1.2}
      scanLines={true}
      flicker={0.05}
      depthOfField={3}
      duration={90}
    />
  </AnalogTreatment>
);

const MatchCutTestContent: React.FC = () => (
  <AnalogTreatment>
    <TextMatchCut
      screenshots={[
        { src: "https://picsum.photos/seed/1/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/2/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/3/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/4/1080/1920", wordPosition: "center" },
        { src: "https://picsum.photos/seed/5/1080/1920", wordPosition: "center" },
      ]}
      framesPerImage={4}
      highlightWord={true}
      highlightDelay={5}
    />
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
      <Composition
        id="ArticleZoomTest"
        component={ArticleZoomTestContent}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MatchCutTest"
        component={MatchCutTestContent}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
