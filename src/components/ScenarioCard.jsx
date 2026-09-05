"use client";

import ChoiceButton from "./ChoiceButton";

export default function ScenarioCard({ step, feedback, onChoice }) {
  if (!step) return null;

  if (step.end) {
    return (
      <div className="card">
        <h2>Scenario Complete</h2>
        <p>{step.result}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <p>{step.question}</p>

      {step.choices.map((choice, i) => (
        <ChoiceButton key={i} choice={choice} onSelect={onChoice} />
      ))}

      {feedback && <p className="label">{feedback}</p>}
    </div>
  );
}
