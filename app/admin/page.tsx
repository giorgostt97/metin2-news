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
      .select("*");

    setServers(data || []);
  }

  useEffect(() => {
    loadServers();
  }, []);

  async function promoteServer(id: string, promoted: boolean) {
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
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-yellow-400 mb-10">
        Admin Dashboard
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* SERVERS */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Manage Servers
          </h2>

          <div className="space-y-4">
            {servers.map((server) => (
              <div
                key={server.id}
                className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold">
                    {server.name}
                  </h3>

                  <p className="text-zinc-500 text-sm">
                    Votes: {server.votes || 0}
                  </p>
                </div>

                <button
                  onClick={() =>
                    promoteServer(
                      server.id,
                      server.promoted
                    )
                  }
                  className={`px-4 py-2 rounded-lg font-bold ${
                    server.promoted
                      ? "bg-red-500"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {server.promoted
                    ? "Remove Promote"
                    : "Promote"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* NEWS */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Post News
          </h2>

          <form
            onSubmit={createNews}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="News Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
            />

            <textarea
              placeholder="News Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 h-40"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
            />

            <button
              type="submit"
              className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold"
            >
              Publish News
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}