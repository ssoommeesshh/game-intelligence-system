"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Gamepad2, Heart, DollarSign, LogIn, LogOut, User as UserIcon, ShieldAlert } from "lucide-react";

interface User {
  userId: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/games" className="flex items-center space-x-2 text-cyan-400 font-bold text-xl tracking-wide hover:text-cyan-300">
            <Gamepad2 className="w-6 h-6" />
            <span>GameIntel</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/games"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname.startsWith("/games")
                  ? "bg-slate-800 text-cyan-400"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              Game Catalog
            </Link>

            <Link
              href="/wishlists"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname.startsWith("/wishlists")
                  ? "bg-slate-800 text-cyan-400"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Wishlists & Deals</span>
            </Link>

            {user?.role === "ADMIN" && (
              <Link
                href="/admin/prices"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname.startsWith("/admin")
                    ? "bg-amber-950/50 text-amber-400 border border-amber-800/60"
                    : "text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/30"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Admin Pricing</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex flex-col items-end text-xs">
                    <span className="font-semibold text-slate-200">{user.name}</span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      {user.role === "ADMIN" && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                          ADMIN
                        </span>
                      )}
                      <span>{user.email}</span>
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
