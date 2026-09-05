import OpenAI from "openai";

let client;

// Lazy init so builds and pages that never call OpenAI don't require the key
export function getOpenAI() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return client;
}

export const openai = new Proxy(
  {},
  {
    get(_target, prop) {
      const value = getOpenAI()[prop];
      return typeof value === "function" ? value.bind(getOpenAI()) : value;
    },
  }
);

export async function askAI(prompt) {
  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}
