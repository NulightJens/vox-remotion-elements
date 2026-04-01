import { Composition } from "remotion";

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
    </>
  );
};
