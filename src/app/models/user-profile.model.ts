import { Timestamp } from '@angular/fire/firestore';

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
  createdAt: Timestamp;
  /** Accent color (hex) for UI; optional for legacy profiles. */
  themeColor?: string;
}
