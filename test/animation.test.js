import { expect } from "@esm-bundle/chai";
import { enter, exit } from "../index.js";
import { defineEffect, createElement, wait, classes } from "./helpers.js";

describe("enter/exit", () => {
  let cleanupStyles = [];
  let el;

  beforeEach(() => {
    el = createElement();
  });

  afterEach(() => {
    el.remove();
    cleanupStyles.forEach((remove) => remove());
    cleanupStyles = [];
  });

  function effect(name, ms = 40) {
    cleanupStyles.push(defineEffect(name, ms));
    return name;
  }

  it("enters an element through before-enter -> enter -> after-enter", async () => {
    const fx = effect("fade");
    await enter(el, fx);
    expect(classes(el)).to.deep.equal(["fade", "fade--after-enter"]);
  });

  it("exits an element and removes all its classes when settled", async () => {
    const fx = effect("fade");
    await enter(el, fx);
    await exit(el, fx);
    expect(classes(el)).to.deep.equal([]);
  });

  it("is a no-op when entering while already entering", async () => {
    const fx = effect("fade", 80);
    const first = enter(el, fx);
    const second = enter(el, fx); // fired immediately, mid-transition
    await Promise.all([first, second]);
    expect(classes(el)).to.deep.equal(["fade", "fade--after-enter"]);
  });

  it("does not leave stale classes when interrupted by a different effect", async () => {
    // Regression test for the modal panel-forward/panel-back race: rapidly
    // switching to a different effect mid-transition used to leave both
    // effects' classes stacked on the element, and the original effect's
    // delayed cleanup could stomp the interrupting one's final state.
    const forward = effect("panel-forward", 80);
    const back = effect("panel-back", 80);

    enter(el, forward);
    await wait(10); // still mid "panel-forward" enter transition

    const interrupted = exit(el, back);
    await wait(10); // still mid "panel-back" exit transition

    expect(classes(el).some((c) => c.startsWith("panel-forward"))).to.equal(
      false,
      "stale panel-forward classes should be cleared the moment panel-back takes over",
    );

    await interrupted;

    // The interrupting exit should have run to completion and reset
    // cleanly, undisturbed by the original enter's delayed continuation.
    expect(classes(el)).to.deep.equal([]);
  });

  it("reverses smoothly when interrupted by the same effect", async () => {
    const fx = effect("fade", 80);

    exit(el, fx); // starts from a fresh (already-exited-looking) state
    await wait(10);

    await enter(el, fx); // interrupt with the same effect, reversing
    expect(classes(el)).to.deep.equal(["fade", "fade--after-enter"]);
  });

  it("applies multiple effects together and settles both", async () => {
    const a = effect("fade-a");
    const b = effect("fade-b");

    await enter(el, a, b);

    expect(classes(el)).to.deep.equal([
      "fade-a",
      "fade-a--after-enter",
      "fade-b",
      "fade-b--after-enter",
    ]);
  });

  it("does not confuse duplicate effect names with a different effect set", async () => {
    // Regression test for Animation#matches(): comparing effect arrays by
    // "every element of the old set is present somewhere in the new set"
    // (ignoring multiplicity) treated ["dup", "dup"] and ["dup", "other"]
    // as the same running animation, since they're equal length and every
    // element of the first happens to appear in the second. That caused
    // the interrupting call to silently reuse the old, wrong effects
    // instead of running "other" at all.
    const dup = effect("dup", 80);
    const other = effect("other", 80);

    enter(el, dup, dup);
    await wait(10);

    const interrupted = exit(el, dup, other);

    expect(
      el.classList.contains(`${other}--before-exit`) ||
        el.classList.contains(`${other}--exit`),
    ).to.equal(true, "the interrupting exit should apply the 'other' effect");

    await interrupted;
    expect(classes(el)).to.deep.equal([]);
  });
});
