# Debut CSS

Simple entrance and exit animations using CSS transitions.

Define simple transitions in your CSS, compose them in your HTML, and trigger them with JavaScript.

```html
<dialog data-debut="modal:fade">
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

await enter("modal")
await exit("modal")
```
