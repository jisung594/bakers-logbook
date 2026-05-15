/** Preset accents (light/medium tints) that pair well with black text. */
export const THEME_SWATCHES = [
  "#FFFFFF",
  "#656565",
  "#000000",
  "#0B51C1",
  "#165B24",
  "#805B00",
  "#B24300",
  "#BD1A1A",
  "#621FA6"
] as const;

export type ThemeSwatchHex = (typeof THEME_SWATCHES)[number];
