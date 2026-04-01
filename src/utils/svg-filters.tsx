import React from "react";

/**
 * Chromatic aberration as a single SVG filter.
 * Isolates R/G/B channels via feColorMatrix, offsets them, and recomposites.
 */
export const ChromaticAberrationFilter: React.FC<{
  id?: string;
  offset?: number;
}> = ({ id = "vox-chromatic-aberration", offset = 0.8 }) => (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <filter id={id} colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="SourceGraphic" result="red" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" in="SourceGraphic" result="green" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" in="SourceGraphic" result="blue" />
        <feOffset in="red" dx={-offset} dy={0} result="redShifted" />
        <feOffset in="blue" dx={offset} dy={0} result="blueShifted" />
        <feComposite in="redShifted" in2="green" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="rg" />
        <feComposite in="rg" in2="blueShifted" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} />
      </filter>
    </defs>
  </svg>
);

/**
 * Roughen edges filter — adds organic imperfection to shapes.
 */
export const RoughenEdgesFilter: React.FC<{
  id?: string;
  roughness?: number;
  baseFrequency?: number;
}> = ({ id = "vox-roughen-edges", roughness = 3, baseFrequency = 0.04 }) => (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <filter id={id}>
        <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves={4} seed={1} result="turbulence" />
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale={roughness} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

/**
 * Procedural grain overlay filter.
 */
export const GrainFilter: React.FC<{
  id?: string;
  intensity?: number;
}> = ({ id = "vox-grain", intensity = 0.15 }) => (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <filter id={id}>
        <feTurbulence type="fractal" baseFrequency={0.65} numOctaves={3} result="grain" />
        <feColorMatrix type="saturate" values="0" in="grain" result="grainBW" />
        <feBlend in="SourceGraphic" in2="grainBW" mode="overlay" />
      </filter>
    </defs>
  </svg>
);
