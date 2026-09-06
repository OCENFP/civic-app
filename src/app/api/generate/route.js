import { openai } from "../../../lib/openai";
import { handleError } from "../../../lib/errorHandler";
import { rateLimit } from "../../../lib/rateLimit";

export async function POST(req) {
  try {
    const limited = rateLimit(req, { limit: 5, windowMs: 60_000 });
    if (limited) return limited;

    const { topic } = await req.json();

    if (typeof topic !== "string" || !topic.trim()) {
      return Response.json({ error: "No topic provided" }, { status: 400 });
    }
    if (topic.length > 500) {
      return Response.json({ error: "Topic too long (max 500 chars)" }, { status: 400 });
    }

    const prompt = `
Create a branching training scenario about: ${topic}
Include:
- situation
- choices
- correct answers
- consequences
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return Response.json({ scenario: completion.choices[0].message.content });
  } catch (err) {
    return handleError(err);
  }
}
