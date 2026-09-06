"use client";

import Link from "next/link";
import { useAuth } from "./auth/AuthProvider";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav>
      <h1>🇺🇸 Know Your Rights AI</h1>

      <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
        <Link href="/">Ask</Link>
        <Link href="/learn">Learn</Link>
        <Link href="/train">Train</Link>
        <Link href="/civic">Civic Data</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/chat">Chat</Link>
            <Link href="/profile">Profile</Link>
          </>
        ) : (
          <Link href="/login">Log In</Link>
        )}
      </div>
    </nav>
  );
}
