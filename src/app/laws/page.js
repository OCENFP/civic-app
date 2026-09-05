"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Card from "../../components/ui/Card";

function label(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Laws() {
  const [states, setStates] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/laws")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStates(data || {});
      })
      .catch(() => setError("Could not load state laws."))
      .finally(() => setLoading(false));
  }, []);

  const names = Object.keys(states);

  return (
    <div>
      <Navbar />

      <h1>State Laws</h1>
      <p>Quick reference for how rights rules differ by state.</p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && names.length === 0 && <p>No state data available.</p>}

      {names.map((name) => (
        <Card key={name}>
          <h2 style={{ textTransform: "capitalize" }}>{name}</h2>
          {Object.entries(states[name]).map(([k, v]) => (
            <p key={k}>
              <span className="label">{label(k)}:</span>{" "}
              {typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)}
            </p>
          ))}
        </Card>
      ))}
    </div>
  );
}
