/** White swatch: light surface mode (inverted primary controls). */
export const THEME_SURFACE_LIGHT_HEX = '#FFFFFF';

/** Black swatch: dark surface mode (inverted primary controls). */
export const THEME_SURFACE_DARK_HEX = '#000000';

/** Preset theme swatches; first and third entries are surface modes, others are chromatic accents. */
export const THEME_SWATCHES = [
  "#0B51C1",
  "#165B24",
  "#805B00",
  "#B24300",
  "#BD1A1A",
  "#621FA6",
  THEME_SURFACE_LIGHT_HEX,
  '#3B3B3B',
  THEME_SURFACE_DARK_HEX
] as const;

export type ThemeSwatchHex = (typeof THEME_SWATCHES)[number];
