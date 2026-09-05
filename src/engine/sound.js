export function playSound(type) {
  try {
    const audio = new Audio(
      type === "correct" ? "/sounds/correct.mp3" : "/sounds/incorrect.mp3"
    );
    audio.play().catch(() => {});
  } catch {
    // Autoplay blocked or Audio unavailable — sound is best-effort
  }
}
