import { Injectable, signal } from '@angular/core';

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
    document.documentElement.style.setProperty('--user-accent', hex);
    document.documentElement.style.setProperty('--theme-color', hex);
    const rgb = this.hexToRgb(hex);
    document.documentElement.style.setProperty('--theme-color-rgb', rgb);
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '48, 105, 212';
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
