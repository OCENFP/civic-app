import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../../../lib/supabase";
import { apiError, withErrorHandling } from "../../../lib/errorHandler";

// Each request gets its own client: signing in on a shared module-level
// client would store that user's session in server memory and leak it
// across requests.
function freshClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// POST { action: "signup" | "login", email, password }
export const POST = withErrorHandling(async (req) => {
  const { action, email, password } = await req.json();

  if (action === "signup") {
    if (!email || !password) return apiError("Email and password required", 400);

    const { data, error } = await freshClient().auth.signUp({ email, password });
    if (error) return apiError(error.message, 400);

    return Response.json({ user: data.user, session: data.session });
  }

  if (action === "login") {
    if (!email || !password) return apiError("Email and password required", 400);

    const { data, error } = await freshClient().auth.signInWithPassword({
      email,
      password,
    });
    if (error) return apiError(error.message, 401);

    return Response.json({ user: data.user, session: data.session });
  }

  if (action === "logout") {
    // A server-side signOut on a shared client would revoke whichever
    // user's session happened to be cached, not the caller's. Log out on
    // the client instead (supabase.auth.signOut()).
    return apiError("Log out client-side via supabase.auth.signOut()", 400);
  }

  return apiError("Unknown action", 400);
});
