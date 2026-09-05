import { openai } from "../../../lib/openai";
import { apiError, withErrorHandling } from "../../../lib/errorHandler";

const MAX_INPUT = 2000;

// POST { input } → { reply }
export const POST = withErrorHandling(async (req) => {
  const { input } = await req.json();

  if (typeof input !== "string" || !input.trim()) {
    return apiError("input must be a non-empty string", 400);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: input.slice(0, MAX_INPUT) }],
  });

  return Response.json({
    reply: response.choices[0].message.content,
  });
});
