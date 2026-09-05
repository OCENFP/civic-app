import { getEmbedding } from "../../../lib/embeddings";
import { supabase } from "../../../lib/supabase";
import { apiError, withErrorHandling } from "../../../lib/errorHandler";

const MAX_TEXT_LENGTH = 4000;

// POST { text } → { embedding }
// Requires a Supabase access token (Authorization: Bearer <token>) — this
// endpoint spends OpenAI credits, so anonymous callers are rejected.
export const POST = withErrorHandling(async (req) => {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return apiError("Authentication required", 401);

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return apiError("Invalid or expired token", 401);

  const { text } = await req.json();

  if (typeof text !== "string" || !text.trim()) {
    return apiError("text must be a non-empty string", 400);
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return apiError(`text exceeds ${MAX_TEXT_LENGTH} characters`, 400);
  }

  const embedding = await getEmbedding(text);

  return Response.json({ embedding });
});
