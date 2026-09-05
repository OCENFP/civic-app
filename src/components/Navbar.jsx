"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth/AuthProvider";
import { logout } from "../lib/auth";

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <nav>
      <h1>🇺🇸 Know Your Rights AI</h1>

      <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
        <Link href="/">Ask</Link>
        <Link href="/learn">Learn</Link>
        <Link href="/train">Train</Link>
        <Link href="/chat">Chat</Link>
        <Link href="/leaderboard">Leaderboard</Link>

        {!loading && user && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Profile</Link>
            <button className="linklike" onClick={handleLogout}>
              Log out
            </button>
          </>
        )}

        {!loading && !user && (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
