"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import ProgressBar from "../../../components/ProgressBar";
import Card from "../../../components/ui/Card";
import { loadProgress, calculateLevel } from "../../../engine/storage";

export default function Dashboard() {
  const [progress, setProgress] = useState({ xp: 0, level: 1, streak: 0 });
  const [challenge, setChallenge] = useState("");

  useEffect(() => {
    Promise.resolve().then(() => {
      const p = loadProgress();
      setProgress({ ...p, level: calculateLevel(p.xp) });
    });

    fetch("/api/daily")
      .then((res) => res.json())
      .then((data) => setChallenge(data.challenge))
      .catch(() => setChallenge(""));
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Dashboard</h1>

      <Card>
        <h2>Level {progress.level}</h2>
        <p>{progress.xp} XP — {progress.streak} day streak</p>
        <ProgressBar xp={progress.xp} />
      </Card>

      {challenge && (
        <Card>
          <h2>Daily Challenge</h2>
          <p>{challenge}</p>
          <Link href="/train">Start Training →</Link>
        </Card>
      )}

      <Card>
        <h2>Quick Links</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/learn">Learn</Link>
          <Link href="/train">Train</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/profile">Profile</Link>
        </div>
      </Card>
    </div>
  );
}
