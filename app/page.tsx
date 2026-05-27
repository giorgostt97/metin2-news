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
    server.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-yellow-400">
            Metin2 Top Servers
          </h1>

          <p className="text-zinc-500 mt-2">
            Discover the best Metin2 private servers
          </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServers.map((server, index) => (
          <div
            key={server.id}
            className={`rounded-2xl overflow-hidden border transition duration-300 hover:scale-[1.01] ${
              server.promoted
                ? "bg-yellow-500/10 border-yellow-400"
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
                    #{index + 1} {server.name}
                  </h2>

                  <p className="text-zinc-500 text-sm mt-1">
                    Region: {server.region}
                  </p>
                </div>

                {server.promoted && (
                  <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap">
                    PROMOTED
                  </span>
                )}
              </div>

              <p className="text-zinc-400 mb-6 line-clamp-3">
                {server.description}
              </p>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() =>
                    voteServer(server.id, server.votes || 0)
                  }
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