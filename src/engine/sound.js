// Play a short feedback sound. Assets live in /public/sounds.
export function playSound(type) {
  if (typeof Audio === "undefined") return; // no-op outside the browser

  const file = type === "correct" ? "correct.mp3" : "incorrect.mp3";

  try {
    const audio = new Audio(`/sounds/${file}`);
    // Autoplay can reject before a user gesture; ignore that.
    audio.play().catch(() => {});
  } catch {
    // ignore audio failures — feedback sound is non-essential
  }
}
