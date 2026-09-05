import { getEmbedding } from "../../../lib/embeddings";
import { handleError } from "../../../lib/errorHandler";
import { rateLimit } from "../../../lib/rateLimit";

export async function POST(req) {
  try {
    const limited = rateLimit(req, { limit: 20, windowMs: 60_000 });
    if (limited) return limited;

    const { text } = await req.json();

    if (typeof text !== "string" || !text.trim()) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }
    if (text.length > 8000) {
      return Response.json({ error: "Text too long (max 8000 chars)" }, { status: 400 });
    }

    const embedding = await getEmbedding(text);

    return Response.json({ embedding });
  } catch (err) {
    return handleError(err);
  }
}
