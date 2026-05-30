"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UserProfile() {
  const params = useParams();
  const userId = params?.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!userId) return;

      setLoading(true);

      console.log("USER ID:", userId);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      console.log("PROFILE:", profileData);
      console.log("PROFILE ERROR:", profileError);

      setProfile(profileData);

      const { data: serverData, error: serverError } = await supabase
        .from("servers")
        .select("*")
        .eq("user_id", userId)
        .order("votes", { ascending: false });

      console.log("SERVERS:", serverData);
      console.log("SERVER ERROR:", serverError);

      setServers(serverData || []);

      setLoading(false);
    }

    load();
  }, [userId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <p className="text-zinc-400">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">
          {profile?.username || "Unknown User"}
        </h1>

        <p className="text-zinc-400 mt-2">
          {profile?.email || "No email available"}
        </p>

        <p className="text-zinc-600 text-sm mt-1">
          ID: {userId}
        </p>
      </div>

      <h2 className="text-xl font-bold mb-4 text-yellow-400">
        Submitted Servers ({servers.length})
      </h2>

      {servers.length === 0 ? (
        <p className="text-zinc-500">
          No servers submitted yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {servers.map((server) => (
            <div
              key={server.id}
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-yellow-500 transition"
            >
              <h3 className="font-bold text-yellow-400 text-lg">
                {server.name}
              </h3>

              <p className="text-zinc-400 mt-2 line-clamp-2">
                {server.description}
              </p>

              <div className="flex justify-between items-center mt-3 text-sm text-zinc-500">
                <span>⭐ {server.votes || 0}</span>

                <a
                  href={`/servers/${server.id}`}
                  className="text-yellow-400 hover:underline"
                >
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}