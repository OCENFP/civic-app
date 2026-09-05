"use client";

import { useState } from "react";
import scenarios from "../../data/scenarios.json";
import ScenarioCard from "../../components/ScenarioCard";
import { updateProgress } from "../../engine/trainEngine";
import { playSound } from "../../engine/sound";
import { shareResult } from "../../engine/share";
import { useAuth } from "../../components/auth/AuthProvider";

export default function TrainPage() {
  const { user } = useAuth();
  const [scenario, setScenario] = useState(null);
  const [stepId, setStepId] = useState("start");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  function startScenario(s) {
    setScenario(s);
    setStepId("start");
    setFeedback("");
    setScore(0);
  }

  if (!scenario) {
    return (
      <div>
        <h1>Training</h1>
        <p>Pick a scenario and practice protecting your rights under pressure.</p>

        {scenarios.map((s) => (
          <div key={s.id} className="card">
            <h2>{s.title}</h2>
            <p>{s.description}</p>
            <button className="btn" onClick={() => startScenario(s)}>
              Start
            </button>
          </div>
        ))}
      </div>
    );
  }

  const step = scenario.steps[stepId];

  function choose(choice) {
    setFeedback(choice.feedback);

    if (choice.correct) {
      setScore((s) => s + 1);
      playSound("correct");
    } else {
      playSound("incorrect");
    }

    updateProgress({ correct: choice.correct, user });
    setStepId(choice.next);
  }

  if (step?.end) {
    return (
      <div>
        <h1>{scenario.title}</h1>
        <div className="card">
          <h2>{step.result}</h2>
          <p>Correct choices: {score}</p>
          <button
            className="btn"
            onClick={() =>
              shareResult(`I scored ${score} on "${scenario.title}" — ${step.result}`)
            }
          >
            Share Result
          </button>
          <button
            className="btn"
            style={{ marginLeft: 8 }}
            onClick={() => startScenario(scenario)}
          >
            Try Again
          </button>
          <button
            className="btn"
            style={{ marginLeft: 8 }}
            onClick={() => setScenario(null)}
          >
            All Scenarios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>{scenario.title}</h1>
      <p>{scenario.description}</p>

      <ScenarioCard step={step} onChoose={choose} />

      {feedback && <p><em>{feedback}</em></p>}
    </div>
  );
}
