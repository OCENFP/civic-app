"use client";

import ChoiceButton from "./ChoiceButton";

export default function ScenarioCard({ step, onChoose, disabled }) {
  if (!step) return null;

  return (
    <div className="card">
      <p>{step.question}</p>

      {step.choices?.map((choice, i) => (
        <ChoiceButton
          key={i}
          choice={choice}
          onSelect={onChoose}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
