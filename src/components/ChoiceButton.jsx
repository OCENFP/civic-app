"use client";

export default function ChoiceButton({ choice, onSelect, disabled }) {
  return (
    <button
      className="btn"
      style={{ display: "block", width: "100%", marginBottom: 8 }}
      onClick={() => onSelect(choice)}
      disabled={disabled}
    >
      {choice.text}
    </button>
  );
}
