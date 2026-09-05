// Client for the Python FastAPI backend (backend/main.py).
// Set EXPO_PUBLIC_API_URL in the Expo env; falls back to localhost for dev.
export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:10000";

export interface AskResult {
  answer: string;
  source: string;
}

export interface Rep {
  name: string;
  role: string;
  party: string;
  state: string;
}

export async function ask(question: string): Promise<AskResult> {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export async function representatives(address: string): Promise<Rep[]> {
  const res = await fetch(
    `${API_BASE}/representatives?address=${encodeURIComponent(address)}`
  );
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}
