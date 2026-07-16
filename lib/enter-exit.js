import { Animation } from "./animation.js";

export function enter(node, ...effects) {
  return Animation.current(node, effects).enter();
}

export function exit(node, ...effects) {
  return Animation.current(node, effects).exit();
}
