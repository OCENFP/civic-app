import { supabase } from "../../../lib/supabase";
import { openai } from "../../../lib/openai";
import { getEmbedding, cosineSimilarity } from "../../../lib/embeddings";
import { getUserFromRequest } from "../../../lib/serverAuth";
import { handleError } from "../../../lib/errorHandler";
import { rateLimit } from "../../../lib/rateLimit";
import data from "../../../data/constitution.json";

// The corpus is static, so embed each document at most once per server
// lifetime instead of re-embedding all ~15 documents on every request.
const embeddingCache = new Map();

async function getDocEmbedding(item) {
  if (item.embedding && item.embedding.length > 0) return item.embedding;

  const cached = embeddingCache.get(item.title);
  if (cached) return cached;

  const embedding = await getEmbedding(item.text);
  embeddingCache.set(item.title, embedding);
  return embedding;
}

export async function POST(req) {
  try {
    const limited = rateLimit(req, { limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const { question } = await req.json();

    if (typeof question !== "string" || !question.trim()) {
      return Response.json({ error: "No question provided" }, { status: 400 });
    }
    if (question.length > 2000) {
      return Response.json({ error: "Question too long (max 2000 chars)" }, { status: 400 });
    }

    // STEP 1: Embed user query
    const queryEmbedding = await getEmbedding(question);

    // STEP 2: Compare with all documents
    const scored = await Promise.all(
      data.map(async (item) => {
        const embedding = await getDocEmbedding(item);
        const score = cosineSimilarity(queryEmbedding, embedding);
        return { ...item, score };
      })
    );

    // STEP 3: Sort by relevance
    const topMatches = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const context = topMatches
      .map((m) => `${m.title}: ${m.text}`)
      .join("\n\n");

    // STEP 4: AI Response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a civic legal assistant.

Use the legal context below:

${context}

Respond in:

1. Simple Explanation
2. Real-Life Example
3. What You Should Do
4. What You Can Say (short phrase)

If unsure, say "I don't know".
          `,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    // STEP 5: Save history for the verified user only — identity comes
    // from the token, never from a client-supplied field.
    const user = await getUserFromRequest(req);
    if (user) {
      await supabase.from("history").insert({
        user_id: user.id,
        question,
        answer,
      });
    }

    return Response.json({
      answer,
      sources: topMatches.map((m) => m.title),
    });
  } catch (err) {
    return handleError(err);
  }
}
