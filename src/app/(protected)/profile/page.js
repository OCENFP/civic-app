"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Card from "../../../components/ui/Card";
import { getUser, logout } from "../../../lib/auth";
import { loadProgress, calculateLevel } from "../../../engine/storage";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({ xp: 0, streak: 0 });
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getUser().then(setUser);
    Promise.resolve().then(() => setProgress(loadProgress()));
  }, []);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  async function upgrade() {
    setUpgrading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Could not start checkout.");
    } catch {
      setError("Could not start checkout.");
    }
    setUpgrading(false);
  }

  return (
    <div>
      <Navbar />
      <h1>Profile</h1>

      <Card>
        <p><strong>Email:</strong> {user?.email || "..."}</p>
        <p><strong>Level:</strong> {calculateLevel(progress.xp)}</p>
        <p><strong>XP:</strong> {progress.xp}</p>
        <p><strong>Streak:</strong> {progress.streak} days</p>
      </Card>

      <Card>
        <h2>Pro</h2>
        <p>Unlock everything for $9.99/month.</p>
        <button className="btn" onClick={upgrade} disabled={upgrading}>
          {upgrading ? "Redirecting..." : "Upgrade to Pro"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Card>

      <button className="btn" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}
