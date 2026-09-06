"use client";

import Link from "next/link";
import ChatUI from "../components/ChatUI";

export default function Home() {
  return (
    <div>
      <h1>Know your rights. Keep them.</h1>
      <p>
        Ask questions grounded in constitutional source material, learn what
        applies to you, and train on real-world scenarios until asserting your
        rights is second nature.
      </p>

      <div style={{ display: "flex", gap: 8, margin: "14px 0" }}>
        <Link href="/learn" className="btn">📚 Learn</Link>
        <Link href="/train" className="btn">🎯 Train</Link>
      </div>

      <div className="card">
        <h2>Ask a question</h2>
        <ChatUI />
      </div>
    </div>
  );
}
