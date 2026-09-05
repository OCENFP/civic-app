"use client";

import ChoiceButton from "./ChoiceButton";

export default function ScenarioCard({ step, feedback, onChoice }) {
  if (!step) return null;

  if (step.end) {
    return (
      <div className="card">
        <h2>Scenario Complete</h2>
        {feedback && <p className="label">{feedback}</p>}
        <p>{step.result}</p>
      </div>
    );
  }

  return (
    <div className="card">
      {feedback && <p className="label">Last choice: {feedback}</p>}

      <p>{step.question}</p>

      {step.choices.map((choice, i) => (
        <ChoiceButton key={i} choice={choice} onSelect={onChoice} />
      ))}
    </div>
  );
}
