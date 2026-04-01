import React, { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { VoxTheme } from "../theme";
import { useVoxDelay } from "../context";
import { RoughenEdgesFilter } from "../utils/svg-filters";

export type TypewriterRevealProps = {
  text: string | string[];
  framesPerChar?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  cursorBlinkRate?: number;
  roughness?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  lineSpacing?: number;
  sequential?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const TypewriterReveal: React.FC<TypewriterRevealProps> = ({
  text,
  framesPerChar = 2,
  delay = 0,
  cursor = false,
  cursorChar = "\u258C",
  cursorBlinkRate = 8,
  roughness = 0,
  fontSize = 72,
  fontFamily = VoxTheme.fonts.accent,
  color = "#1a1a1a",
  lineSpacing = 1.2,
  sequential = true,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { delay: offsetDelay } = useVoxDelay();
  const totalDelay = delay + offsetDelay;

  const lines = Array.isArray(text) ? text : [text];

  // Calculate the start frame for each line
  const lineStartFrames: number[] = [];
  let runningOffset = 0;
  for (let i = 0; i < lines.length; i++) {
    if (sequential && i > 0) {
      lineStartFrames.push(totalDelay + runningOffset);
    } else {
      lineStartFrames.push(totalDelay);
    }
    if (sequential) {
      runningOffset += lines[i].length * framesPerChar;
    }
  }

  // Total characters across all lines for cursor logic
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  const lastCharFrame = sequential
    ? totalDelay + totalChars * framesPerChar
    : totalDelay + Math.max(...lines.map((l) => l.length)) * framesPerChar;
  const allRevealed = frame >= lastCharFrame;

  // Find the global index of the last visible character for cursor placement
  let lastVisibleLineIndex = -1;
  let lastVisibleCharIndex = -1;
  for (let li = lines.length - 1; li >= 0; li--) {
    const lineStart = lineStartFrames[li];
    for (let ci = lines[li].length - 1; ci >= 0; ci--) {
      const charFrame = lineStart + ci * framesPerChar;
      if (frame >= charFrame) {
        lastVisibleLineIndex = li;
        lastVisibleCharIndex = ci;
        break;
      }
    }
    if (lastVisibleLineIndex >= 0) break;
  }

  const cursorVisible =
    cursor &&
    !allRevealed &&
    Math.floor(frame / cursorBlinkRate) % 2 === 0;

  const filterId = `vox-typewriter-roughen-${totalDelay}`;
  const useRoughness = roughness > 0;

  const textContainer = (
    <div
      style={{
        fontSize,
        fontFamily,
        color,
        lineHeight: lineSpacing,
        whiteSpace: "pre-wrap",
      }}
    >
      {lines.map((line, li) => {
        const lineStart = lineStartFrames[li];
        return (
          <div key={li}>
            {line.split("").map((char, ci) => {
              const charFrame = lineStart + ci * framesPerChar;
              const visible = frame >= charFrame;
              return (
                <span
                  key={ci}
                  style={{
                    opacity: visible ? 1 : 0,
                  }}
                >
                  {char}
                </span>
              );
            })}
            {cursor &&
              li === lastVisibleLineIndex &&
              !allRevealed && (
                <span
                  style={{
                    opacity: cursorVisible ? 1 : 0,
                  }}
                >
                  {cursorChar}
                </span>
              )}
          </div>
        );
      })}
    </div>
  );

  if (useRoughness) {
    return (
      <div className={className} style={style}>
        <RoughenEdgesFilter id={filterId} roughness={roughness} />
        <div style={{ filter: `url(#${filterId})` }}>{textContainer}</div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {textContainer}
    </div>
  );
};
