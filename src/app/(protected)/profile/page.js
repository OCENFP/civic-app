"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/auth/AuthProvider";
import { logout } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";
import { calculateLevel } from "../../../engine/storage";
import { useProgress } from "../../../engine/useProgress";

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const progress = useProgress();
  const [history, setHistory] = useState([]);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("history")
      .select("question, answer, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setHistory(data ?? []));
  }, [user]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  async function goPro() {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert(data.error ?? "Checkout is not available right now.");
    } catch {
      alert("Checkout is not available right now.");
    }
    setUpgrading(false);
  }

  return (
    <div>
      <h1>Profile</h1>

      <div className="card">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Member since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</p>
        <p><strong>XP:</strong> {progress.xp}</p>
        <p><strong>Level:</strong> {calculateLevel(progress.xp)}</p>
        <p><strong>Streak:</strong> {progress.streak}</p>
      </div>

      <div className="card">
        <h2>Pro Access</h2>
        <p>Unlimited AI questions and every training scenario — $9.99/month.</p>
        <button className="btn" onClick={goPro} disabled={upgrading}>
          {upgrading ? "Opening checkout…" : "Go Pro"}
        </button>
      </div>

      {history.length > 0 && (
        <div className="card">
          <h2>Recent Questions</h2>
          {history.map((h, i) => (
            <div key={i}>
              <p><strong>Q:</strong> {h.question}</p>
              <p style={{ fontSize: 13, opacity: 0.8, whiteSpace: "pre-wrap" }}>
                {String(h.answer).slice(0, 200)}
                {String(h.answer).length > 200 ? "…" : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleLogout} className="btn">Log Out</button>
    </div>
  );
}
