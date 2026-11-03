"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Key, Mail, ShieldAlert, AlertCircle, User } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/games";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    const submitEmail = loginEmail || email;
    const submitPassword = loginPassword || password;

    if (!submitEmail || !submitPassword) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: submitEmail, password: submitPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Invalid email or password");
      }

      router.push(nextUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 rounded-xl flex items-center justify-center mx-auto">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-extrabold text-white">Platform Authentication</h1>
        <p className="text-xs text-slate-400">
          Sign in to access personal wishlists and administrative tools.
        </p>
      </div>

      {error && (
        <div className="mt-5 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Manual Login Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="mt-6 space-y-4 text-xs"
      >
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition shadow disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>

      {/* 1-Click Demo Accounts for Faculty Walkthrough */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block text-center mb-3">
          1-Click Demonstration Accounts
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleLogin("sreejith@example.com", "password123")}
            className="p-2.5 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/60 rounded-xl text-left transition"
          >
            <div className="font-bold text-amber-300 flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Sreejith (Admin)</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Role: ADMIN</div>
          </button>

          <button
            type="button"
            onClick={() => handleLogin("somesh@example.com", "password123")}
            className="p-2.5 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/60 rounded-xl text-left transition"
          >
            <div className="font-bold text-amber-300 flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Somesh (Admin)</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Role: ADMIN</div>
          </button>

          <button
            type="button"
            onClick={() => handleLogin("aarav@example.com", "password123")}
            className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition"
          >
            <div className="font-bold text-slate-200 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Aarav (User 1)</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Role: USER</div>
          </button>

          <button
            type="button"
            onClick={() => handleLogin("diya@example.com", "password123")}
            className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition"
          >
            <div className="font-bold text-slate-200 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Diya (User 2)</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Role: USER</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-500 text-xs">Loading login form...</div>}>
      <LoginForm />
    </Suspense>
  );
}
