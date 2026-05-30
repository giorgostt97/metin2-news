"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [servers, setServers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadServers() {
      const { data, error } = await supabase
  .from("servers")
  .select("*");

console.log("SERVERS DATA:", data);
console.log("SERVERS ERROR:", error);

      if (data) {
        const sorted = [...data].sort((a, b) => {
          const getWeight = (tier: string) => {
            if (tier === "premium") return 3;
            if (tier === "featured") return 2;
            return 1;
          };

          const aWeight = getWeight(a.tier || "normal");
          const bWeight = getWeight(b.tier || "normal");

          if (aWeight !== bWeight) return bWeight - aWeight;

          return (b.votes || 0) - (a.votes || 0);
        });

        setServers(sorted);
      }
    }

    loadServers();
  }, []);

  async function voteServer(id: string, votes: number) {
    await supabase
      .from("servers")
      .update({
        votes: (votes || 0) + 1,
      })
      .eq("id", id);

    setServers((current) =>
      current.map((server) =>
        server.id === id
          ? { ...server, votes: (server.votes || 0) + 1 }
          : server
      )
    );
  }

  const filteredServers = servers.filter((server) =>
    server.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400">
            Metin2 Top Servers
          </h1>

          <p className="text-zinc-400 mt-4 max-w-2xl">
            Discover, vote and promote the best Metin2 private servers.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="/submit"
              className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400"
            >
              Submit Server
            </a>

            <a
              href="/news"
              className="bg-zinc-800 px-6 py-3 rounded-xl font-bold hover:bg-zinc-700"
            >
              News
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search server..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white w-full sm:w-64"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <h2 className="text-4xl font-bold text-yellow-400">
            {servers.length}
          </h2>
          <p className="text-zinc-500 mt-2">Listed Servers</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <h2 className="text-4xl font-bold text-yellow-400">
            {servers.reduce((t, s) => t + (s.votes || 0), 0)}
          </h2>
          <p className="text-zinc-500 mt-2">Total Votes</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <h2 className="text-4xl font-bold text-yellow-400">24/7</h2>
          <p className="text-zinc-500 mt-2">Active Community</p>
        </div>
      </div>

      {/* FEATURED */}
      {servers.filter(s => s.tier === "premium" || s.tier === "featured").length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-3">
            🔥 Featured Server
          </h2>

          {servers
            .filter(s => s.tier === "premium" || s.tier === "featured")
            .slice(0, 1)
            .map((server) => (
              <div
                key={server.id}
                className="flex justify-between items-center p-4 rounded-xl border border-yellow-400 bg-yellow-500/10"
              >
                <div>
                  <h2 className="text-xl font-bold text-yellow-400">
                    {server.name}
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    {server.description}
                  </p>
                </div>

                <a
                  href={`/servers/${server.id}`}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold"
                >
                  View
                </a>
              </div>
            ))}
        </div>
      )}

      {/* LIST */}
      <div className="flex flex-col gap-3">

        {filteredServers.map((server, index) => (
          <div
            key={server.id}
            className={`flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border transition hover:border-yellow-400 ${
              server.tier === "premium"
                ? "bg-purple-500/10 border-purple-500"
                : server.tier === "featured"
                ? "bg-yellow-500/10 border-yellow-400"
                : "bg-zinc-900 border-zinc-800"
            }`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-4 w-full md:w-auto">

              <div className="text-2xl font-bold text-yellow-400 w-10 text-center">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index + 1}
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  {server.name}
                </h2>

                <p className="text-zinc-500 text-sm">
                  {server.region} • {server.tier || "normal"}
                </p>

                <p className="text-zinc-400 text-sm line-clamp-1">
                  {server.description}
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="flex gap-6 text-sm text-zinc-400">
              <span>⭐ {server.votes || 0}</span>
              <span>🔥 {server.tier}</span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={() => voteServer(server.id, server.votes || 0)}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400"
              >
                Vote
              </button>

              <a
                href={`/servers/${server.id}`}
                className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700"
              >
                Details
              </a>
            </div>
          </div>
        ))}

      </div>

    </main>
  );
}