import { supabase } from "../../../lib/supabase";
import { apiError, withErrorHandling } from "../../../lib/errorHandler";

// Progress + analytics sink for the training flow.
// POST { userId, xp, streak } → persist training progress (engine/trainEngine.js)
// POST { name, data }         → acknowledge an analytics event (engine/analytics.js)
export const POST = withErrorHandling(async (req) => {
  const body = await req.json();

  if (typeof body.name === "string") {
    console.log("EVENT:", body.name, body.data ?? {});
    return Response.json({ ok: true });
  }

  const { userId, xp, streak } = body;

  if (typeof xp !== "number" || typeof streak !== "number") {
    return apiError("xp and streak must be numbers", 400);
  }

  if (!userId) {
    // Anonymous training still works locally; nothing to persist server-side.
    return Response.json({ ok: true, persisted: false });
  }

  const { error } = await supabase
    .from("users")
    .upsert({ id: userId, xp, streak }, { onConflict: "id" });

  if (error) return apiError(error.message, 500);

  return Response.json({ ok: true, persisted: true });
});
