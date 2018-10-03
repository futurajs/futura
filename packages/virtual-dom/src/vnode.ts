import { VElement } from "./velement";
import { VText } from "./vtext";


export type VNode
  = VText
  | VElement<Element>;

export namespace VNode {
  export function isVNode(value: any): value is VNode {
    return value instanceof VText || value instanceof VElement;
  }
}
