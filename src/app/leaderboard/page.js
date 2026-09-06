"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("progress")
      .select("user_id, xp, streak")
      .order("xp", { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (error) {
          setError("Leaderboard is unavailable right now.");
        } else {
          setRows(data ?? []);
        }
      });
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>

      {error && <p>{error}</p>}
      {!error && rows.length === 0 && <p>No trainees on the board yet — be the first!</p>}

      {rows.map((r, i) => (
        <p key={r.user_id}>
          {i + 1}. Trainee {String(r.user_id).slice(0, 8)} — {r.xp} XP ({r.streak} 🔥)
        </p>
      ))}
    </div>
  );
}
