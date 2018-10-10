# Futura HTML

HTML Elements for Futura.

## Examples

```typescript
import { button, div } from "@futura/html";
import { class_ } from "@futura/html/attributes";
import { onClick } from "@futura/html/events";

type State = number;

const view = (state: State) =>
  div([class_("counter")], [
    button([ class_("counter-button"), onClick(() => new Decrement()) ], [ "-" ]),
    div([ class_("counter-value") ], [`${state}`]),
    button([ class_("counter-button"), onClick(() => new Increment()) ], [ "+" ]),
  ]);
```

Calling `view(100)` will result in the following virtual DOM node:

```html
<div class="counter">
  <button class="counter-button">-</button>
  <div class="counter-value">100</div>
  <button class="counter-button">+</button>
</div>
```
