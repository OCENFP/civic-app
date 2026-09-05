// Read text aloud with the browser's speech synthesis. No-op where unsupported.
export function speak(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.cancel(); // stop any in-progress speech first
  window.speechSynthesis.speak(utterance);
}
