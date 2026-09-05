"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../../components/ui/Card";
import { getUser, logout } from "../../../lib/auth";
import { loadProgress, calculateLevel } from "../../../engine/storage";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({ xp: 0, streak: 0 });

  useEffect(() => {
    getUser().then(setUser);
    Promise.resolve().then(() => setProgress(loadProgress()));
  }, []);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div>
      <h1>Profile</h1>

      <Card>
        <p><strong>Email:</strong> {user?.email || "..."}</p>
        <p><strong>Level:</strong> {calculateLevel(progress.xp)}</p>
        <p><strong>XP:</strong> {progress.xp}</p>
        <p><strong>Streak:</strong> {progress.streak} days</p>
      </Card>

      <button className="btn" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}
