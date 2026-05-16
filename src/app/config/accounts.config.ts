/**
 * Account roles for Pinch.
 * - Dev: your private seed account (sign in via login form; full edit access).
 * - Preview: public read-only demo (DEMO button only; credentials in preview-auth.config.ts).
 */
export const ACCOUNTS = {
  devEmail: 'demo@pinchthis.com',
  previewEmail: 'preview@pinchthis.com',
} as const;
