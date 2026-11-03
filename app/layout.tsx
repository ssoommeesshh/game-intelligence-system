import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Game Intelligence & Market Analytics Platform",
  description: "DBMS Project - Relational Catalog, Price Tracking, Wishlists, and Market Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <p>Game Intelligence & Market Analytics Platform &bull; DBMS Level 3 Project &bull; Team: Somesh & Sreejith</p>
        </footer>
      </body>
    </html>
  );
}
