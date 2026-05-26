"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [servers, setServers] = useState<any[]>([]);

  async function loadServers() {
    const { data, error } = await supabase
      .from("servers")
      .select("*")
      .order("votes", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setServers(data || []);
    }
  }

  async function voteServer(id: string, currentVotes: number) {
    const { error } = await supabase
      .from("servers")
      .update({
        votes: currentVotes + 1,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
    }

    loadServers();
  }

  useEffect(() => {
    loadServers();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-bold text-yellow-400">
          Metin2 Top Servers
        </h1>

        <a
          href="/submit"
          className="bg-yellow-500 text-black px-5 py-3 rounded-xl font-bold hover:bg-yellow-400"
        >
          Submit Server
        </a>
      </div>

      {servers.length === 0 ? (
        <p className="text-zinc-400">No servers found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server, index) => (
            <div
              key={server.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400 transition"
            >
              {server.banner && (
                <img
                  src={server.banner}
                  alt={server.name}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">
                    #{index + 1} {server.name}
                  </h2>

                  <div className="text-yellow-400 font-bold">
                    ⭐ {server.votes ?? 0}
                  </div>
                </div>

                <p className="text-zinc-400 mb-4">
                  {server.description}
                </p>

                <div className="text-sm text-zinc-500 mb-4">
                  Region: {server.region} | Type: {server.Server_type}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      voteServer(server.id, server.votes ?? 0)
                    }
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}