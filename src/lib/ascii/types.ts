export type ImageSource = {
  element: CanvasImageSource;
  width: number;
  height: number;
};

export type Rgba = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type ColorSettings = {
  ink: string;
  imageColors: boolean;
  saturation: number;
};

export type GlyphSettings = {
  font: string;
  charset: string;
  columns: number;
  rowHeight: number;
  glyphSize: number;
  jitter: number;
  seed: number;
};

export type ToneSettings = {
  brightness: number;
  contrast: number;
  gamma: number;
  cutoff: number;
  fade: number;
  invert: boolean;
};

export type KnockoutSettings = {
  enabled: boolean;
  tolerance: number;
};

export type PlacementSettings = {
  scale: number;
  x: number;
  y: number;
};

export type TitleSettings = {
  text: string;
  size: number;
  font: string;
  color: string;
};

export type AsciiSettings = {
  width: number;
  height: number;
  background: string;
  grain: number;
  color: ColorSettings;
  glyphs: GlyphSettings;
  tone: ToneSettings;
  knockout: KnockoutSettings;
  placement: PlacementSettings;
  title: TitleSettings;
};
