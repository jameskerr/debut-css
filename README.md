# Debut CSS

Simple entrance and exit animations using CSS transitions.

Define simple transitions in your CSS, compose them in your HTML, and trigger them with JavaScript.

```html
<dialog data-debut="fade">
```

```css
.fade { /* */ }

.fade--before-enter { /* */ }
.fade--enter {/* */}
.fade--after-enter {/* */}

.fade--before-exit { /* */ }
.fade--exit {/* */}
.fade--after-exit {/* */}
```

```js
import {enter, exit} from "debut-css"

const dialog = document.querySelector("dialog")
await enter(dialog)
await exit(dialog)
```

## How It Works

These are the steps.

1. Target the elements you wish to transition.
2. Apply the above classes at the proper times to each element.
3. Resolve the promise when all transitions above have settled.

Caveat: When calling enter or exit on an element with no transition-duration value, the promise will never return. It will wait for the first transition-start event indefinitely. I plan to add a failsafe for that case that throws an error after 1 second if no transition-start event comes around.

### Targeting Elements

As for targeting, there are two ways.

1. Pass in the exact elements you wish to transition.
2. Pass in the name of a "target". A target is set using the data-debut-target attribute. Any elements in the DOM that have that target value will be transitioned.

You can plug-n-play these targeting strategies as arguments to enter and exit.

```js
enter(...targetArguments)
exit(...targetArguuments)
```

For example, here we target a

```html
<body data-debut="fade move" data-debut-target="modal-backdrop"></body>
<dialog> 
    <-- Assume this dialog has the onClick event listener attached to it-->
</dialog>

<script>
function onClick(e) {
    await exit(e.currentTarget, "modal-backdrop")
    e.currentTarget.close()
}
</script>
```

To avoid needing to use the same targeting strageties for both the enter and the exit functions, you can use the `target` method, then call enter and exit on it. The target object will re-query the DOM if it needs to at the start of the enter and exit methods.

```js
const modal = target("modal-foreground", "modal-backdrop")
await modal.enter()
await modal.exit()
```

```js
class MyHandlerClass {
    constructor() {
        this.modal = target("modal-fg", "modal-bg")
    }

    open() {
        this.modal.enter()
    }

    close() {
        this.modal.exit()
    }
} 
```
