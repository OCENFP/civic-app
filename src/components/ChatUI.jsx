"use client";

import { useState } from "react";
import Loader from "./Loader";
import { authHeaders } from "../lib/auth";
import { speak, startListening, useVoiceSupport } from "../engine/voiceEngine";

export default function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const voiceReady = useVoiceSupport();

  async function send(e) {
    e?.preventDefault();
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

  function listen() {
    if (listening) return;
    setListening(true);
    const rec = startListening((text) => {
      setInput(text);
      setListening(false);
    });
    if (!rec) {
      setListening(false);
      return;
    }
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
  }

  return (
    <div>
      {messages.map((m, i) => (
        <div key={i} className="card">
          <p>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong>
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>{m.text}</p>
          {m.role === "ai" && voiceReady.speak && (
            <button onClick={() => speak(m.text)}>🔊 Listen</button>
          )}
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
        {voiceReady.listen && (
          <button type="button" onClick={listen} disabled={listening}>
            {listening ? "🎙️…" : "🎙️"}
          </button>
        )}
        <button type="submit" className="btn" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
