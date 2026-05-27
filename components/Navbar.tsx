"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const linkClass = (path: string) =>
    `transition hover:text-yellow-400 ${
      pathname === path ? "text-yellow-400 font-bold" : "text-white"
    }`;

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="border-b border-zinc-800 bg-black/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex items-center justify-between">

        {/* LOGO */}
        <a href="/" className="text-2xl font-black text-yellow-400">
          Metin2Top
        </a>

        {/* DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 text-sm">

          <a href="/" className={linkClass("/")}>Home</a>
          <a href="/news" className={linkClass("/news")}>News</a>
          <a href="/submit" className={linkClass("/submit")}>Submit</a>
          <a href="/admin" className={linkClass("/admin")}>Admin</a>

          {!user ? (
            <>
              <a href="/login" className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700">
                Login
              </a>

              <a href="/register" className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold hover:bg-yellow-400">
                Register
              </a>
            </>
          ) : (
            <>
              <span className="text-zinc-400">
                👤 {user.email}
              </span>

              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded-xl font-bold"
              >
                Logout
              </button>
            </>
          )}

          <a
            href="https://discord.com"
            target="_blank"
            className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold hover:bg-yellow-400"
          >
            Discord
          </a>
        </nav>

        {/* MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-black px-4 py-4 space-y-4">

          <a href="/" className="block">Home</a>
          <a href="/news" className="block">News</a>
          <a href="/submit" className="block">Submit</a>
          <a href="/admin" className="block">Admin</a>

          {!user ? (
            <>
              <a href="/login" className="block bg-zinc-800 px-4 py-2 rounded-xl text-center">
                Login
              </a>

              <a href="/register" className="block bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold text-center">
                Register
              </a>
            </>
          ) : (
            <>
              <div className="text-zinc-400 text-sm">
                {user.email}
              </div>

              <button
                onClick={logout}
                className="block bg-red-500 px-4 py-2 rounded-xl text-center w-full"
              >
                Logout
              </button>
            </>
          )}

          <a
            href="https://discord.com"
            target="_blank"
            className="block bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold text-center"
          >
            Discord
          </a>
        </div>
      )}
    </header>
  );
}