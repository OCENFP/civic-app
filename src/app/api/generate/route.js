import { askAI } from "../../../lib/openai";
import { apiError, withErrorHandling } from "../../../lib/errorHandler";

// POST { topic } → { scenario }  (admin scenario generator)
export const POST = withErrorHandling(async (req) => {
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
