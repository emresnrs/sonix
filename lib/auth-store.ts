// Dahili kullanıcı yönetimi — localStorage tabanlı

export interface User {
  id: string;
  username: string;
  fullName: string;
  passwordHash: string;
  createdAt: number;
}

export interface Session {
  userId: string;
  username: string;
  fullName: string;
}

const USERS_KEY = "sonix_users";
const SESSION_KEY = "sonix_session";

// ─── Yardımcı ─────────────────────────────────────────────────────────────

/** Basit, tersine çevrilebilir encode — dahili kullanım için yeterli */
function hashPassword(password: string): string {
  return btoa(unescape(encodeURIComponent(password + "_sonix_salt")));
}

function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ─── Kullanıcı İşlemleri ──────────────────────────────────────────────────

export type RegisterResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

export function registerUser(
  fullName: string,
  username: string,
  password: string
): RegisterResult {
  const users = getUsers();

  const trimmedUsername = username.trim().toLowerCase();

  if (trimmedUsername.length < 3) {
    return { ok: false, error: "Kullanıcı adı en az 3 karakter olmalı." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Şifre en az 6 karakter olmalı." };
  }
  if (users.some((u) => u.username === trimmedUsername)) {
    return { ok: false, error: "Bu kullanıcı adı zaten kullanılıyor." };
  }

  const newUser: User = {
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    username: trimmedUsername,
    fullName: fullName.trim(),
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  };

  saveUsers([...users, newUser]);
  return { ok: true, user: newUser };
}

export type LoginResult =
  | { ok: true; session: Session }
  | { ok: false; error: string };

export function loginUser(username: string, password: string): LoginResult {
  const users = getUsers();
  const trimmedUsername = username.trim().toLowerCase();

  const user = users.find(
    (u) =>
      u.username === trimmedUsername &&
      u.passwordHash === hashPassword(password)
  );

  if (!user) {
    return { ok: false, error: "Kullanıcı adı veya şifre hatalı." };
  }

  const session: Session = {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getCurrentUser(): Session | null {
  return getSession();
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
