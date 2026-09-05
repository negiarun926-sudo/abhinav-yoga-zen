const encoder = new TextEncoder();

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function b64url(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(payload: string) {
  const secret = process.env["ADMIN_SESSION_SECRET"];
  if (!secret) throw new Error("Admin session secret is not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return b64url(new Uint8Array(sig));
}

export async function createAdminToken() {
  const payload = `admin.${Date.now() + SESSION_TTL_MS}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifyAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = await hmac(payload);
  if (expected.length !== parts[2]!.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ parts[2]!.charCodeAt(i);
  }
  if (diff !== 0) return false;
  const expiry = Number(parts[1]);
  return Number.isFinite(expiry) && expiry > Date.now();
}

export async function requireAdmin(token: string | undefined | null) {
  if (!(await verifyAdminToken(token))) {
    throw new Error("Not authorised");
  }
}

export function checkCredentials(username: string, password: string) {
  const u = process.env["ADMIN_USERNAME"];
  const p = process.env["ADMIN_PASSWORD"];
  if (!u || !p) throw new Error("Admin credentials are not configured");
  return username === u && password === p;
}
