"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [servers, setServers] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  // AUTH CHECK
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }

      setLoading(false);
    }

    checkUser();
  }, []);

  // LOAD SERVERS
  async function loadServers() {
    const { data } = await supabase.from("servers").select("*");
    setServers(data || []);
  }

  useEffect(() => {
    loadServers();
  }, []);

  // SET TIER (NORMAL / FEATURED / PREMIUM)
  async function setTier(id: string, currentTier: string) {
    const next =
      currentTier === "normal"
        ? "featured"
        : currentTier === "featured"
        ? "premium"
        : "normal";

    await supabase
      .from("servers")
      .update({ tier: next })
      .eq("id", id);

    loadServers();
  }

  // CREATE NEWS
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

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Checking access...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold text-yellow-400 mb-2">
        Admin Dashboard
      </h1>

      <p className="text-zinc-500 mb-10">
        Logged in as: {user?.email}
      </p>

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
                  <h3 className="font-bold">{server.name}</h3>
                  <p className="text-zinc-500 text-sm">
                    Votes: {server.votes || 0}
                  </p>

                  <p className="text-xs text-zinc-400">
                    Tier: {server.tier || "normal"}
                  </p>
                </div>

                <button
                  onClick={() => setTier(server.id, server.tier || "normal")}
                  className={`px-4 py-2 rounded-lg font-bold ${
                    server.tier === "premium"
                      ? "bg-purple-500"
                      : server.tier === "featured"
                      ? "bg-yellow-500 text-black"
                      : "bg-zinc-700"
                  }`}
                >
                  {server.tier === "premium"
                    ? "Premium"
                    : server.tier === "featured"
                    ? "Featured"
                    : "Normal"}
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

          <form onSubmit={createNews} className="space-y-4">

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