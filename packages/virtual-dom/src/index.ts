import { Dispatch } from "@futura/core";

import equals from "./equals";
import { VNode, VText, VElement, VThunk } from "./types";

/**
 * VNode types
 * 
 * */
export { VNode, VText, VElement, VThunk };

export type Props = ReadonlyArray<VElement.Attr | VElement.Prop | VElement.EventHandler | undefined | null>;
export type Content = ReadonlyArray<VNode | string | undefined | null> | ReadonlyArray<[any, VNode]>;

export const text = (content: string): VNode =>
  new VText(content);

export const element = (namespace: string | undefined) => (tagName: string, props: Props = [], content: Content = []): VNode =>
  new VElement(namespace, tagName, data(props), children(content));

const data = (props: Props): VElement.Data => {
  const result: Array<VElement.Attr | VElement.Prop | VElement.EventHandler> = [];
  const classes: Array<string> = [];
  for (const prop of props) {
    if (VElement.Data.isAttr(prop) && prop.name === "class" && prop.namespace === undefined) {
      classes.push(prop.value);
    } else if (VElement.Data.isProp(prop) && prop.name === "className") {
      classes.push(prop.value);
    } else if (prop !== null && prop !== undefined) {
      result.push(prop);
    }
  }

  if (classes.length > 0) {
    result.push(new VElement.Attr(undefined, "class", classes.join(" ")));
  }

  return result;
}

const children = (content: Content): VElement.Children => {
  if (content.length === 0 || isKeyedChild(content[0])) {
    return content as VElement.Children;
  } else {
    // FIXME: optimize no-op
    const result: Array<VNode> = [];
    for (const value of content) {
      if (VNode.isVNode(value)) {
        result.push(value);
      } else if (typeof value === "string") {
        result.push(text(value));
      }
    }

    return result;
  }
}

export const attr = (namespace: string | undefined) => (name: string, value: string | undefined) =>
  typeof value !== "undefined"
    ? new VElement.Attr(namespace, name, value)
    : undefined;

export const prop = <K extends string, V>(name: K, value: V | undefined) =>
  typeof value !== "undefined"
    ? new VElement.Prop(name, value)
    : undefined;

export const on = <T extends string, E extends Event, M>(type: T, handler: (event: E) => M, options?: VElement.EventHandler.Options) =>
  new VElement.EventHandler(type, handler, options);

export const lazy = <Args extends any[]>(thunk: (...args: Args) => VNode, ...args: Args): VNode =>
  new VThunk<Args>(thunk, args);


/**
 * Render a VNode into a DOM Node
 * 
 * @param dispatch a Futura dispatcher
 * @param vnode the VNode to render
 * 
 * @returns the DOM node
 */
export function render(dispatch: Dispatch, vnode: VNode): Node {
  if (VNode.isVText(vnode)) {
    return document.createTextNode(vnode.content);
  } else if (VNode.isVElement(vnode)) {
    const node = vnode.namespace
      ? document.createElementNS(vnode.namespace, vnode.tagName)
      : document.createElement(vnode.tagName);

    updateData(dispatch, node, [], vnode.data);
    updateChildren(dispatch, node, [], vnode.children);

    return node;
  } else if (VNode.isVThunk(vnode)) {
    return render(dispatch, vnode.render());
  }

  throw new Error(`@futura/virtual-dom: Unkwnown VNode: ${vnode}`);
}


/**
 * Update or return a new DOM node based on whether an update is feasible or not.
 * 
 * @param dispatch a Futura dispatcher
 * @param node the node that was returned in the previous `render` or `update` call
 * @param current the current VNode matching the given `node`
 * @param next the updated VNode
 * 
 * @returns the same `node` if the update succeeded or a new `node` otherwise.
 */
export function update(dispatch: Dispatch, node: Node, current: VNode, next: VNode): Node {
  if (current === next) {
    return node;
  }

  // VText
  if (node instanceof Text && VNode.isVText(current) && VNode.isVText(next)) {
    if (current.content !== next.content) {
      node.replaceData(0, current.content.length, next.content);
    }
    return node;
  }

  // VElement
  if (node instanceof Element && VNode.isVElement(current) && VNode.isVElement(next)) {
    if (current.namespace === next.namespace && current.tagName === next.tagName) {
      updateData(dispatch, node, current.data, next.data);
      updateChildren(dispatch, node, current.children, next.children);
      return node;
    } else {
      return render(dispatch, next);
    }
  }

  // VThunk
  if (VNode.isVThunk(current) && VNode.isVThunk(next)) {
    if (!equals(current.args, next.args)) {
      return update(dispatch, node, current.render(), next.render());
    } else {
      return node;
    }
  }

  // Replace
  return render(dispatch, next);
}


function updateData(dispatch: Dispatch, node: Element, current: VElement.Data, next: VElement.Data) {
  for (const datum of next) {
    if (VElement.Data.isAttr(datum)) {
      const existing = find(current, matchAttr(datum));
      updateAttr(node, existing, datum);
    } else if (VElement.Data.isEventHandler(datum)) {
      const existing = find(current, matchEventHandler(datum));
      updateEventHandler(dispatch, node, existing, datum);
    } else if (VElement.Data.isProp(datum)) {
      const existing = find(current, matchProp(datum));
      updateProp(node, existing, datum);
    }
  }

  // FIXME: optimize
  for (const datum of current) {
    if (VElement.Data.isAttr(datum) && !find(next, matchAttr(datum))) {
      removeAttr(node, datum);
    } else if (VElement.Data.isEventHandler(datum) && !find(next, matchEventHandler(datum))) {
      removeEventHandler(dispatch, node, datum);
    } else if (VElement.Data.isProp(datum) && !find(next, matchProp(datum))) {
      removeProp(node, datum);
    }
  }
}

// VElement.Attr

const matchAttr = (attr: VElement.Attr) => (other: VElement.Data[0]): other is VElement.Attr =>
  VElement.Data.isAttr(other)
    && other.name === attr.name
    && other.namespace === attr.namespace;

const updateAttr = (element: Element, current: VElement.Attr | undefined, next: VElement.Attr) => {
  if (!current || current.value !== next.value) {
    if (next.namespace) {
      element.setAttributeNS(next.namespace, next.name, next.value);
    } else {
      element.setAttribute(next.name, next.value);
    }
  }
}

const removeAttr = (element: Element, current: VElement.Attr) => {
  if (current.namespace) {
    element.removeAttributeNS(current.namespace, current.name);
  } else {
    element.removeAttribute(current.name);
  }
}

// VElement.EventHandler

const matchEventHandler = (eh: VElement.EventHandler) => (other: VElement.Data[0]): other is VElement.EventHandler =>
  VElement.Data.isEventHandler(other)
    && other.type === eh.type
    && other.handler === eh.handler
    && equals(other.options, eh.options);

const updateEventHandler = (dispatch: Dispatch, element: Element, current: VElement.EventHandler | undefined, next: VElement.EventHandler) => {
  if (!current) {
    element.addEventListener(next.type, next.listener(dispatch), next.options);
  }
}

const removeEventHandler = (dispatch: Dispatch, element: Element, current: VElement.EventHandler) => {
  element.removeEventListener(current.type, current.listener(dispatch), current.options);
}

// VElement.Prop

const matchProp = (attr: VElement.Prop) => (other: VElement.Data[0]): other is VElement.Prop =>
  VElement.Data.isProp(other)
    && other.name === attr.name;

const updateProp = (element: Element, current: VElement.Prop | undefined, next: VElement.Prop) => {
  if (!current || current.value !== next.value) {
    (element as any)[next.name] = next.value;
  }
}

const removeProp = (element: Element, current: VElement.Prop) => {
  delete  (element as any)[current.name];
}


function updateChildren(dispatch: Dispatch, container: Element, current: VElement.Children, next: VElement.Children) {
  let currentEnd = current.length;
  let currentStart = 0;

  let nextEnd = next.length;
  let nextStart = 0;

  // Common Prefix
  while (currentStart < currentEnd && nextStart < nextEnd) {
    const currentChild = current[currentStart];
    const nextChild = next[nextStart];

    if (matchChild(currentChild, nextChild)) {
      updateChild(dispatch, container, container.childNodes[currentStart], currentChild, nextChild);
      currentStart++;
      nextStart++;
    } else {
      break;
    }
  }

  // Common Suffix
  while (currentStart < currentEnd && nextStart < nextEnd) {
    const currentChild = current[currentEnd - 1];
    const nextChild = next[nextEnd - 1];

    if (matchChild(currentChild, nextChild)) {
      updateChild(dispatch, container, container.childNodes[currentEnd - 1], currentChild, nextChild);
      currentEnd--;
      nextEnd--;
    } else {
      break;
    }
  }

  // All nodes matching
  if (currentStart === currentEnd && nextStart === nextEnd) {
    return;
  }

  // Replace all remaining nodes
  // FIXME: optimize
  removeChildren(container, currentStart, currentEnd);
  insertChildren(dispatch, container, next.slice(nextStart, nextEnd), currentStart);
}

function insertChildren(dispatch: Dispatch, container: Node, children: VElement.Children, index: number) {
  const before = container.childNodes[index] || null;

  if (children.length > 1 && container.ownerDocument) {
    const fragment = container.ownerDocument.createDocumentFragment();
    for (const child of children) {
      fragment.appendChild(render(dispatch, unkeyChild(child)));
    }
    container.insertBefore(fragment, before);
  } else if (children.length === 1) {
    container.insertBefore(render(dispatch, unkeyChild(children[0])), before);
  }
}

function removeChildren(container: Node, start: number, end: number) {
  const children = container.childNodes;

  if ((end - start) > 1 && container.ownerDocument) {
    const range = container.ownerDocument.createRange();
    range.setStartBefore(children[start]);
    range.setEndAfter(children[end - 1]);
    range.deleteContents();
  } else if ((end - start) === 1) {
    container.removeChild(children[start]);
  }
}

const matchChild = (current: VElement.Child, next: VElement.Child): boolean => {
  if (current === next) {
    return true;
  } else if (isKeyedChild(current) && isKeyedChild(next)) {
    return equals(current[0], next[0]);
  } else if (VNode.isVText(current) && VNode.isVText(next)) {
    return true;
  } else if (VNode.isVElement(current) && VNode.isVElement(next)) {
    return current.tagName === next.tagName && current.namespace === next.namespace;
  } else if (VNode.isVThunk(current) && VNode.isVThunk(next)) {
    return true;
  }
  return false;
}

const updateChild = (dispatch: Dispatch, target: Node, currentNode: Node, current: VElement.Child, next: VElement.Child) => {
  const updatedNode = update(dispatch, currentNode, unkeyChild(current), unkeyChild(next));
  if (currentNode !== updatedNode) {
    target.replaceChild(updatedNode, currentNode);
  }
};

const isKeyedChild = (child: any): child is [any, VNode] =>
  Array.isArray(child) && child.length === 2 && VNode.isVNode(child[1]);

const unkeyChild = (child: VElement.Child): VNode =>
  isKeyedChild(child) ? child[1] : child;



// Helpers

const find = <T, S extends T>(arr: ReadonlyArray<T>, pred: (value: T) => value is S): S | undefined => {
  for (const e of arr) {
    if (pred(e)) {
      return e;
    }
  }
  return undefined;
}
