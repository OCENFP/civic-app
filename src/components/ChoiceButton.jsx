"use client";

export default function ChoiceButton({ choice, onSelect, disabled }) {
  return (
    <button
      className="btn"
      onClick={() => onSelect(choice)}
      disabled={disabled}
      style={{ display: "block", marginBottom: "10px", width: "100%" }}
    >
      {choice.text}
    </button>
  );
}
