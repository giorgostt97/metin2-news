"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SubmitPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [region, setRegion] = useState("");
  const [serverType, setServerType] = useState("");
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    const { error } = await supabase.from("servers").insert([
      {
        name,
        description,
        website,
        region,
        Server_type: serverType,
        logo,
        banner,
        rating: 5,
        votes: 0,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Server submitted!");

      setName("");
      setDescription("");
      setWebsite("");
      setRegion("");
      setServerType("");
      setLogo("");
      setBanner("");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-10">
        Submit Server
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4"
      >
        <input
          type="text"
          placeholder="Server Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 h-40"
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
          placeholder="Region (EU/US)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
        />

        <input
          type="text"
          placeholder="Server Type (PvP/PvM)"
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
          className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400"
        >
          Submit Server
        </button>
      </form>
    </main>
  );
}