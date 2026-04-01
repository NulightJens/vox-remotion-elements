import React from "react";
import { AbsoluteFill, Composition, Folder, Img, Sequence } from "remotion";
import { AnalogTreatment } from "./components/AnalogTreatment";
import { TextHighlighter } from "./components/TextHighlighter";
import { HandDrawnReveal } from "./components/HandDrawnReveal";
import { OffsetGroup } from "./components/OffsetGroup";
import { ArticleZoom } from "./components/ArticleZoom";
import { TextMatchCut } from "./components/TextMatchCut";
import { TypewriterReveal } from "./components/TypewriterReveal";
import { GridBackground } from "./components/GridBackground";
import { FocusPull } from "./components/FocusPull";
import { FootageHomogenizer } from "./components/FootageHomogenizer";
import { LightLeak } from "./components/LightLeak";
import { Article3D } from "./components/Article3D";
import { VoxTheme } from "./theme";

// v0.1.0 example compositions
import { ArticleReveal } from "../examples/ArticleReveal";
import { SourceMontage } from "../examples/SourceMontage";
import { AnnotatedExplainer } from "../examples/AnnotatedExplainer";

// v0.2.0 example compositions
import { TitleCardReveal } from "../examples/TitleCardReveal";
import { ArchivalMontage } from "../examples/ArchivalMontage";

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

// --- v0.2.0 Test Content ---

const TypewriterTestContent: React.FC = () => (
  <AnalogTreatment>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 80,
      }}
    >
      <TypewriterReveal
        text="TYPEWRITER REVEAL"
        fontSize={72}
        framesPerChar={2}
        delay={5}
      />
      <TypewriterReveal
        text={["MULTI LINE", "SEQUENTIAL MODE"]}
        fontSize={56}
        framesPerChar={3}
        delay={40}
        sequential={true}
        roughness={3}
        color={VoxTheme.colors.deepGray}
      />
    </AbsoluteFill>
  </AnalogTreatment>
);

const GridTestContent: React.FC = () => (
  <AnalogTreatment>
    <GridBackground
      cellSize={40}
      color="#c0b8a8"
      opacity={0.3}
      mask="blob"
      maskFeather={80}
      enterDuration={25}
      delay={5}
      seed={7}
    />
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: VoxTheme.fonts.accent,
          fontSize: 80,
          color: VoxTheme.colors.black,
        }}
      >
        Grid Background Test
      </div>
    </AbsoluteFill>
  </AnalogTreatment>
);

const FocusPullTestContent: React.FC = () => (
  <AnalogTreatment>
    {/* Scene A: visible frames 0-44 */}
    <Sequence from={0} durationInFrames={45}>
      <AbsoluteFill>
        <Img
          src="https://picsum.photos/seed/focusA/1080/1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div style={{ fontFamily: VoxTheme.fonts.accent, fontSize: 72, color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
            SCENE A
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>

    {/* FocusPull transition: overlay that blurs everything beneath it */}
    <Sequence from={30} durationInFrames={24}>
      <FocusPull
        blurSteps={[0, 5, 10, 15, 15, 10, 5, 0]}
        framesPerStep={3}
      />
    </Sequence>

    {/* Scene B: visible frames 45-89 */}
    <Sequence from={45} durationInFrames={45}>
      <AbsoluteFill>
        <Img
          src="https://picsum.photos/seed/focusB/1080/1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div style={{ fontFamily: VoxTheme.fonts.accent, fontSize: 72, color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
            SCENE B
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>
  </AnalogTreatment>
);

const HomogenizerTestContent: React.FC = () => (
  <FootageHomogenizer grayscale={true} grain={0.3} blur={4} chromaticAberration={1.5} flicker={0.05}>
    <Sequence from={0} durationInFrames={40}>
      <AbsoluteFill>
        <Img
          src="https://picsum.photos/seed/homo1/1080/1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={40} durationInFrames={40}>
      <AbsoluteFill>
        <Img
          src="https://picsum.photos/seed/homo2/1080/1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={80} durationInFrames={40}>
      <AbsoluteFill>
        <Img
          src="https://picsum.photos/seed/homo3/1080/1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </Sequence>
  </FootageHomogenizer>
);

const LightLeakTestContent: React.FC = () => (
  <AnalogTreatment>
    <AbsoluteFill>
      <Img
        src="https://picsum.photos/seed/lightleak/1080/1920"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
    <LightLeak
      opacity={0.3}
      animate={true}
      driftSpeed={0.8}
      driftAngle={35}
      duration={120}
      enterDuration={20}
    />
  </AnalogTreatment>
);

const Article3DTestContent: React.FC = () => (
  <AnalogTreatment>
    <Article3D
      startSwivel={-12}
      endSwivel={12}
      startTilt={5}
      endTilt={-3}
      perspective={1000}
      duration={90}
      delay={5}
      shadow={true}
    >
      <AbsoluteFill>
        <Img
          src="https://picsum.photos/seed/article3d/1080/1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </Article3D>
  </AnalogTreatment>
);

export const Root: React.FC = () => {
  return (
    <>
      <Folder name="Component-Tests">
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
      </Folder>

      <Folder name="V020-Component-Tests">
        <Composition
          id="TypewriterTest"
          component={TypewriterTestContent}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="GridTest"
          component={GridTestContent}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="FocusPullTest"
          component={FocusPullTestContent}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HomogenizerTest"
          component={HomogenizerTestContent}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="LightLeakTest"
          component={LightLeakTestContent}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Article3DTest"
          component={Article3DTestContent}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="Recipe-Examples">
        <Composition
          id="ArticleReveal"
          component={ArticleReveal}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SourceMontage"
          component={SourceMontage}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="AnnotatedExplainer"
          component={AnnotatedExplainer}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="TitleCardReveal"
          component={TitleCardReveal}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="ArchivalMontage"
          component={ArchivalMontage}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
