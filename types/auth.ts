export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Storing plain text password for now, since it's local storage and mock auth
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  expiresAt: string;
}
