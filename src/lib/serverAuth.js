import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Fresh, non-persistent client per call: server routes must never store
// auth state on a shared module-scope client (cross-request bleed).
export function createRequestClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Resolve the authenticated user from a request's Bearer token.
// Returns null when unauthenticated — callers decide whether that is fatal.
export async function getUserFromRequest(req) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;

  const { data, error } = await createRequestClient().auth.getUser(token);
  if (error) return null;
  return data?.user ?? null;
}
