import { DebutEffect } from "./effect.js";
import { nextAnimationFrame } from "./utils.js";

const animations = new WeakMap(); // el -> Animation

export class Animation {
  // Returns the animation currently running on `el`. If `effects` matches
  // what's already running, that same animation is returned (continuing
  // it). Otherwise the previous animation's classes are cleared and a new
  // one takes its place, so any of its still-pending async work (a
  // delayed setOnEnd) becomes a no-op instead of stomping on the new one.
  static current(el, effects) {
    const running = animations.get(el);
    if (running?.matches(effects)) return running;

    running?.clear();

    const animation = new Animation(el, effects);
    animations.set(el, animation);
    return animation;
  }

  constructor(el, effects) {
    this.el = el;
    this.effects = effects;
    this.items = effects.map((effect) => new DebutEffect(this, effect));
  }

  matches(effects) {
    return (
      this.effects.length === effects.length &&
      this.effects.every((effect) => effects.includes(effect))
    );
  }

  clear() {
    this.items.forEach((item) => item.reset());
  }

  get isCurrent() {
    return animations.get(this.el) === this;
  }

  get isEntering() {
    return this.items.some((item) => item.isEntering);
  }

  get isExiting() {
    return this.items.some((item) => item.isExiting);
  }

  async enter() {
    if (this.isEntering) return;
    if (!this.isExiting) this.#set("beforeEnter");
    await nextAnimationFrame();
    this.#set("enter");
    return this.#setOnEnd("afterEnter");
  }

  async exit() {
    if (this.isExiting) return;
    if (!this.isEntering) this.#set("beforeExit");
    await nextAnimationFrame();
    this.#set("exit");
    await this.#setOnEnd("afterExit");
    if (this.isCurrent) this.clear();
  }

  #set(state) {
    this.items.forEach((item) => item.set(state));
  }

  #setOnEnd(state) {
    return Promise.allSettled(this.items.map((item) => item.setOnEnd(state)));
  }
}
