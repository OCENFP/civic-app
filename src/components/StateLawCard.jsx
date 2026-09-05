"use client";

import { useEffect, useState } from "react";

export default function StateLawCard() {
  const [states, setStates] = useState([]);
  const [selected, setSelected] = useState("");
  const [law, setLaw] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/laws")
      .then((r) => r.json())
      .then((d) => setStates(d.states ?? []))
      .catch(() => {});
  }, []);

  async function lookup(state) {
    setSelected(state);
    setLaw(null);
    setError("");
    if (!state) return;

    try {
      const res = await fetch(`/api/laws?state=${encodeURIComponent(state)}`);
      const data = await res.json();
      if (data.law) setLaw(data.law);
      else setError(data.error ?? "No data for that state yet.");
    } catch {
      setError("Could not load state law data.");
    }
  }

  if (states.length === 0) return null;

  return (
    <div className="card">
      <h2>Your State&apos;s Rules</h2>
      <p>Stop-and-identify laws differ by state. Check yours:</p>

      <select value={selected} onChange={(e) => lookup(e.target.value)}>
        <option value="">Select a state…</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      {law && (
        <ul>
          <li>Required to show ID when stopped: {law.id_required ? "Yes" : "No"}</li>
          <li>Stop-and-identify state: {law.stop_and_identify ? "Yes" : "No"}</li>
        </ul>
      )}

      {error && <p>{error}</p>}

      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Educational summary, not legal advice — laws change and details matter.
      </p>
    </div>
  );
}
