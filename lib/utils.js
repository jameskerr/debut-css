export function nextAnimationFrame() {
  // A single rAF is not reliably enough for the browser to have painted
  // the "before" class before the target class is applied, which can
  // silently skip the transition entirely. Two rAFs guarantee a paint
  // happens in between.
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve)),
  );
}

export function includesWord(string, word) {
  return splitOnSpace(string).includes(word);
}

export function splitOnSpace(string) {
  return string.trim().split(/\s+/);
}
