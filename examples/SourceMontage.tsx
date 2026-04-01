import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AnalogTreatment } from "../src/components/AnalogTreatment";
import { TextMatchCut } from "../src/components/TextMatchCut";
import { TextHighlighter } from "../src/components/TextHighlighter";
import { VoxTheme } from "../src/theme";

export const SourceMontage: React.FC = () => (
  <AnalogTreatment fps={12}>
    <TextMatchCut
      screenshots={[
        {
          src: "https://picsum.photos/seed/src1/1080/1920",
          wordPosition: "center",
        },
        {
          src: "https://picsum.photos/seed/src2/1080/1920",
          wordPosition: "center",
        },
        {
          src: "https://picsum.photos/seed/src3/1080/1920",
          wordPosition: "center",
        },
        {
          src: "https://picsum.photos/seed/src4/1080/1920",
          wordPosition: "center",
        },
        {
          src: "https://picsum.photos/seed/src5/1080/1920",
          wordPosition: "center",
        },
        {
          src: "https://picsum.photos/seed/src6/1080/1920",
          wordPosition: "center",
        },
      ]}
      framesPerImage={4}
      highlightWord={true}
      highlightColor={VoxTheme.colors.yellow}
      highlightDelay={8}
      wordBox={{ width: 300, height: 50 }}
    />
    <Sequence from={50}>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 400,
        }}
      >
        <TextHighlighter
          text="everyone is talking about it"
          fontSize={44}
          duration={20}
          color={VoxTheme.colors.highlightYellow}
        />
      </AbsoluteFill>
    </Sequence>
  </AnalogTreatment>
);
