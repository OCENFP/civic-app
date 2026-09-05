// Typed client for the Python FastAPI backend (see backend/main.py).
// Configure NEXT_PUBLIC_API_URL in .env.local; falls back to localhost for dev.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

export interface Rep {
  name: string;
  role: string;
  party: string;
  state: string;
}
export interface Bill {
  title: string;
  summary: string;
  status: string;
  link: string;
}
export interface Vote {
  question: string;
  result: string;
  date: string;
  link: string;
}
export interface Lobby {
  politician: string;
  organization: string;
  amount: string;
  type: string;
}
export interface LearnSection {
  title: string;
  keywords: string[];
  content: string;
}
export interface AskResult {
  answer: string;
  source: string;
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export function ask(question: string): Promise<AskResult> {
  return fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  }).then((r) => {
    if (!r.ok) throw new Error(`Request failed (${r.status})`);
    return r.json();
  });
}

export const learn = (topic: string) =>
  getJSON<{ topic: string; result: LearnSection | null; message?: string }>(
    `/learn?topic=${encodeURIComponent(topic)}`
  );

export const bills = (query: string) =>
  getJSON<Bill[]>(`/bills?query=${encodeURIComponent(query)}`);

export const votes = (query: string) =>
  getJSON<Vote[]>(`/votes?query=${encodeURIComponent(query)}`);

export const representatives = (address: string) =>
  getJSON<Rep[]>(`/representatives?address=${encodeURIComponent(address)}`);

export const lobbying = (name: string) =>
  getJSON<Lobby[]>(`/lobbying?name=${encodeURIComponent(name)}`);
