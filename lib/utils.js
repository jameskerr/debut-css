export function nextAnimationFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

export function includesWord(string, word) {
  return splitOnSpace(string).includes(word);
}

export function splitOnSpace(string) {
  return string.trim().split(/\s+/);
}
