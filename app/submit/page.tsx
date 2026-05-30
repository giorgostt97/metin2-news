"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SubmitPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [region, setRegion] = useState("");
  const [serverType, setServerType] = useState("");
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // ✅ GET USER SAFELY
    const { data, error: userError } = await supabase.auth.getUser();

    const user = data?.user;

    if (userError || !user) {
      alert("You must be logged in to submit a server.");
      setLoading(false);
      return;
    }

    // ✅ INSERT SERVER
    const { error } = await supabase.from("servers").insert([
      {
        name,
        description,
        website,
        region,
        server_type: serverType,
        logo,
        banner,
        votes: 0,
        rating: 5,

        // 👇 IMPORTANT: OWNER SYSTEM
        user_id: user.id,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Server submitted successfully!");

    // RESET FORM
    setName("");
    setDescription("");
    setWebsite("");
    setRegion("");
    setServerType("");
    setLogo("");
    setBanner("");

    // OPTIONAL: redirect to homepage
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">
        Submit Server
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Server Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 h-40"
          required
        />

        <input
          type="text"
          placeholder="Website URL"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
        />

        <input
          type="text"
          placeholder="Region (EU / US)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
        />

        <input
          type="text"
          placeholder="Server Type (PvP / PvM)"
          value={serverType}
          onChange={(e) => setServerType(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
        />

        <input
          type="text"
          placeholder="Logo URL"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
        />

        <input
          type="text"
          placeholder="Banner URL"
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Server"}
        </button>
      </form>
    </main>
  );
}