import { classifyThemeSurface, resolveThemeTokens } from './theme-tokens';

describe('theme-tokens', () => {
  it('classifies white and black as surface modes', () => {
    expect(classifyThemeSurface('#ffffff')).toBe('light');
    expect(classifyThemeSurface('#000000')).toBe('dark');
    expect(classifyThemeSurface('#0B51C1')).toBe('chromatic');
    expect(classifyThemeSurface('#656565')).toBe('chromatic');
  });

  it('inverts primary button tokens for light surface', () => {
    const tokens = resolveThemeTokens('#FFFFFF');
    expect(tokens.btnPrimaryBg).toBe('#000000');
    expect(tokens.btnPrimaryFg).toBe('#FFFFFF');
    expect(tokens.textAccent).toBe('#000000');
    expect(tokens.themeSurface).toBe('light');
  });

  it('inverts primary button tokens for dark surface', () => {
    const tokens = resolveThemeTokens('#000000');
    expect(tokens.btnPrimaryBg).toBe('#FFFFFF');
    expect(tokens.btnPrimaryFg).toBe('#000000');
    expect(tokens.textAccent).toBe('#FFFFFF');
    expect(tokens.themeSurface).toBe('dark');
  });

  it('keeps chromatic accent tokens aligned with swatch hex', () => {
    const tokens = resolveThemeTokens('#0B51C1');
    expect(tokens.btnPrimaryBg).toBe('#0B51C1');
    expect(tokens.textAccent).toBe('#0B51C1');
    expect(tokens.themeSurface).toBe('chromatic');
  });
});
