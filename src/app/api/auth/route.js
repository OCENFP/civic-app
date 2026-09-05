import { supabase } from "../../../lib/supabase";
import { handleError } from "../../../lib/errorHandler";

export async function POST(req) {
  try {
    const { action, email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 });
    }

    if (action === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return Response.json({ error: error.message }, { status: 400 });
      return Response.json({ user: data.user });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return Response.json({ error: error.message }, { status: 401 });

    return Response.json({ user: data.user, session: data.session });
  } catch (err) {
    return handleError(err);
  }
}
