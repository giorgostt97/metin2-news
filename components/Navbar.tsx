"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (path: string) =>
    `transition hover:text-yellow-400 ${
      pathname === path ? "text-yellow-400 font-bold" : "text-white"
    }`;

  return (
    <header className="border-b border-zinc-800 bg-black/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <a href="/" className="text-2xl font-black text-yellow-400">
          Metin2Top
        </a>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-6 text-sm">

          <a href="/" className={linkClass("/")}>
            Home
          </a>

          <a href="/news" className={linkClass("/news")}>
            News
          </a>

          <a href="/submit" className={linkClass("/submit")}>
            Submit
          </a>

          <a href="/admin" className={linkClass("/admin")}>
            Admin
          </a>

          {/* LOGIN BUTTON */}
          <a
            href="/login"
            className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
          >
            Login
          </a>

          {/* DISCORD */}
          <a
            href="https://discord.com"
            target="_blank"
            className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold hover:bg-yellow-400 transition"
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

          <a href="/" className="block hover:text-yellow-400">
            Home
          </a>

          <a href="/news" className="block hover:text-yellow-400">
            News
          </a>

          <a href="/submit" className="block hover:text-yellow-400">
            Submit
          </a>

          <a href="/admin" className="block hover:text-yellow-400">
            Admin
          </a>

          <a
            href="/login"
            className="block bg-zinc-800 px-4 py-2 rounded-xl text-center"
          >
            Login
          </a>

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