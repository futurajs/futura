import "core-js/features/array/find-index";
import { Dispatch, util } from "@futura/core";

import { VNode, VElement } from "./types";

const equals = util.equals;


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

    updateElementAttrs(node, [], vnode.attrs);
    updateElementEventHandlers(dispatch, node, [], vnode.eventHandlers);
    updateElementProps(node, [], vnode.props);
    updateElementChildren(dispatch, node, [], vnode.children);

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
      updateElementAttrs(node, current.attrs, next.attrs);
      updateElementEventHandlers(dispatch, node, current.eventHandlers, next.eventHandlers);
      updateElementProps(node, current.props, next.props);
      updateElementChildren(dispatch, node, current.children, next.children);
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


//
// Element: Attributes
//

function updateElementAttrs(element: Element, current: readonly VElement.Attr[], next: readonly VElement.Attr[]) {
  const currentAttrs = [...current];

  for (let i = 0; i < next.length; i++) {
    const nextAttr = next[i];
    const currentAttrIndex = currentAttrs.findIndex((attr) => attr.matches(nextAttr));
    if (currentAttrIndex >= 0) {
      const [currentAttr] = currentAttrs.splice(currentAttrIndex, 1);
      updateElementAttr(element, currentAttr, nextAttr);
    } else {
      addElementAttr(element, nextAttr);
    }
  }

  for (let i = 0; i < currentAttrs.length; i++) {
    removeElementAttr(element, currentAttrs[i]);
  }
}

function addElementAttr(element: Element, next: VElement.Attr) {
  if (next.namespace) {
    element.setAttributeNS(next.namespace, next.name, next.value);
  } else {
    element.setAttribute(next.name, next.value);
  }
}

function updateElementAttr(element: Element, current: VElement.Attr, next: VElement.Attr) {
  if (current.value !== next.value) {
    if (next.namespace) {
      element.setAttributeNS(next.namespace, next.name, next.value);
    } else {
      element.setAttribute(next.name, next.value);
    }
  }
}

const removeElementAttr = (element: Element, current: VElement.Attr) => {
  if (current.namespace) {
    element.removeAttributeNS(current.namespace, current.name);
  } else {
    element.removeAttribute(current.name);
  }
}

//
// Element: Event Handlers
//

const listeners = new WeakMap<Element, Listener[]>();

function updateElementEventHandlers(dispatch: Dispatch, element: Element, current: readonly VElement.EventHandler[], next: readonly VElement.EventHandler[]) {
  const currentEventHandlers = [...current];

  for (let i = 0; i < next.length; i++) {
    const nextEventHandler = next[i];
    const currentEventHandlerIndex = currentEventHandlers.findIndex((attr) => attr.matches(nextEventHandler));
    if (currentEventHandlerIndex >= 0) {
      const [currentEventHandler] = currentEventHandlers.splice(currentEventHandlerIndex, 1);
        updateElementEventHandler(dispatch, element, currentEventHandler, nextEventHandler);
    } else {
      addElementEventHandler(dispatch, element, nextEventHandler);
    }
  }

  for (let i = 0; i < currentEventHandlers.length; i++) {
    removeElementEventHandler(dispatch, element, currentEventHandlers[i]);
  }
}

class Listener<EventType extends string = string, Ev extends Event = Event, Args extends any[] = any[], Message = any> {
  constructor(
    private readonly dispatch: Dispatch<Message>,
    readonly handler: VElement.EventHandler<EventType, Ev, Args, Message>,
  ) {}

  public handleEvent = (event: Ev) => {
    const { handler, args } = this.handler;
    const result = handler(event, ...args);
    if (result !== undefined) {
      this.dispatch(result);
    }
  }
}

function addElementEventHandler(dispatch: Dispatch, element: Element, next: VElement.EventHandler) {
  const currentListeners = listeners.get(element) || [];
  if (currentListeners.length === 0) {
    listeners.set(element, currentListeners);
  }

  const listener = new Listener(dispatch, next);
  currentListeners.push(listener);
  element.addEventListener(next.type, listener, next.options);
}

function updateElementEventHandler(dispatch: Dispatch, element: Element, current: VElement.EventHandler, next: VElement.EventHandler) {
}

function removeElementEventHandler(dispatch: Dispatch, element: Element, current: VElement.EventHandler) {
  const currentListeners: Listener[] = listeners.get(element) || [];
  const currentListenerIndex = currentListeners.findIndex((listener) => listener.handler.matches(current));

  if (currentListenerIndex >= 0) {
    const [listener] = currentListeners.splice(currentListenerIndex, 1);
    element.removeEventListener(current.type, listener, current.options);

    if (currentListeners.length === 0) {
      listeners.delete(element);
    }
  }
}

//
// Element: Props
//

function updateElementProps(element: Element, current: readonly VElement.Prop[], next: readonly VElement.Prop[]) {
  const currentProps = [...current];

  for (let i = 0; i < next.length; i++) {
    const nextProp = next[i];
    const currentPropIndex = currentProps.findIndex((attr) => attr.matches(nextProp));
    if (currentPropIndex >= 0) {
      const [currentProp] = currentProps.splice(currentPropIndex, 1);
        updateElementProp(element, currentProp, nextProp);
    } else {
      addElementProp(element, nextProp);
    }
  }

  for (let i = 0; i < currentProps.length; i++) {
    removeElementProp(element, currentProps[i]);
  }
}

function addElementProp(element: Element, next: VElement.Prop) {
  (element as any)[next.name] = next.value;
}

function updateElementProp(element: Element, current: VElement.Prop, next: VElement.Prop) {
  if (current.value !== next.value) {
    (element as any)[next.name] = next.value;
  }
}

function removeElementProp(element: Element, current: VElement.Prop) {
  delete  (element as any)[current.name];
}

//
// Children
//

function updateElementChildren(dispatch: Dispatch, container: Element, current: VElement.Children, next: VElement.Children) {
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
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      fragment.appendChild(render(dispatch, VElement.Child.unkey(child)));
    }
    container.insertBefore(fragment, before);
  } else if (children.length === 1) {
    container.insertBefore(render(dispatch, VElement.Child.unkey(children[0])), before);
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
  } else if (VElement.Child.isKeyed(current) && VElement.Child.isKeyed(next)) {
    const currentKey = current[0];
    const nextKey = next[0];
    return equals(currentKey, nextKey);
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
  const updatedNode = update(dispatch, currentNode, VElement.Child.unkey(current), VElement.Child.unkey(next));
  if (currentNode !== updatedNode) {
    target.replaceChild(updatedNode, currentNode);
  }
};
