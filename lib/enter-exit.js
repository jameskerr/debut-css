import { DebutGroup } from "./group.js";
import { DebutEffect } from "./effect.js";

export function enter(node, ...effects) {
  const items = effects.map((effect) => new DebutEffect(node, effect));
  return new DebutGroup(items).enter();
}

export function exit(node, ...effects) {
  const items = effects.map((effect) => new DebutEffect(node, effect));
  return new DebutGroup(items).exit();
}
