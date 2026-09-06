import { openai } from "../../../lib/openai";
import { handleError } from "../../../lib/errorHandler";
import { rateLimit } from "../../../lib/rateLimit";

export async function POST(req) {
  try {
    const limited = rateLimit(req, { limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const { input } = await req.json();

    if (typeof input !== "string" || !input.trim()) {
      return Response.json({ error: "No input provided" }, { status: 400 });
    }
    if (input.length > 2000) {
      return Response.json({ error: "Input too long (max 2000 chars)" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: input }],
    });

    return Response.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    return handleError(err);
  }
}
