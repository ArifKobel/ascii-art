import { useDialKitController, type DialConfig } from "dialkit";
import { useCallback, useMemo, useState } from "react";
import type { AsciiSettings } from "#/lib/ascii/types";

const CHARSETS = {
  poster: " .:-=+*TA#ER%@",
  classic: " .:-=+*#%@",
  dense: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  blocks: " ░▒▓█",
  binary: " 01",
} as const;

const FORMATS = {
  portrait: { width: 1080, height: 1350 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  landscape: { width: 1920, height: 1080 },
} as const;

const CONFIG = {
  format: {
    type: "select",
    options: [
      { value: "portrait", label: "Portrait 4:5" },
      { value: "square", label: "Square 1:1" },
      { value: "story", label: "Story 9:16" },
      { value: "landscape", label: "Landscape 16:9" },
    ],
  },
  backgroundRemoval: {
    enabled: true,
    tolerance: [0.18, 0, 0.6, 0.01],
  },
  backgroundColor: "#2b45f5",
  grain: [0.32, 0, 1, 0.01],
  color: {
    ink: "#ffffff",
    imageColors: false,
    saturation: [1.2, 0, 2.5, 0.01],
  },
  glyphs: {
    charset: {
      type: "select",
      options: [
        { value: "poster", label: "Poster" },
        { value: "classic", label: "Classic" },
        { value: "dense", label: "Dense" },
        { value: "blocks", label: "Blocks" },
        { value: "binary", label: "Binary" },
        { value: "custom", label: "Custom" },
      ],
    },
    customCharset: { type: "text", default: " .:AI", placeholder: "Sparse → dense" },
    font: {
      type: "select",
      options: ["JetBrains Mono", "IBM Plex Mono", "Space Mono", "DM Mono"],
    },
    columns: [96, 24, 240, 1],
    rowHeight: [1.6, 0.8, 2.6, 0.05],
    glyphSize: [0.62, 0.2, 1.2, 0.01],
    jitter: [0.4, 0, 1, 0.01],
    shuffle: { type: "action", label: "Shuffle characters" },
  },
  tone: {
    brightness: [0, -0.5, 0.5, 0.01],
    contrast: [1.2, 0.2, 3, 0.01],
    gamma: [1, 0.3, 3, 0.01],
    cutoff: [0.12, 0, 0.9, 0.01],
    fade: [0, 0, 1, 0.01],
    invert: false,
  },
  placement: {
    scale: [0.82, 0.2, 2.5, 0.01],
    position: { type: "pad", y: [0.08, -1, 1, 0.01] },
  },
  title: {
    size: [112, 24, 240, 1],
    font: { type: "select", options: ["Inter", "Space Grotesk", "JetBrains Mono"] },
    color: "#ffffff",
  },
} satisfies DialConfig;

type CharsetKey = keyof typeof CHARSETS;
type FormatKey = keyof typeof FORMATS;

export function usePosterSettings(titleText: string) {
  const [seed, setSeed] = useState(1);
  const reseed = useCallback((action: string) => {
    if (action.endsWith("shuffle")) setSeed((value) => value + 1);
  }, []);

  const { values, resetValues } = useDialKitController("Settings", CONFIG, {
    id: "poster",
    persist: true,
    onAction: reseed,
  });

  const settings = useMemo<AsciiSettings>(() => {
    const { glyphs, tone, backgroundRemoval, placement, title } = values;
    const charset =
      glyphs.charset === "custom" ? glyphs.customCharset : CHARSETS[glyphs.charset as CharsetKey];

    return {
      ...FORMATS[values.format as FormatKey],
      background: values.backgroundColor,
      grain: values.grain,
      color: values.color,
      glyphs: {
        font: glyphs.font,
        charset,
        columns: glyphs.columns,
        rowHeight: glyphs.rowHeight,
        glyphSize: glyphs.glyphSize,
        jitter: glyphs.jitter,
        seed,
      },
      tone,
      knockout: backgroundRemoval,
      placement: { scale: placement.scale, ...placement.position },
      title: { ...title, text: titleText },
    };
  }, [values, seed, titleText]);

  return { settings, reset: resetValues };
}
