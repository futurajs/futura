# Futura HTML

HTML Elements for Futura.

## Examples

```typescript
import { button, div, attributes, events } from "@futura/html";
const { classes } = attributes;
const { onClick } = events;

type State = number;

const view = (state: State) =>
  div([class_("counter")],
    button([ class_("counter-button"), onClick(() => new Decrement()) ], "-"),
    div([ class_("counter-value") ], `${state}`),
    button([ class_("counter-button"), onClick(() => new Increment()) ], "+"),
  );
```

Calling `view(100)` will result in the following virtual DOM node:

```html
<div class="counter">
  <button class="counter-button">-</button>
  <div class="counter-value">100</div>
  <button class="counter-button">+</button>
</div>
```
