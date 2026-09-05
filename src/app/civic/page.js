"use client";

import { useState } from "react";
import Loader from "../../components/Loader";
import { backendGet } from "../../lib/backend";

const UNAVAILABLE =
  "The civic data service is unreachable right now. Try again later.";

function RepresentativesSection() {
  const [address, setAddress] = useState("");
  const [reps, setReps] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setReps(null);
    try {
      const data = await backendGet("/representatives", { address });
      setReps(Array.isArray(data) ? data : []);
    } catch {
      setError(UNAVAILABLE);
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Your Representatives</h2>
      <form onSubmit={lookup}>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="State or address (optional)"
        />
        <button type="submit" disabled={loading}>Find Representatives</button>
      </form>

      {loading && <Loader />}
      {error && <p>{error}</p>}
      {reps?.length === 0 && <p>No representatives found.</p>}
      {reps?.slice(0, 15).map((r, i) => (
        <p key={i}>
          <strong>{r.name}</strong> — {r.role} ({r.party})
        </p>
      ))}
    </div>
  );
}

function BillsSection() {
  const [query, setQuery] = useState("");
  const [bills, setBills] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBills(null);
    try {
      const data = await backendGet("/bills", { query });
      setBills(Array.isArray(data) ? data : []);
    } catch {
      setError(UNAVAILABLE);
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Search Bills</h2>
      <form onSubmit={search}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. privacy, voting, healthcare"
        />
        <button type="submit" disabled={loading}>Search</button>
      </form>

      {loading && <Loader />}
      {error && <p>{error}</p>}
      {bills?.length === 0 && <p>No bills matched.</p>}
      {bills?.map((b, i) => (
        <div key={i}>
          <p>
            <a href={b.link} target="_blank" rel="noreferrer">
              <strong>{b.title}</strong>
            </a>
          </p>
          <p style={{ fontSize: 13, opacity: 0.75 }}>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}

function VotesSection() {
  const [votes, setVotes] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    setVotes(null);
    try {
      const data = await backendGet("/votes");
      setVotes(Array.isArray(data) ? data : []);
    } catch {
      setError(UNAVAILABLE);
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Recent Congressional Votes</h2>
      <button onClick={load} disabled={loading}>Load Recent Votes</button>

      {loading && <Loader />}
      {error && <p>{error}</p>}
      {votes?.length === 0 && <p>No votes available.</p>}
      {votes?.map((v, i) => (
        <p key={i}>
          <a href={v.link} target="_blank" rel="noreferrer">{v.question}</a>{" "}
          — <em>{v.result}</em>
        </p>
      ))}
    </div>
  );
}

export default function CivicPage() {
  return (
    <div>
      <h1>Civic Data</h1>
      <p>
        Who represents you, what Congress is voting on, and the bills that
        affect your rights — straight from public sources.
      </p>

      <RepresentativesSection />
      <BillsSection />
      <VotesSection />
    </div>
  );
}
