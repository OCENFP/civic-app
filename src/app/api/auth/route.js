import { createRequestClient } from "../../../lib/serverAuth";
import { handleError } from "../../../lib/errorHandler";
import { rateLimit } from "../../../lib/rateLimit";

export async function POST(req) {
  try {
    const limited = rateLimit(req, { limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const { action, email, password } = await req.json();

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 });
    }

    // Per-request client: never authenticate on a shared module-scope
    // client, or one user's session bleeds into other requests.
    const supabase = createRequestClient();

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
