"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/auth/AuthProvider";
import { logout } from "../../../lib/auth";
import { calculateLevel } from "../../../engine/storage";
import { useProgress } from "../../../engine/useProgress";

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const progress = useProgress();

  async function handleLogout() {
    await logout();
    router.push("/");
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

      <button onClick={handleLogout} className="btn">Log Out</button>
    </div>
  );
}
