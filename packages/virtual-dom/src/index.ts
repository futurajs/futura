import { VNode, VText, VElement, VThunk } from "./types";

/**
 * VNode types
 * 
 * */
export { VNode, VText, VElement, VThunk };

export type Props = ReadonlyArray<VElement.Attr | VElement.Prop | VElement.EventHandler | undefined | null>;
export type Content = UnkeyedContent | KeyedContent;
export type UnkeyedContent = Array<VNode | string | undefined | null>;
export type KeyedContent = Array<[any, VNode]>;


export const text = (content: string): VNode =>
  new VText(content);

export function element(namespace: string | undefined, tagName: string): VNode;
export function element(namespace: string | undefined, tagName: string, props: Props): VNode;
export function element(namespace: string | undefined, tagName: string, content: Content): VNode;
export function element(namespace: string | undefined, tagName: string, props: Props, content: Content): VNode;
export function element(namespace: string | undefined, tagName: string, propsOrContent?: Props | Content, maybeContent?: Content): VNode {
  if (propsOrContent !== undefined) {
    if (maybeContent !== undefined) {
      const props = propsOrContent as Props;
      return new VElement(namespace, tagName, data(props), children(maybeContent));
    } else {
      for (let i = 0; i < propsOrContent.length; i++) {
        const e = propsOrContent[i];
        if (e !== undefined && e !== null) {
          if (VElement.Data.isAttr (e) || VElement.Data.isProp (e) || VElement.Data.isEventHandler (e)) {
            return new VElement(namespace, tagName, data(propsOrContent as Props), []);
          }
          if (VNode.isVNode (e) || typeof e === "string" || Array.isArray(e)) {
            return new VElement(namespace, tagName, [], children(propsOrContent as Content));
          }
        }
      }
      return new VElement(namespace, tagName, [], []);
    }
  } else {
    return new VElement(namespace, tagName, [], []);
  }
}

const data = (props: Props): VElement.Data => {
  const result: Array<VElement.Attr | VElement.Prop | VElement.EventHandler> = [];
  const classes: Array<string> = [];
  const styles: Array<string> = [];
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (VElement.Data.isAttr(prop) && prop.name === "class" && prop.namespace === undefined) {
      classes.push(prop.value);
    } else if (VElement.Data.isProp(prop) && prop.name === "className") {
      classes.push(prop.value);
    } else if (VElement.Data.isAttr(prop) && prop.name === "style" && prop.namespace === undefined) {
      styles.push(prop.value);
    } else if (prop !== null && prop !== undefined) {
      result.push(prop);
    }
  }

  if (classes.length > 0) {
    result.push(new VElement.Attr(undefined, "class", classes.join(" ")));
  }

  if (styles.length > 0) {
    result.push(new VElement.Attr(undefined, "style", styles.join("; ")));
  }

  return result;
}

const children = (content: Content): VElement.Children => {
  if (content.length === 0 || VElement.Child.isKeyed(content[0])) {
    return content as VElement.Children;
  } else {
    // FIXME: optimize no-op
    const result: Array<VNode> = [];
    for (let i = 0; i < content.length; i++) {
      const value = content[i];
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

export const on = <T extends string, E extends Event, M, A extends any[]>(type: T, handler: (event: E, ...args: A) => M, options?: VElement.EventHandler.Options, ...args: A) =>
  new VElement.EventHandler(type, handler, args, options);

export const lazy = <Args extends any[]>(thunk: (...args: Args) => VNode, ...args: Args): VNode =>
  new VThunk<Args>(thunk, args);


export { render, update } from "./render";
