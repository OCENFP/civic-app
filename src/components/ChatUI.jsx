"use client";

import { useState } from "react";
import Loader from "./Loader";
import { getUser } from "../lib/auth";

export default function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setLoading(true);

    try {
      const user = await getUser();

      const res = await fetch("/api/ask", {
        method: "POST",
        body: JSON.stringify({ question, userId: user?.id }),
      });

      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: data.answer || data.error || "No answer.",
          sources: data.sources,
        },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Something went wrong." }]);
    }

    setLoading(false);
  }

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <div key={i} className="card">
            <p>
              <strong>{m.role === "user" ? "You" : "AI"}:</strong>
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{m.text}</p>
            {m.sources?.length > 0 && (
              <p className="label">Sources: {m.sources.join(", ")}</p>
            )}
          </div>
        ))}

        {loading && <Loader />}
      </div>

      <form onSubmit={send} style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Do I have to answer police questions?"
          style={{ flex: 1 }}
        />
        <button className="btn" type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
