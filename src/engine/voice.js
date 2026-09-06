// Browser voice helpers. All guarded so they no-op where unsupported / on SSR.

function recognizer() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function isListeningSupported() {
  return recognizer() !== null;
}

// Read text aloud with speech synthesis.
export function speak(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.cancel(); // stop any in-progress speech first
  window.speechSynthesis.speak(utterance);
}

// Capture one spoken phrase; calls onResult(transcript) or onError(message).
export function startListening(onResult, onError) {
  const Rec = recognizer();
  if (!Rec) {
    onError?.("Voice input isn't supported in this browser.");
    return null;
  }

  const recognition = new Rec();
  recognition.onresult = (event) => onResult(event.results[0][0].transcript);
  recognition.onerror = (event) => onError?.(event.error || "Voice input failed.");
  recognition.start();
  return recognition;
}
