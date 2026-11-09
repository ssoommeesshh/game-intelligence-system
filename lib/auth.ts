import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { query } from "./db/mysql";
import bcrypt from "bcryptjs";

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface SessionPayload extends SessionUser {
  expiresAt: number;
}

const SESSION_COOKIE_NAME = "gis_session";
const SESSION_LIFETIME_SECONDS = 7 * 24 * 60 * 60;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is required for cookie authentication");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function encodeSession(session: object): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(value: string): SessionPayload | null {
  const [payload, signature, ...extra] = value.split(".");
  if (!payload || !signature || extra.length > 0) return null;
  const expected = sign(payload);
  const supplied = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (supplied.length !== expectedBuffer.length || !timingSafeEqual(supplied, expectedBuffer)) return null;
  const decoded: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
  if (!decoded || typeof decoded !== "object") return null;
  const session = decoded as Partial<SessionPayload>;
  if (typeof session.userId !== "string" || typeof session.name !== "string" || typeof session.email !== "string" || (session.role !== "USER" && session.role !== "ADMIN") || typeof session.expiresAt !== "number") return null;
  return session as SessionPayload;
}

// Base64-encoded JSON session with HMAC/timestamp simulation
export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  const sessionData = {
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  cookieStore.set(SESSION_COOKIE_NAME, encodeSession(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_LIFETIME_SECONDS,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const decoded = decodeSession(sessionCookie.value);
    if (!decoded) return null;
    if (!decoded.userId || !decoded.expiresAt || decoded.expiresAt < Date.now()) {
      return null;
    }

    // Verify user exists in MySQL
    const users = await query<any>(
      "SELECT user_id, name, email, role FROM `USER` WHERE user_id = ?",
      [decoded.userId]
    );

    if (users.length === 0) {
      return null;
    }

    return {
      userId: users[0].user_id,
      name: users[0].name,
      email: users[0].email,
      role: users[0].role,
    };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function verifyUserCredentials(email: string, passwordPlain: string): Promise<SessionUser | null> {
  const users = await query<any>(
    "SELECT user_id, name, email, password_hash, role FROM `USER` WHERE email = ?",
    [email.trim().toLowerCase()]
  );

  if (users.length === 0) {
    return null;
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(passwordPlain, user.password_hash);
  if (!isMatch) {
    return null;
  }

  return {
    userId: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
