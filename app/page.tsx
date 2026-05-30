"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [servers, setServers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadServers() {
      const { data } = await supabase.from("servers").select("*");

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
            Find your next adventure and climb the rankings.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="/submit"
              className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400"
            >
              Submit Your Server
            </a>

            <a
              href="/news"
              className="bg-zinc-800 px-6 py-3 rounded-xl font-bold hover:bg-zinc-700"
            >
              Latest News
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

          <a
            href="/news"
            className="bg-zinc-800 px-5 py-3 rounded-xl font-bold hover:bg-zinc-700 text-center"
          >
            News
          </a>

          <a
            href="/submit"
            className="bg-yellow-500 text-black px-5 py-3 rounded-xl font-bold hover:bg-yellow-400 text-center"
          >
            Submit Server
          </a>
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
            {servers.reduce(
              (total, server) => total + (server.votes || 0),
              0
            )}
          </h2>
          <p className="text-zinc-500 mt-2">Total Votes</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <h2 className="text-4xl font-bold text-yellow-400">24/7</h2>
          <p className="text-zinc-500 mt-2">Active Community</p>
        </div>
      </div>

      {/* FEATURED / PREMIUM SERVER */}
      {servers.filter(s => s.tier === "premium" || s.tier === "featured").length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            🔥 Featured Server
          </h2>

          {servers
            .filter(s => s.tier === "premium" || s.tier === "featured")
            .slice(0, 1)
            .map((server) => (
              <div
                key={server.id}
                className="bg-gradient-to-r from-yellow-500/10 to-purple-500/10 border border-yellow-400 rounded-2xl overflow-hidden flex flex-col md:flex-row"
              >
                {server.banner && (
                  <img
                    src={server.banner}
                    alt={server.name}
                    className="w-full md:w-1/3 h-48 object-cover"
                  />
                )}

                <div className="p-6 flex-1">
                  <h2 className="text-3xl font-bold text-yellow-400">
                    {server.name}
                  </h2>

                  <p className="text-zinc-400 mt-2">
                    {server.description}
                  </p>

                  <div className="flex gap-4 mt-4">
                    <a
                      href={`/servers/${server.id}`}
                      className="bg-yellow-500 text-black px-5 py-2 rounded-lg font-bold hover:bg-yellow-400"
                    >
                      View Server
                    </a>

                    <button
                      onClick={() => voteServer(server.id, server.votes || 0)}
                      className="bg-zinc-800 px-5 py-2 rounded-lg hover:bg-zinc-700"
                    >
                      ⭐ {server.votes || 0} votes
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* SERVER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredServers.map((server, index) => (
          <div
            key={server.id}
            className={`rounded-2xl overflow-hidden border transition duration-300 hover:scale-[1.01] ${
              server.tier === "premium"
                ? "bg-purple-500/10 border-purple-500 shadow-lg shadow-purple-500/20"
                : server.tier === "featured"
                ? "bg-yellow-500/10 border-yellow-400 shadow-lg shadow-yellow-500/20"
                : "bg-zinc-900 border-zinc-800 hover:border-yellow-400"
            }`}
          >
            {server.banner && (
              <img
                src={server.banner}
                alt={server.name}
                className="w-full h-40 md:h-48 object-cover"
              />
            )}

            <div className="p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    {index === 0 && "🥇 "}
                    {index === 1 && "🥈 "}
                    {index === 2 && "🥉 "}
                    #{index + 1} {server.name}
                  </h2>

                  <p className="text-zinc-500 text-sm mt-1">
                    Region: {server.region}
                  </p>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  {server.tier === "featured" && (
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-yellow-500/30">
                      ⭐ FEATURED
                    </span>
                  )}

                  {server.tier === "premium" && (
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-purple-500/30">
                      👑 PREMIUM
                    </span>
                  )}
                </div>
              </div>

              <p className="text-zinc-400 mb-6 line-clamp-3">
                {server.description}
              </p>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => voteServer(server.id, server.votes || 0)}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition w-full"
                >
                  Vote ⭐ {server.votes || 0}
                </button>

                <a
                  href={`/servers/${server.id}`}
                  className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition whitespace-nowrap"
                >
                  Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}