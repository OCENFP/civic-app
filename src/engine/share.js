export async function shareResult(text) {
  try {
    if (navigator.share) {
      await navigator.share({
        title: "Know Your Rights AI",
        text,
      });
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } else {
      alert(text);
    }
  } catch {
    // User cancelled the share sheet, or clipboard was blocked — not an error
  }
}
