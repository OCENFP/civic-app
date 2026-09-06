import OpenAI from "openai";

// Placeholder key keeps the build env-free; API calls fail with a clear
// auth error at runtime until OPENAI_API_KEY is set.
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "placeholder-api-key",
});
