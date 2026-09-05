export function playSound(type) {
  let audio;

  if (type === "correct") {
    audio = new Audio("/sounds/correct.mp3");
  } else {
    audio = new Audio("/sounds/incorrect.mp3");
  }

  audio.play();
}