import { supabase } from "../../../lib/supabase";
import { handleError } from "../../../lib/errorHandler";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
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
    const { userId, xp, streak } = await req.json();

    // Anonymous local progress is fine — nothing to persist server-side
    if (!userId) {
      return Response.json({ saved: false });
    }

    const { error } = await supabase.from("progress").upsert(
      {
        user_id: userId,
        xp: xp ?? 0,
        streak: streak ?? 0,
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
