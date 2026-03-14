/**
 * BorderBridge demo auth config.
 * All credentials are hardcoded for demo purposes — no backend call needed.
 *
 * Username: first 3 letters of name + birth year
 * Password: first 3 letters of name + office code + birth date DDMM
 */

export interface BBUser {
  username: string;
  name: string;
  role: "authority" | "refugee";
  display: string;
}

interface DemoUser extends BBUser {
  password: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    username: "jam1988",
    password: "jamBPA1503",
    name: "James Okafor",
    role: "authority",
    display: "Officer J.",
  },
  {
    username: "fat1992",
    password: "fatBPA2207",
    name: "Fatima Hassan",
    role: "authority",
    display: "Officer F.",
  },
  {
    username: "ref2001",
    password: "refBPA0105",
    name: "Refugee User",
    role: "refugee",
    display: "Refugee",
  },
];

export const BB_USER_KEY = "bb_user";

/** Attempt login. Returns the BBUser on success or null on failure. */
export function authenticate(username: string, password: string): BBUser | null {
  const found = DEMO_USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!found) return null;
  const { password: _pw, ...user } = found;
  return user;
}

/** Persist the logged-in user to localStorage. */
export function setCurrentUser(user: BBUser): void {
  localStorage.setItem(BB_USER_KEY, JSON.stringify(user));
}

/** Retrieve the logged-in user from localStorage, or null. */
export function getCurrentUser(): BBUser | null {
  try {
    const raw = localStorage.getItem(BB_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BBUser;
  } catch {
    return null;
  }
}

/** Remove the logged-in user from localStorage. */
export function clearCurrentUser(): void {
  localStorage.removeItem(BB_USER_KEY);
}

/** Map role to X-Demo-Username header value for the backend. */
export function getDemoUsername(user: BBUser | null): string {
  if (!user) return "auth_manager";
  return user.role === "refugee" ? "refugee_user" : "auth_manager";
}
