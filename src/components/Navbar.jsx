"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout } from "../lib/auth";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getUser()
      .then(setUser)
      .finally(() => setReady(true));
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
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

        {ready && user && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Profile</Link>
            <button className="linklike" onClick={handleLogout}>
              Log out
            </button>
          </>
        )}

        {ready && !user && (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
