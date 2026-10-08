// Simple single-admin auth. No user table, since this is one shared
// staff login, not multi-user. Uses Web Crypto so this file works in both
// the Edge middleware and normal Node API routes without changes.

export const COOKIE_NAME = "lavish_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkPassword(candidate: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return candidate === password;
}

// The cookie value is just a hash of the real password. Anyone who knows
// the password can compute this, but that's fine, they'd be able to log
// in anyway. This just avoids storing the raw password in a cookie.
export async function getExpectedSessionValue(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return sha256Hex(`lavish-admin-session:${password}`);
}

export { SESSION_MAX_AGE_SECONDS };
