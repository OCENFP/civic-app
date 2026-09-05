import { getEmbedding } from "../../../lib/embeddings";
import { apiError, withErrorHandling } from "../../../lib/errorHandler";

// POST { text } → { embedding }
export const POST = withErrorHandling(async (req) => {
  const { text } = await req.json();

  if (!text) return apiError("No text provided", 400);

  const embedding = await getEmbedding(text);

  return Response.json({ embedding });
});
