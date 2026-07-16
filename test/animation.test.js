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
});
