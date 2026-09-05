"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("users")
      .select("*")
      .order("xp", { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        // data is null on error — never let it reach .map()
        setUsers(data || []);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Leaderboard</h1>

      {error && <p style={{ color: "red" }}>Could not load leaderboard.</p>}

      {!error && users.length === 0 && <p>No entries yet.</p>}

      {users.map((u, i) => (
        <p key={u.id}>
          {i + 1}. {u.email || "Anonymous"} — {u.xp ?? 0} XP
        </p>
      ))}
    </div>
  );
}
