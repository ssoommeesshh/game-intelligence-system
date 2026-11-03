import { cookies } from "next/headers";
import { query } from "./db/mysql";
import bcrypt from "bcryptjs";

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

const SESSION_COOKIE_NAME = "gis_session";

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

  const payload = Buffer.from(JSON.stringify(sessionData)).toString("base64");
  cookieStore.set(SESSION_COOKIE_NAME, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
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

    const decoded = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString("utf-8"));
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
