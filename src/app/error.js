"use client";

export default function Error({ reset }) {
  return (
    <div className="card">
      <h1>Something went wrong</h1>
      <p>An unexpected error occurred. Your progress is saved locally.</p>
      <button className="btn" onClick={() => reset()}>Try Again</button>
    </div>
  );
}
