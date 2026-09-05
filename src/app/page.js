"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  async function askAI(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setAnswer(data.answer || data.error || "No answer.");
    } catch {
      setAnswer("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div>
      <Navbar />

      <h1>Know Your Rights</h1>
      <p>Ask a plain-language question about your rights in a real situation.</p>

      <form onSubmit={askAI} style={{ display: "flex", gap: "10px" }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Do I have to answer a police officer's questions?"
          style={{ flex: 1 }}
        />
        <button className="btn" type="submit" disabled={loading}>
          Ask
        </button>
      </form>

      {loading ? <Loader /> : answer && <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>}

      <p style={{ marginTop: "20px" }}>
        Want to practice under pressure? <Link href="/train">Start training →</Link>
      </p>
    </div>
  );
}
