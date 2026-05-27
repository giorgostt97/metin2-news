"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function ServerDetailsPage() {
  const params = useParams();

  const [server, setServer] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (!params?.id) return;

    async function loadData() {
      setLoading(true);

      const { data: serverData, error } = await supabase
        .from("servers")
        .select("*")
        .eq("id", params.id)
        .maybeSingle();

      console.log(serverData);
      console.log(error);

      setServer(serverData);

      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*")
        .eq("server_id", params.id)
        .order("created_at", { ascending: false });

      setReviews(reviewData || []);

      setLoading(false);
    }

    loadData();
  }, [params]);

  async function submitReview(e: any) {
    e.preventDefault();

    await supabase.from("reviews").insert([
      {
        server_id: params.id,
        username,
        comment,
        rating,
      },
    ]);

    alert("Review submitted!");

    location.reload();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Loading...
      </main>
    );
  }

  if (!server) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        No server found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {server.banner && (
        <img
          src={server.banner}
          alt={server.name}
          className="w-full h-64 md:h-96 object-cover"
        />
      )}

      <div className="max-w-5xl mx-auto p-4 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-yellow-400">
              {server.name}
            </h1>

            <p className="text-zinc-400 mt-4 text-lg">
              {server.description}
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 min-w-[220px]">
            <p className="mb-2">
              🌍 Region: {server.region}
            </p>

            <p className="mb-2">
              ⭐ Votes: {server.votes || 0}
            </p>

            <a
              href={server.website}
              target="_blank"
              className="inline-block mt-4 bg-yellow-500 text-black px-5 py-3 rounded-xl font-bold hover:bg-yellow-400"
            >
              Visit Website
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Leave Review
            </h2>

            <form
              onSubmit={submitReview}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
              />

              <textarea
                placeholder="Comment"
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 h-40"
              />

              <select
                value={rating}
                onChange={(e) =>
                  setRating(Number(e.target.value))
                }
                className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>

              <button
                type="submit"
                className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400"
              >
                Submit Review
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">
              Reviews
            </h2>

            <div className="space-y-4">
              {reviews.length === 0 && (
                <p className="text-zinc-500">
                  No reviews yet.
                </p>
              )}

              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">
                      {review.username}
                    </h3>

                    <span className="text-yellow-400 font-bold">
                      ⭐ {review.rating}/5
                    </span>
                  </div>

                  <p className="text-zinc-400">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}