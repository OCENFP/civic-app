"use client";

import { useState } from "react";
import {
  ask,
  learn,
  bills,
  votes,
  representatives,
  lobbying,
  type Rep,
  type Bill,
  type Vote,
  type Lobby,
  type LearnSection,
} from "../lib/api";

type State<T> = { loading: boolean; error: string; data: T | null };

function useAsync<T>() {
  const [state, setState] = useState<State<T>>({
    loading: false,
    error: "",
    data: null,
  });

  async function run(fn: () => Promise<T>) {
    setState({ loading: true, error: "", data: null });
    try {
      setState({ loading: false, error: "", data: await fn() });
    } catch (e) {
      setState({
        loading: false,
        error: e instanceof Error ? e.message : "Something went wrong.",
        data: null,
      });
    }
  }

  return { ...state, run };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Status({ loading, error }: { loading: boolean; error: string }) {
  if (loading) return <p className="muted">Loading…</p>;
  if (error) return <p className="error">{error}</p>;
  return null;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const askState = useAsync<{ answer: string; source: string }>();

  const [topic, setTopic] = useState("");
  const learnState = useAsync<{ result: LearnSection | null; message?: string }>();

  const [billQuery, setBillQuery] = useState("");
  const billState = useAsync<Bill[]>();

  const [voteQuery, setVoteQuery] = useState("");
  const voteState = useAsync<Vote[]>();

  const [address, setAddress] = useState("");
  const repState = useAsync<Rep[]>();

  const [lobbyName, setLobbyName] = useState("");
  const lobbyState = useAsync<Lobby[]>();

  return (
    <main className="wrap">
      <header>
        <h1>🇺🇸 Civic App</h1>
        <p className="muted">
          Ask about your rights, look up laws, search bills and votes, find your
          representatives, and follow the money.
        </p>
      </header>

      {/* ASK */}
      <Section title="Ask AI">
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            if (question.trim()) askState.run(() => ask(question));
          }}
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Do I have to answer a police officer's questions?"
          />
          <button disabled={askState.loading}>Ask</button>
        </form>
        <Status loading={askState.loading} error={askState.error} />
        {askState.data && (
          <div className="card">
            <p className="pre">{askState.data.answer}</p>
            {askState.data.source && askState.data.source !== "None" && (
              <p className="muted">Source: {askState.data.source}</p>
            )}
          </div>
        )}
      </Section>

      {/* LEARN */}
      <Section title="Learn">
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            if (topic.trim()) learnState.run(() => learn(topic));
          }}
        >
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. free speech, search, remain silent"
          />
          <button disabled={learnState.loading}>Look up</button>
        </form>
        <Status loading={learnState.loading} error={learnState.error} />
        {learnState.data &&
          (learnState.data.result ? (
            <div className="card">
              <h3>{learnState.data.result.title}</h3>
              <p>{learnState.data.result.content}</p>
              <p className="muted">
                {learnState.data.result.keywords?.join(" · ")}
              </p>
            </div>
          ) : (
            <p className="muted">{learnState.data.message || "No match found."}</p>
          ))}
      </Section>

      {/* BILLS */}
      <Section title="Search Bills">
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            billState.run(() => bills(billQuery));
          }}
        >
          <input
            value={billQuery}
            onChange={(e) => setBillQuery(e.target.value)}
            placeholder="e.g. healthcare"
          />
          <button disabled={billState.loading}>Search</button>
        </form>
        <Status loading={billState.loading} error={billState.error} />
        {billState.data &&
          (billState.data.length === 0 ? (
            <p className="muted">No bills found.</p>
          ) : (
            billState.data.map((b, i) => (
              <div className="card" key={i}>
                <h3>{b.title}</h3>
                <p>{b.summary}</p>
                <p className="muted">Status: {b.status}</p>
                <a href={b.link} target="_blank" rel="noreferrer">
                  View on GovTrack →
                </a>
              </div>
            ))
          ))}
      </Section>

      {/* VOTES */}
      <Section title="Search Votes">
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            voteState.run(() => votes(voteQuery));
          }}
        >
          <input
            value={voteQuery}
            onChange={(e) => setVoteQuery(e.target.value)}
            placeholder="e.g. budget"
          />
          <button disabled={voteState.loading}>Search</button>
        </form>
        <Status loading={voteState.loading} error={voteState.error} />
        {voteState.data &&
          (voteState.data.length === 0 ? (
            <p className="muted">No votes found.</p>
          ) : (
            voteState.data.map((v, i) => (
              <div className="card" key={i}>
                <h3>{v.question}</h3>
                <p className="muted">
                  {v.result} · {v.date}
                </p>
                <a href={v.link} target="_blank" rel="noreferrer">
                  View on GovTrack →
                </a>
              </div>
            ))
          ))}
      </Section>

      {/* REPRESENTATIVES */}
      <Section title="Your Representatives">
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            repState.run(() => representatives(address));
          }}
        >
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />
          <button disabled={repState.loading}>Find</button>
        </form>
        <Status loading={repState.loading} error={repState.error} />
        {repState.data &&
          (repState.data.length === 0 ? (
            <p className="muted">
              No representatives found (the backend needs GOOGLE_API_KEY set).
            </p>
          ) : (
            repState.data.map((r, i) => (
              <div className="card" key={i}>
                <h3>{r.name}</h3>
                <p className="muted">
                  {r.role} · {r.party} · {r.state}
                </p>
              </div>
            ))
          ))}
      </Section>

      {/* LOBBYING */}
      <Section title="Follow the Money">
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            lobbyState.run(() => lobbying(lobbyName));
          }}
        >
          <input
            value={lobbyName}
            onChange={(e) => setLobbyName(e.target.value)}
            placeholder="Politician or organization (blank = all)"
          />
          <button disabled={lobbyState.loading}>Search</button>
        </form>
        <Status loading={lobbyState.loading} error={lobbyState.error} />
        {lobbyState.data &&
          (lobbyState.data.length === 0 ? (
            <p className="muted">No lobbying records found.</p>
          ) : (
            lobbyState.data.map((l, i) => (
              <div className="card" key={i}>
                <h3>{l.organization}</h3>
                <p className="muted">
                  {l.amount} to {l.politician} · {l.type}
                </p>
              </div>
            ))
          ))}
      </Section>
    </main>
  );
}
