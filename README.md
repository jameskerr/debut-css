# Debut CSS

Simple enter and exit animations using CSS transitions.

Define simple transitions in your CSS and trigger them with JavaScript.

```html
<dialog></dialog>
```

```js
import { enter, exit } from "debut-css";

const dialog = document.querySelector("dialog");
await enter(dialog, "fade");
await exit(dialog, "fade");
```

<!-- prettier-ignore -->
```css
.fade { /* */ }

.fade--before-enter { /* */ }
.fade--enter {/* */}
.fade--after-enter {/* */}

.fade--before-exit { /* */ }
.fade--exit {/* */}
.fade--after-exit {/* */}
```

## Usage

There are only two functions exported and they have the same signature.

```ts
function enter(node: HTMLElement, ...effects: string[]): Promise<void>;
function exit(node: HTMLElement, ...effects: string[]): Promise<void>;
```

The node is any HTML element and the reset of the arguments are strings that specify the names of the effects to apply to that node. The effect becomes the prefix for all the css classes that debut will generate and apply at the proper times. For example...

```js
enter(el, "modal");
```

Will apply these CSS classes to 'el'.

```css
.modal--before-enter {
  // Define the starting point here
}
.modal--enter {
  // Define the ending point and transition styles
}
.modal--after-enter {
  // Define any styles that should remain after entering is finished.
}
```

Note: When calling enter or exit on an element with no transition-duration value, the promise reject with an error. It will wait for a 'transitionrun' event to fire before 100ms before throwing the error.
