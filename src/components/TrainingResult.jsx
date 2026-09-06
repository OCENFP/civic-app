"use client";

import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import { coach } from "../engine/ai/coachEngine";
import { shareTrainingResult } from "../engine/growth/ViralEngine";
import { loadProgress, calculateLevel } from "../engine/storage";
import { startListening, isListeningSupported } from "../engine/voice";

// Shown when a training scenario ends: share the result and get AI coaching
// on how the user would phrase their response out loud.
export default function TrainingResult() {
  const [words, setWords] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [canListen, setCanListen] = useState(false);

  useEffect(() => {
    // Defer past the effect tick to avoid a synchronous cascading render.
    Promise.resolve().then(() => setCanListen(isListeningSupported()));
  }, []);

  function share() {
    const p = loadProgress();
    shareTrainingResult({
      xp: p.xp,
      streak: p.streak,
      grade: `Level ${calculateLevel(p.xp)}`,
    });
  }

  function listen() {
    setListening(true);
    startListening(
      (transcript) => {
        setWords((w) => (w ? `${w} ${transcript}` : transcript));
        setListening(false);
      },
      () => setListening(false)
    );
  }

  async function getFeedback() {
    if (!words.trim() || loading) return;
    setLoading(true);
    try {
      setFeedback(await coach(words));
      setOpen(true);
    } catch {
      setFeedback("Could not get feedback right now.");
      setOpen(true);
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h3>Practice what you&apos;d say</h3>
      <p>Type or speak how you would respond out loud, and get AI coaching on it.</p>

      <textarea
        value={words}
        onChange={(e) => setWords(e.target.value)}
        placeholder="Officer, am I being detained?"
        style={{ width: "100%", minHeight: 80, boxSizing: "border-box", padding: 10 }}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
        <button className="btn" onClick={getFeedback} disabled={loading}>
          {loading ? "Coaching..." : "Get AI feedback"}
        </button>
        {canListen && (
          <button className="btn" onClick={listen} disabled={listening}>
            {listening ? "Listening..." : "🎤 Speak"}
          </button>
        )}
        <button className="btn" onClick={share}>
          Share my progress
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3>Coaching</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{feedback}</p>
      </Modal>
    </div>
  );
}
