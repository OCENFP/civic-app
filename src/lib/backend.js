// Base URL of the FastAPI civic-data service (backend/).
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000";

export async function backendGet(path, params = {}) {
  const url = new URL(path, BACKEND_URL);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Backend responded ${res.status}`);
  return res.json();
}
