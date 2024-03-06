import { transitionsAllSettled } from "https://esm.run/transitions-all-settled";
import {DebutClasses} from "./classes.js"

export class DebutElement {
  constructor(el, effect, group) {
    this.el = el
    this.effect = effect
    this.group = group
    this.classes = new DebutClasses(this.effect)
  }

  set(name) {
    this.className(name)
  }

  reset() {
    this.el.classList.remove(...this.classes.all, this.effect)
  }

  async setOnEnd(name) {
    if (await transitionsAllSettled(this.el)) {
      this.set(name)
    }
  }

  get isEntering() {
    return this.el.classList.contains(this.classes.enter)
  }

  get isExiting() {
    return this.el.classList.contains(this.classes.exit)
  }

  className(name) {
    this.el.classList.remove(...this.classes.all)
    this.el.classList.add(this.classes[name], this.effect)
  }
}
