export function generateShare(text) {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  return `🚨 Know your rights:\n${text}${origin ? `\n\nTry it: ${origin}` : ""}`;
}
