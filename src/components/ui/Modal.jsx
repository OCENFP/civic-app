"use client";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "10px",
          maxWidth: "480px",
          width: "90%",
        }}
      >
        {children}
        <button className="btn" onClick={onClose} style={{ marginTop: "12px" }}>
          Close
        </button>
      </div>
    </div>
  );
}
