"use client";

import { useState } from "react";

export default function Admin() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");

  const generate = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setResult(data.scenario);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Scenario topic"
      />

      <button onClick={generate}>Generate Scenario</button>

      {result && (
        <div className="card">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}