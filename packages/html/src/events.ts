import { VElement, on } from "@futura/virtual-dom";


/** Mouse Events */

export const onClick = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("click", plainEvent(message), options);

export const onDoubleClick = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("dblclick", plainEvent(message), options);

export const onMouseDown = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mousedown", plainEvent(message), options);

export const onMouseUp = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mouseup", plainEvent(message), options);

export const onMouseEnter = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mouseenter", plainEvent(message), options);

export const onMouseLeave = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mouseleave", plainEvent(message), options);

export const onMouseOver = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mouseover", plainEvent(message), options);

export const onMouseOut = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mouseout", plainEvent(message), options);


/** Form Events */

export const onInput = <M>(message: (content: string) => M, options?: VElement.EventHandler.Options) =>
  on("input", valueEvent(message), options);

export const onChange = <M>(message: (content: string) => M, options?: VElement.EventHandler.Options) =>
  on("change", valueEvent(message), options);

export const onSubmit = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("submit", (event: Event) => {
    event.preventDefault();
    return message;
  }, options);


/** Focus Events */

export const onFocus = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("focus", plainEvent(message), options);

export const onBlur = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("blur", plainEvent(message), options);


/** Custom Events */
export { on as custom };


// Helpers

const plainEvent = <M>(message: M) => (_event: Event) => {
  return message;
};

const valueEvent = <M>(message: (content: string) => M) => (event: Event) => {
  event.stopPropagation();
  if (event.target && 'value' in event.target) {
    return message(event.target['value']);
  }
  return undefined;
}
