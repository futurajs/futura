import { VNode } from "./vnode";

import { VText } from "./vtext";
import { VElement } from "./velement";
import { VAttr, VEvent, VProp } from "./vattribute";

export { VElement, VNode, VText };
export { VAttr, VEvent, VProp };


export function render(vNode: VNode): Node;
export function render(vNode: VNode, oldVNode: VNode, oldNode: Node): Node;
export function render(vNode: VNode, oldVNode?: VNode, oldNode?: Node): Node {
  if (oldVNode && oldNode) {
    if (vNode.update(oldNode, oldVNode)) {
      return oldNode;
    } else {
      return vNode.render();
    }
  } else {
    return vNode.render();
  }
}
