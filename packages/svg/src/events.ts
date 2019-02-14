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


/** Custom Events */
export { on as custom };


// Helpers

const plainEvent = <M>(message: M) => (_event: Event) => {
  return message;
};
