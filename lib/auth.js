/**
 * FRICTION POINT — ADMIN AUTH
 * ===========================
 * Deliberately minimal: one shared password (ADMIN_PASSWORD), no user
 * accounts. A successful login sets a signed, httpOnly cookie that
 * expires after 7 days. No external auth library — just an HMAC
 * signature over an expiry timestamp, verified on every /admin request
 * in middleware.js.
 *
 * Uses the Web Crypto API so the same code runs in both the Edge
 * middleware and Node API routes.
 */

const COOKIE_NAME = "fp_admin_session";
const SESSION_DAYS = 7;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your environment variables."
    );
  }
  return secret;
}

// Uses btoa/atob (Web APIs) rather than Node's Buffer so this file works
// unchanged in both the Edge middleware and Node API routes.
function base64url(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlToBytes(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return base64url(new Uint8Array(sig));
}

/** Creates a signed session token: base64url(payload).signature */
export async function createSessionToken() {
  const payload = JSON.stringify({
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
  const payloadB64 = base64url(new TextEncoder().encode(payload));
  const sig = await hmac(payloadB64, getSecret());
  return `${payloadB64}.${sig}`;
}

/** Verifies a session token. Returns true/false. */
export async function verifySessionToken(token) {
  if (!token || !token.includes(".")) return false;
  const [payloadB64, sig] = token.split(".");
  const expectedSig = await hmac(payloadB64, getSecret());
  if (sig !== expectedSig) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64urlToBytes(payloadB64)));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function checkPassword(candidate) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) {
    throw new Error("ADMIN_PASSWORD is not set. Add it to your environment variables.");
  }
  return candidate === real;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60; // seconds, for cookie maxAge
