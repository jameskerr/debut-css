// Defines real CSS transitions for a debut effect's before-enter/enter and
// before-exit/exit classes, so tests exercise genuine transitionrun/
// transitionend timing rather than a mocked stand-in for it.
export function defineEffect(name, ms = 40) {
  const style = document.createElement("style");
  style.textContent = `
    .${name}--before-enter { opacity: 0; }
    .${name}--enter {
      opacity: 1;
      transition: opacity ${ms}ms linear;
    }
    .${name}--before-exit { opacity: 1; }
    .${name}--exit {
      opacity: 0;
      transition: opacity ${ms}ms linear;
    }
  `;
  document.head.appendChild(style);
  return () => style.remove();
}

export function createElement() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function classes(el) {
  return [...el.classList].sort();
}
