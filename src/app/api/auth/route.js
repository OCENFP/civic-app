import { supabase } from "../../../lib/supabase";
import { apiError, withErrorHandling } from "../../../lib/errorHandler";

// POST { action: "signup" | "login" | "logout", email, password }
export const POST = withErrorHandling(async (req) => {
  const { action, email, password } = await req.json();

  if (action === "signup") {
    if (!email || !password) return apiError("Email and password required", 400);

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return apiError(error.message, 400);

    return Response.json({ user: data.user });
  }

  if (action === "login") {
    if (!email || !password) return apiError("Email and password required", 400);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return apiError(error.message, 401);

    return Response.json({ user: data.user, session: data.session });
  }

  if (action === "logout") {
    const { error } = await supabase.auth.signOut();
    if (error) return apiError(error.message, 400);

    return Response.json({ ok: true });
  }

  return apiError("Unknown action", 400);
});
