"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [servers, setServers] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  async function loadServers() {
    const { data } = await supabase
      .from("servers")
      .select("*")
      .order("votes", { ascending: false });

    setServers(data || []);
  }

  useEffect(() => {
    loadServers();
  }, []);

  async function promoteServer(
    id: string,
    promoted: boolean
  ) {
    await supabase
      .from("servers")
      .update({
        promoted: !promoted,
      })
      .eq("id", id);

    loadServers();
  }

  async function createNews(e: any) {
    e.preventDefault();

    await supabase.from("news").insert([
      {
        title,
        content,
        image,
      },
    ]);

    alert("News posted!");

    setTitle("");
    setContent("");
    setImage("");

    loadServers();
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400">
          Admin Dashboard
        </h1>

        <p className="text-zinc-500 mt-3">
          Manage servers, promotions and news
        </p>
      </div>

      <div className="grid xl:grid-cols-2 gap-10">
        {/* SERVERS */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Manage Servers
          </h2>

          <div className="space-y-5">
            {servers.map((server, index) => (
              <div
                key={server.id}
                className={`rounded-2xl overflow-hidden border ${
                  server.promoted
                    ? "border-yellow-400 bg-yellow-500/10"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                {server.banner && (
                  <img
                    src={server.banner}
                    alt={server.name}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        #{index + 1} {server.name}
                      </h3>

                      <p className="text-zinc-500 mt-1">
                        🌍 {server.region}
                      </p>

                      <p className="text-zinc-500">
                        ⭐ Votes: {server.votes || 0}
                      </p>
                    </div>

                    {server.promoted && (
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                        PROMOTED
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        promoteServer(
                          server.id,
                          server.promoted
                        )
                      }
                      className={`px-5 py-3 rounded-xl font-bold transition ${
                        server.promoted
                          ? "bg-red-500 hover:bg-red-400"
                          : "bg-yellow-500 text-black hover:bg-yellow-400"
                      }`}
                    >
                      {server.promoted
                        ? "Remove Promote"
                        : "Promote Server"}
                    </button>

                    <a
                      href={`/servers/${server.id}`}
                      target="_blank"
                      className="bg-zinc-800 px-5 py-3 rounded-xl hover:bg-zinc-700"
                    >
                      View Page
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEWS */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Publish News
          </h2>

          <form
            onSubmit={createNews}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5"
          >
            <input
              type="text"
              placeholder="News Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-black border border-zinc-700"
            />

            <textarea
              placeholder="News Content"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-black border border-zinc-700 h-48"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-black border border-zinc-700"
            />

            <button
              type="submit"
              className="w-full bg-yellow-500 text-black px-6 py-4 rounded-xl font-bold hover:bg-yellow-400 transition"
            >
              Publish News
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}