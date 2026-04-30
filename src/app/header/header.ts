import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthFacadeService } from '../features/auth/services/auth.facade';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { AccountMenu } from '../auth/account-menu/account-menu';
import type { User } from 'firebase/auth';
import { ThemeFacadeService } from '../features/theme/services/theme.facade';
import { ThemePaletteModalComponent } from '../theme-palette-modal/theme-palette-modal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AccountMenu, CommonModule, RouterModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  user$!: Observable<User | null>;
  isDemo$!: Observable<boolean>;
  isMenuOpen = false;

  constructor(
    private authFacade: AuthFacadeService,
    private themeFacade: ThemeFacadeService,
    private dialog: MatDialog,
  ) {
    this.user$ = this.authFacade.authState$;
    this.isDemo$ = this.authFacade.isDemoMode$;
  }

  openThemePalette(): void {
    const ref = this.dialog.open(ThemePaletteModalComponent, {
      width: 'min(92vw, 360px)',
      autoFocus: 'dialog',
    });
    this.themeFacade.beginPaletteSession(ref);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
