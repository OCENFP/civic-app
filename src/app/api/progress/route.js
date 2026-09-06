import { supabase } from "../../../lib/supabase";
import { getUserFromRequest } from "../../../lib/serverAuth";
import { handleError } from "../../../lib/errorHandler";

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ progress: data || { xp: 0, streak: 0 } });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req) {
  try {
    const { xp, streak } = await req.json();

    // Identity comes from the verified token, never from the request body.
    const user = await getUserFromRequest(req);

    // Anonymous local progress is fine — nothing to persist server-side
    if (!user) {
      return Response.json({ saved: false });
    }

    const { error } = await supabase.from("progress").upsert(
      {
        user_id: user.id,
        xp: Number.isFinite(xp) ? xp : 0,
        streak: Number.isFinite(streak) ? streak : 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ saved: true });
  } catch (err) {
    return handleError(err);
  }
}
