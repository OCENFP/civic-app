import { openai } from "../../../lib/openai";
import { handleError } from "../../../lib/errorHandler";

export async function POST(req) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return Response.json({ error: "No topic provided" }, { status: 400 });
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
