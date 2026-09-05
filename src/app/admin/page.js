"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

export default function Admin() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");

    // /api/generate spends OpenAI credits, so it requires a logged-in user.
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      setError("You must be logged in to generate scenarios.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topic }),
      });
      const json = await res.json();
      if (res.ok) setResult(json.scenario);
      else setError(json.error || "Generation failed.");
    } catch {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <h1>Admin Dashboard</h1>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Scenario topic"
      />

      <button className="btn" onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Scenario"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="card">
          <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
        </div>
      )}
    </div>
  );
}
