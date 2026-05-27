"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUp() {
    setLoading(true);

    if (!email || !password) {
      alert("Email and password required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Account created! You can now login.");
      router.push("/login");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
        
        <h1 className="text-3xl font-bold text-yellow-400">
          Register
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-xl bg-black border border-zinc-700"
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl bg-black border border-zinc-700"
        />

        <button
          onClick={signUp}
          disabled={loading}
          className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold w-full"
        >
          Create Account
        </button>

        <p className="text-sm text-zinc-500 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}