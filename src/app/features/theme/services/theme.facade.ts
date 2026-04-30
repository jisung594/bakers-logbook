import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';
import { UserFacadeService } from '../../user/services/user.facade';

export interface ThemeStatus {
  status: 'idle' | 'applying' | 'error';
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeFacadeService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly themeService = inject(ThemeService);
  private readonly userFacade = inject(UserFacadeService);

  private readonly themeStatusSubject = new BehaviorSubject<ThemeStatus>({ status: 'idle' });
  readonly themeStatus$: Observable<ThemeStatus> = this.themeStatusSubject.asObservable();

  readonly isDemoMode$: Observable<boolean> = this.userFacade.isDemoMode$;

  constructor() {
    this.userFacade.userProfile$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((profile) => {
        if (this.themeService.isModalOpen()) {
          return;
        }
        const hex = profile?.themeColor ?? ThemeService.DEFAULT_ACCENT;
        this.themeService.setSavedColor(hex);
        this.themeService.resetPreviewToSaved();
      });
  }

  /** Current preview accent hex (used for immediate UI updates). */
  previewColor(): string {
    return this.themeService.previewColor();
  }

  /** Persisted accent hex (hydrated from the user profile). */
  savedColor(): string {
    return this.themeService.savedColor();
  }

  /**
   * Start a palette session. The facade will keep local preview state isolated
   * until the dialog closes.
   */
  beginPaletteSession(dialogRef: MatDialogRef<unknown>): void {
    this.themeService.setModalOpen(true);
    this.themeService.resetPreviewToSaved();

    dialogRef
      .beforeClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.themeService.setModalOpen(false);
        this.themeStatusSubject.next({ status: 'idle' });
      });
  }

  /** Apply an accent preview immediately (not persisted). */
  previewThemeColor(hex: string): void {
    this.themeStatusSubject.next({ status: 'applying' });
    this.themeService.setPreviewColor(hex);
    this.themeStatusSubject.next({ status: 'idle' });
  }

  /**
   * Persist the current preview color to the signed-in user's profile.
   * Returns `true` when saved, `false` when not saved.
   */
  async commitThemeColor(): Promise<boolean> {
    const uid = this.userFacade.currentUid();
    if (!uid) {
      return false;
    }
    try {
      this.themeStatusSubject.next({ status: 'applying' });
      const color = this.themeService.previewColor();
      await this.userFacade.updateThemeColor(uid, color);
      this.themeService.commitPreviewToSaved();
      this.themeStatusSubject.next({ status: 'idle' });
      return true;
    } catch {
      this.themeStatusSubject.next({
        status: 'error',
        message: 'Failed to save theme color. Please try again.',
      });
      return false;
    }
  }

  /** Revert preview + DOM back to the persisted saved color. */
  revertThemePreview(): void {
    this.themeService.revertPreviewAndDomToSaved();
    this.themeStatusSubject.next({ status: 'idle' });
  }
}

