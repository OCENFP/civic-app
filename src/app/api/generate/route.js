import { askAI } from "../../../lib/openai";
import { supabase } from "../../../lib/supabase";
import { apiError, withErrorHandling } from "../../../lib/errorHandler";

// POST { topic } → { scenario }  (admin scenario generator)
// Spends OpenAI credits, so a valid Supabase access token is required
// (Authorization: Bearer <token>).
export const POST = withErrorHandling(async (req) => {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return apiError("Authentication required", 401);

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return apiError("Invalid or expired token", 401);

  const { topic } = await req.json();

  if (typeof topic !== "string" || !topic.trim()) {
    return apiError("topic must be a non-empty string", 400);
  }

  const prompt = `
Create a branching training scenario about: ${topic}
Include:
- situation
- choices
- correct answers
- consequences
`;

  const scenario = await askAI(prompt);

  return Response.json({ scenario });
});
