"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    async function loadNews() {
      const { data } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      setArticles(data || []);
    }

    loadNews();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-yellow-400 mb-10">
        Metin2 News
      </h1>

      <div className="space-y-8">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800"
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 object-cover"
              />
            )}

            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4">
                {article.title}
              </h2>

              <p className="text-zinc-400 leading-7">
                {article.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}