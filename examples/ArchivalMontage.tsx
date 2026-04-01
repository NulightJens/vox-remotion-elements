import React from "react";
import { AbsoluteFill, Sequence, Img } from "remotion";
import { FootageHomogenizer } from "../src/components/FootageHomogenizer";
import { FocusPull } from "../src/components/FocusPull";
import { Article3D } from "../src/components/Article3D";
import { LightLeak } from "../src/components/LightLeak";

/**
 * Recipe: ArchivalMontage
 * Three mismatched sources normalized through FootageHomogenizer, with FocusPull
 * transitions between them, Article3D rotation on the final image, LightLeak over all.
 * Demonstrates: FootageHomogenizer + FocusPull + Article3D + LightLeak.
 */
export const ArchivalMontage: React.FC = () => (
  <AbsoluteFill>
    {/* FootageHomogenizer normalizes all source clips */}
    <FootageHomogenizer
      grayscale={true}
      grain={0.25}
      blur={3}
      chromaticAberration={1.2}
      flicker={0.04}
      vignette={0.35}
    >
      {/* Source 1: frames 0-59 */}
      <Sequence from={0} durationInFrames={60}>
        <AbsoluteFill>
          <Img
            src="https://picsum.photos/seed/archival1/1080/1920"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Focus pull transition at frame 55 */}
      <Sequence from={55} durationInFrames={16}>
        <FocusPull
          blurSteps={[0, 12, 8, 4, 12, 8, 4, 0]}
          framesPerStep={2}
        />
      </Sequence>

      {/* Source 2: frames 60-119 */}
      <Sequence from={60} durationInFrames={60}>
        <AbsoluteFill>
          <Img
            src="https://picsum.photos/seed/archival2/1080/1920"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Focus pull transition at frame 115 */}
      <Sequence from={115} durationInFrames={16}>
        <FocusPull
          blurSteps={[0, 15, 10, 5, 15, 10, 5, 0]}
          framesPerStep={2}
        />
      </Sequence>

      {/* Source 3: frames 120-179 with Article3D rotation */}
      <Sequence from={120} durationInFrames={60}>
        <Article3D
          startSwivel={-10}
          endSwivel={8}
          startTilt={3}
          endTilt={-2}
          duration={60}
          shadow={true}
        >
          <AbsoluteFill>
            <Img
              src="https://picsum.photos/seed/archival3/1080/1920"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        </Article3D>
      </Sequence>
    </FootageHomogenizer>

    {/* Light leak over everything */}
    <LightLeak
      opacity={0.2}
      blendMode="screen"
      animate={true}
      driftSpeed={0.3}
      driftAngle={25}
      duration={180}
      enterDuration={30}
      exitDuration={20}
    />
  </AbsoluteFill>
);
