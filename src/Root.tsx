import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { AnalogTreatment } from "./components/AnalogTreatment";
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
    </>
  );
};
