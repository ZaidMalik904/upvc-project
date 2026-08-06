import { AdminUser, AuthSession } from '../types/auth';

const ADMINS_KEY = 'upvc_admins_v1';
const SESSION_KEY = 'upvc_session_v1';

export function getStoredAdmins(): AdminUser[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ADMINS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveAdmin(admin: AdminUser): void {
  const admins = getStoredAdmins();
  admins.push(admin);
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  }
}

export function getCurrentSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setCurrentSession(session: AuthSession | null): void {
  if (typeof window !== 'undefined') {
    if (session) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }
}
