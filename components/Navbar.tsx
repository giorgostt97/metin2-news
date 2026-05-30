"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load profile from DB
  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    setUserProfile(data || null);
  }

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      console.log("SESSION:", data.session);
      const sessionUser = data.session?.user ?? null;

      setUser(sessionUser);

      if (sessionUser?.id) {
        await loadProfile(sessionUser.id);
      }
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user ?? null;

        setUser(sessionUser);

        if (sessionUser?.id) {
          await loadProfile(sessionUser.id);
        } else {
          setUserProfile(null);
        }
      }
    );

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
    setUser(null);
    setUserProfile(null);
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

          {/* USER STATE */}
          {!user ? (
            <>
              <a
                href="/login"
                className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700"
              >
                Login
              </a>

              <a
                href="/register"
                className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold hover:bg-yellow-400"
              >
                Register
              </a>
            </>
          ) : (
            <>
              <a
                href={`/user/${user.id}`}
                className="text-zinc-400 hover:text-yellow-400"
              >
                {userProfile?.username ||
                  user?.email?.split("@")[0] ||
                  "User"}
              </a>

              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded-xl font-bold"
              >
                Logout
              </button>
            </>
          )}

          {/* DISCORD */}
          <a
            href="https://discord.com"
            target="_blank"
            className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold hover:bg-yellow-400"
          >
            Discord
          </a>
        </nav>

        {/* MOBILE BUTTON */}
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
              <a
                href={`/user/${user.id}`}
                className="block text-yellow-400 text-center"
              >
                👤 {userProfile?.username || user?.email || "User"}
              </a>

              <button
                onClick={logout}
                className="block bg-red-500 px-4 py-2 rounded-xl text-center w-full"
              >
                Logout
              </button>
            </>
          )}

          {/* DISCORD */}
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