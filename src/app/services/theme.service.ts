import { Injectable, signal } from '@angular/core';
import { resolveThemeTokens } from '../shared/theme/theme-tokens';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  static readonly DEFAULT_ACCENT = '#3069d4';

  /** Persisted theme (hydrated by facade from the current user profile). */
  readonly savedColor = signal(ThemeService.DEFAULT_ACCENT);
  /** Live preview while the palette modal is open. */
  readonly previewColor = signal(ThemeService.DEFAULT_ACCENT);

  private readonly modalOpen = signal(false);
  constructor() {}

  setModalOpen(open: boolean): void {
    this.modalOpen.set(open);
  }

  isModalOpen(): boolean {
    return this.modalOpen();
  }

  setSavedColor(hex: string): void {
    this.savedColor.set(hex);
  }

  /** Call when opening the palette: align preview with saved. */
  resetPreviewToSaved(): void {
    const s = this.savedColor();
    this.previewColor.set(s);
    this.applyAccentToDocument(s);
  }

  applyPreviewToDocument(): void {
    this.applyAccentToDocument(this.previewColor());
  }

  applyAccentToDocument(hex: string): void {
    const tokens = resolveThemeTokens(hex);
    const root = document.documentElement;

    root.style.setProperty('--theme-color', tokens.themeColor);
    root.style.setProperty('--theme-color-rgb', tokens.themeColorRgb);
    root.style.setProperty('--text-accent', tokens.textAccent);
    root.style.setProperty('--border-accent', tokens.borderAccent);
    root.style.setProperty('--user-accent', tokens.userAccent);
    root.style.setProperty('--btn-primary-bg', tokens.btnPrimaryBg);
    root.style.setProperty('--btn-primary-fg', tokens.btnPrimaryFg);
    root.style.setProperty('--page-background', tokens.pageBackground);

    if (tokens.themeSurface === 'chromatic') {
      root.removeAttribute('data-theme-surface');
    } else {
      root.setAttribute('data-theme-surface', tokens.themeSurface);
    }
  }

  setPreviewColor(hex: string): void {
    this.previewColor.set(hex);
    this.applyAccentToDocument(hex);
  }

  /** After close without save, or mobile Cancel. */
  revertPreviewAndDomToSaved(): void {
    const s = this.savedColor();
    this.previewColor.set(s);
    this.applyAccentToDocument(s);
  }

  commitPreviewToSaved(): void {
    this.savedColor.set(this.previewColor());
  }
}
