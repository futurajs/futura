import { VElement, on } from "@futura/virtual-dom";


/** Mouse Events */

export const onClick = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("click", plainEvent, options, message);

export const onDoubleClick = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("dblclick", plainEvent, options, message);

export const onMouseDown = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mousedown", plainEvent, options, message);

export const onMouseUp = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mouseup", plainEvent, options, message);

export const onMouseEnter = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mouseenter", plainEvent, options, message);

export const onMouseLeave = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mouseleave", plainEvent, options, message);

export const onMouseOver = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mouseover", plainEvent, options, message);

export const onMouseOut = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("mouseout", plainEvent, options, message);


/** Form Events */

export const onInput = <M>(message: (content: string) => M, options?: VElement.EventHandler.Options) =>
  on("input", valueEvent, options, message);

export const onChange = <M>(message: (content: string) => M, options?: VElement.EventHandler.Options) =>
  on("change", valueEvent, options, message);

export const onSubmit = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("submit", submitEvent, options, message);


/** Focus Events */

export const onFocus = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("focus", plainEvent, options, message);

export const onBlur = <M>(message: M, options?: VElement.EventHandler.Options) =>
  on("blur", plainEvent, options, message);


/** Custom Events */
export { on };


// Helpers

const plainEvent = <M>(_event: Event, message: M) =>
  message;

const valueEvent = <M>(event: Event, message: (content: string) => M) => {
  event.stopPropagation();
  if (event.target && 'value' in event.target) {
    return message(event.target['value']);
  }
  return undefined;
};

const submitEvent = <M>(event: Event, message: M) => {
  event.preventDefault();
  return message;
}
