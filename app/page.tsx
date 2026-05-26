"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [servers, setServers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadServers() {
      const { data } = await supabase
        .from("servers")
        .select("*");

      if (data) {
        const sorted = [...data].sort((a, b) => {
          if (a.promoted && !b.promoted) return -1;
          if (!a.promoted && b.promoted) return 1;

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
        votes: votes + 1,
      })
      .eq("id", id);

    location.reload();
  }

  const filteredServers = servers.filter((server) =>
    server.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <h1 className="text-5xl font-bold text-yellow-400">
          Metin2 Top Servers
        </h1>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search server..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white"
          />

          <a
            href="/submit"
            className="bg-yellow-500 text-black px-5 py-3 rounded-xl font-bold"
          >
            Submit Server
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServers.map((server, index) => (
          <div
            key={server.id}
            className={`rounded-2xl overflow-hidden border transition ${
              server.promoted
                ? "bg-yellow-500/10 border-yellow-400"
                : "bg-zinc-900 border-zinc-800 hover:border-yellow-400"
            }`}
          >
            {server.banner && (
              <img
                src={server.banner}
                alt={server.name}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">
                  #{index + 1} {server.name}
                </h2>

                {server.promoted && (
                  <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-bold">
                    PROMOTED
                  </span>
                )}
              </div>

              <p className="text-zinc-400 mb-4">
                {server.description}
              </p>

              <p className="text-zinc-500 mb-4">
                Region: {server.region}
              </p>

              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    voteServer(server.id, server.votes || 0)
                  }
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400"
                >
                  Vote ⭐ {server.votes || 0}
                </button>

                <a
                  href={`/servers/${server.id}`}
                  className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700"
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