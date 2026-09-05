"use client";

import { useState } from "react";
import Loader from "./Loader";
import { authHeaders } from "../lib/auth";

export default function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: data.answer || data.error || "Something went wrong.",
          sources: data.sources,
        },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Network error. Try again." }]);
    }

    setLoading(false);
  }

  return (
    <div>
      {messages.map((m, i) => (
        <div key={i} className="card">
          <p>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong>
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>{m.text}</p>
          {m.sources?.length > 0 && (
            <p style={{ fontSize: 12, color: "#666" }}>
              Sources: {m.sources.join(", ")}
            </p>
          )}
        </div>
      ))}

      {loading && <Loader />}

      <form onSubmit={send} style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Can police search my car?"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
