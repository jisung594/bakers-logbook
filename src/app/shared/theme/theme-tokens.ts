import { THEME_SURFACE_DARK_HEX, THEME_SURFACE_LIGHT_HEX } from '../models/theme.model';

/** How a swatch maps to page surfaces and control tokens. */
export type ThemeSurface = 'chromatic' | 'light' | 'dark';

export interface ThemeTokens {
  themeColor: string;
  themeColorRgb: string;
  textAccent: string;
  borderAccent: string;
  userAccent: string;
  btnPrimaryBg: string;
  btnPrimaryFg: string;
  pageBackground: string;
  themeSurface: ThemeSurface;
}

const BTN_FG_ON_ACCENT = '#FFFFFF';
const LIGHT_PAGE_END = '#FFFFFF';
const DARK_PAGE_END = '#000000';

/**
 * Maps a saved/preview hex to surface mode. White and black are full surface modes;
 * gray and chromatic swatches keep the standard accent treatment.
 */
export function classifyThemeSurface(hex: string): ThemeSurface {
  const normalized = normalizeHex(hex);
  if (normalized === THEME_SURFACE_LIGHT_HEX) {
    return 'light';
  }
  if (normalized === THEME_SURFACE_DARK_HEX) {
    return 'dark';
  }
  return 'chromatic';
}

/**
 * Derives document CSS custom properties for the active theme swatch.
 */
export function resolveThemeTokens(hex: string): ThemeTokens {
  const themeColor = normalizeHex(hex);
  const themeColorRgb = hexToRgb(themeColor);
  const surface = classifyThemeSurface(themeColor);

  if (surface === 'light') {
    return {
      themeColor,
      themeColorRgb,
      textAccent: '#000000',
      borderAccent: '#a2d3ff',
      userAccent: '#000000',
      btnPrimaryBg: '#3069d4',
      // btnPrimaryFg: BTN_FG_ON_ACCENT,
      btnPrimaryFg: '#FFFFFF',
      pageBackground: 'linear-gradient(135deg, #f0f0f0, #ffffff)',
      themeSurface: 'light',
    };
  }

  if (surface === 'dark') {
    return {
      themeColor,
      themeColorRgb,
      textAccent: '#FFFFFF',
      borderAccent: '#a2d3ff',
      userAccent: '#FFFFFF',
      btnPrimaryBg: '#3069d4',
      btnPrimaryFg: '#FFFFFF',
      pageBackground: 'linear-gradient(135deg, #1a1a1a, #000000)',
      themeSurface: 'dark',
    };
  }

  return {
    themeColor,
    themeColorRgb,
    textAccent: themeColor,
    borderAccent: themeColor,
    userAccent: themeColor,
    btnPrimaryBg: themeColor,
    btnPrimaryFg: BTN_FG_ON_ACCENT,
    pageBackground: `linear-gradient(135deg, rgba(${themeColorRgb}, 0.35), ${LIGHT_PAGE_END})`,
    themeSurface: 'chromatic',
  };
}

function normalizeHex(hex: string): string {
  const trimmed = hex.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  return withHash.toUpperCase();
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '48, 105, 212';
}
