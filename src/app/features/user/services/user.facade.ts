import { Injectable, inject } from '@angular/core';
import { Firestore, doc, serverTimestamp, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import type { UserProfile } from '../../../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  get userProfile$(): Observable<UserProfile | null> {
    return this.authService.userProfile$;
  }

  get isDemoMode$(): Observable<boolean> {
    return this.authService.isDemoMode;
  }

  currentUid(): string | null {
    return this.authService.getCurrentUser()?.uid ?? null;
  }

  async updateThemeColor(uid: string, themeColor: string): Promise<void> {
    await updateDoc(doc(this.firestore, 'users', uid), {
      themeColor,
      updatedAt: serverTimestamp(),
    });
  }
}
