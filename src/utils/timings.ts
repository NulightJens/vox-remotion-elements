/**
 * SFX timing utilities for vox-remotion-elements.
 * Pure functions that return frame-level event markers for audio synchronization.
 * Each function mirrors a component's props so timing math stays in sync with visuals.
 */

export type VoxEvent = {
  frame: number;
  type: string;
  label?: string;
};

// --- TypewriterReveal ---

export function getTypewriterTimings(props: {
  text: string | string[];
  delay?: number;
  framesPerChar?: number;
  sequential?: boolean;
}): VoxEvent[] {
  const { text, delay = 0, framesPerChar = 2, sequential = true } = props;
  const lines = Array.isArray(text) ? text : [text];
  const events: VoxEvent[] = [];

  let charOffset = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineStart = sequential ? delay + charOffset * framesPerChar : delay;

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      events.push({
        frame: lineStart + charIndex * framesPerChar,
        type: "letter",
        label: line[charIndex],
      });
    }

    const lineEndFrame = lineStart + (line.length - 1) * framesPerChar;
    events.push({
      frame: lineEndFrame,
      type: "line-complete",
      label: `line-${lineIndex}`,
    });

    if (sequential) {
      charOffset += line.length;
    }
  }

  // Complete event at the very last frame
  const lastFrame = events
    .filter((e) => e.type === "letter")
    .reduce((max, e) => Math.max(max, e.frame), 0);
  events.push({ frame: lastFrame, type: "complete" });

  return events;
}

// --- GridBackground ---

export function getGridTimings(props: {
  delay?: number;
  enterDuration?: number | null;
}): VoxEvent[] {
  const { delay = 0, enterDuration = null } = props;
  const events: VoxEvent[] = [{ frame: delay, type: "grid-in" }];

  if (enterDuration != null && enterDuration > 0) {
    events.push({ frame: delay + enterDuration, type: "grid-settled" });
  }

  return events;
}

// --- FocusPull ---

export function getFocusPullTimings(props: {
  blurSteps?: number[];
  framesPerStep?: number;
  delay?: number;
}): VoxEvent[] {
  const {
    blurSteps = [0, 15, 10, 5, 15, 10, 5, 0],
    framesPerStep = 2,
    delay = 0,
  } = props;
  const events: VoxEvent[] = [];

  for (let i = 0; i < blurSteps.length; i++) {
    const frame = delay + i * framesPerStep;
    const value = blurSteps[i];

    if (value === 0) {
      events.push({ frame, type: "sharp", label: `step-${i}` });
    }

    // Check if this is a local max
    const prev = i > 0 ? blurSteps[i - 1] : 0;
    const next = i < blurSteps.length - 1 ? blurSteps[i + 1] : 0;
    if (value > prev && value >= next && value > 0) {
      events.push({
        frame,
        type: "blur-peak",
        label: `blur-${value}`,
      });
    }
  }

  return events;
}

// --- FootageHomogenizer ---

export function getHomogenizerTimings(props: {
  delay?: number;
}): VoxEvent[] {
  const { delay = 0 } = props;
  return [
    { frame: delay, type: "treatment-start" },
    { frame: delay + 1, type: "treatment-complete" },
  ];
}

// --- LightLeak ---

export function getLightLeakTimings(props: {
  delay?: number;
  duration?: number;
  enterDuration?: number | null;
  exitDuration?: number | null;
}): VoxEvent[] {
  const {
    delay = 0,
    duration = 60,
    enterDuration = null,
    exitDuration = null,
  } = props;
  const events: VoxEvent[] = [];

  events.push({ frame: delay, type: "leak-in" });

  if (enterDuration != null && enterDuration > 0) {
    events.push({ frame: delay + enterDuration, type: "leak-peak" });
  } else {
    events.push({ frame: delay, type: "leak-peak" });
  }

  if (exitDuration != null && exitDuration > 0) {
    events.push({
      frame: delay + duration - exitDuration,
      type: "leak-out",
    });
  }

  return events;
}

// --- Article3D ---

export function getArticle3DTimings(props: {
  delay?: number;
  duration?: number;
}): VoxEvent[] {
  const { delay = 0, duration = 60 } = props;
  return [
    { frame: delay, type: "rotation-start" },
    { frame: delay + duration, type: "rotation-land" },
  ];
}
