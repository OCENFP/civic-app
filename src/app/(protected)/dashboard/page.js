"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../components/auth/AuthProvider";
import { calculateLevel } from "../../../engine/storage";
import { useProgress } from "../../../engine/useProgress";

export default function Dashboard() {
  const { user } = useAuth();
  const progress = useProgress();
  const [challenge, setChallenge] = useState("");

  useEffect(() => {
    fetch("/api/daily")
      .then((r) => r.json())
      .then((d) => setChallenge(d.challenge))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back{user?.email ? `, ${user.email}` : ""}.</p>

      <div className="card">
        <h2>Today&apos;s Challenge</h2>
        <p>{challenge || "Loading..."}</p>
        <Link href="/train" className="btn">Start Training</Link>
      </div>

      <div className="card">
        <h2>Your Progress</h2>
        <p>XP: {progress.xp}</p>
        <p>Level: {calculateLevel(progress.xp)}</p>
        <p>Streak: {progress.streak} 🔥</p>
      </div>

      <div className="card">
        <h2>Quick Links</h2>
        <p><Link href="/learn">📚 Learn your rights</Link></p>
        <p><Link href="/chat">💬 Ask the AI</Link></p>
        <p><Link href="/leaderboard">🏆 Leaderboard</Link></p>
      </div>
    </div>
  );
}
