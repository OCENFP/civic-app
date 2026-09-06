import { useSyncExternalStore } from "react";

export function isListeningSupported() {
  return typeof window !== "undefined" && "webkitSpeechRecognition" in window;
}

export function startListening(onResult) {
  if (!isListeningSupported()) return null;

  const recognition = new window.webkitSpeechRecognition();

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    onResult(text);
  };

  recognition.start();
  return recognition;
}

export function isSpeakingSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text) {
  if (!isSpeakingSupported()) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// Browser voice capabilities never change within a page's lifetime, so the
// snapshot is computed once; the server snapshot reports no support, and
// React reconciles after hydration.
const NO_VOICE = { speak: false, listen: false };
let voiceSnapshot = null;

function getVoiceSnapshot() {
  if (voiceSnapshot === null) {
    voiceSnapshot = {
      speak: isSpeakingSupported(),
      listen: isListeningSupported(),
    };
  }
  return voiceSnapshot;
}

export function useVoiceSupport() {
  return useSyncExternalStore(
    () => () => {},
    getVoiceSnapshot,
    () => NO_VOICE
  );
}
