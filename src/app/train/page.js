"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Navbar from "../../components/Navbar";
import ScenarioCard from "../../components/ScenarioCard";
import scenarios from "../../data/scenarios.json";
import { updateProgress } from "../../engine/trainEngine";
import { getUser } from "../../lib/auth";

export default function TrainPage() {
  const scenario = scenarios[0];
  const [stepId, setStepId] = useState("start");
  const [feedback, setFeedback] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const step = scenario.steps[stepId];

  function handleChoice(choice) {
    setFeedback(choice.feedback);
    updateProgress({ correct: choice.correct, user });
    setStepId(choice.next);
  }

  function restart() {
    setStepId("start");
    setFeedback("");
  }

  return (
    <ProtectedRoute>
      <div>
        <Navbar />

        <h1>{scenario.title}</h1>
        <p>{scenario.description}</p>

        <ScenarioCard step={step} feedback={feedback} onChoice={handleChoice} />

        {step?.end && (
          <button className="btn" onClick={restart}>
            Try Again
          </button>
        )}
      </div>
    </ProtectedRoute>
  );
}
