/** Preset accents (light/medium tints) that pair well with black text. */
export const THEME_SWATCHES = [
  '#90CAF9',
  '#81D4FA',
  '#80CBC4',
  '#A5D6A7',
  '#FFF59D',
  '#FFCC80',
  '#CE93D8',
  '#B39DDB',
] as const;

export type ThemeSwatchHex = (typeof THEME_SWATCHES)[number];
