import type { EmailPreferences } from '../types/notification';

const STORAGE_KEY = 'sprintfund-email-preferences';

export const DEFAULT_EMAIL_PREFERENCES: EmailPreferences = {
  enabled: false,
  address: '',
  digestMode: 'daily',
};

export function loadEmailPreferences(): EmailPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_EMAIL_PREFERENCES };
    const parsed = JSON.parse(raw);
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : false,
      address: typeof parsed.address === 'string' ? parsed.address : '',
      digestMode: ['instant', 'daily', 'weekly'].includes(parsed.digestMode)
        ? parsed.digestMode
        : 'daily',
    };
  } catch {
    return { ...DEFAULT_EMAIL_PREFERENCES };
  }
}

export function saveEmailPreferences(prefs: EmailPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage full or unavailable
  }
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
