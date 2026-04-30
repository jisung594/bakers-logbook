import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { THEME_SWATCHES } from '../shared/models/theme.model';
import { ThemeFacadeService } from '../features/theme/services/theme.facade';

@Component({
  selector: 'app-theme-palette-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatTooltipModule],
  templateUrl: './theme-palette-modal.html',
  styleUrl: './theme-palette-modal.css',
})
export class ThemePaletteModalComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<ThemePaletteModalComponent>);
  readonly theme = inject(ThemeFacadeService);

  readonly swatches = THEME_SWATCHES;

  readonly isDemo = toSignal(this.theme.isDemoMode$, { initialValue: false });

  readonly previewDiffersFromSaved = computed(
    () => this.theme.previewColor() !== this.theme.savedColor(),
  );

  constructor() {
    this.dialogRef
      .beforeClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.theme.revertThemePreview());
  }

  onSwatchClick(hex: string): void {
    this.theme.previewThemeColor(hex);
  }

  async saveAndClose(isDemo: boolean): Promise<void> {
    if (isDemo) {
      return;
    }
    const saved = await this.theme.commitThemeColor();
    if (saved) {
      this.dialogRef.close();
    }
  }

  cancel(): void {
    this.theme.revertThemePreview();
    this.dialogRef.close();
  }
}
