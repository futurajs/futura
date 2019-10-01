import { util } from "@futura/core";

const equals = util.equals;

export type VNode
  = VText
  | VElement
  | VThunk;

export namespace VNode {
  export const enum Type {
    Text = 1,
    Element = 2,
    Thunk = 3,
  }

  export const isVText = (value: any): value is VText => value && value.$type === Type.Text;
  export const isVElement = (value: any): value is VElement => value && value.$type === Type.Element;
  export const isVThunk = (value: any): value is VThunk => value && value.$type === Type.Thunk;
  export const isVNode = (value: any): value is VNode => isVText(value) || isVElement(value) || isVThunk(value);
}


export class VText {
  readonly $type: VNode.Type.Text = VNode.Type.Text;

  constructor(
    readonly content: string,
  ) {}
}

export class VElement {
  readonly $type: VNode.Type.Element = VNode.Type.Element;
  readonly attrs: readonly VElement.Attr[];
  readonly eventHandlers: readonly VElement.EventHandler[];
  readonly props: readonly VElement.Prop[];

  constructor(
    readonly namespace: string | undefined,
    readonly tagName: string,
    data: ReadonlyArray<VElement.Attr | VElement.EventHandler | VElement.Prop>,
    readonly children: VElement.Children,
  ) {
    this.attrs = data.filter(VElement.Data.isAttr);
    this.eventHandlers = data.filter(VElement.Data.isEventHandler);
    this.props = data.filter(VElement.Data.isProp);
  }
}

export namespace VElement {
  export type Children = readonly VNode[] | readonly KeyedChild[];
  export type Child = VNode | KeyedChild;
  export type KeyedChild = [any, VNode];
  export type Data = ReadonlyArray<Attr | EventHandler | Prop>;

  export namespace Child {
    export const isKeyed = (child: any): child is KeyedChild =>
      Array.isArray(child) && child.length === 2 && VNode.isVNode(child[1]);

    export const unkey = (child: Child): VNode =>
      Array.isArray(child) ? child[1] : child;
  }

  export namespace KeyedChild {
    export const unkey = (child: KeyedChild) =>
      child[1];
  }

  export namespace Data {
    export const enum Type {
      Attr = 100,
      EventHandler = 101,
      Prop = 102,
    }

    export const isAttr = (value: any): value is Attr => value && value.$type === Data.Type.Attr;
    export const isEventHandler = (value: any): value is EventHandler => value && value.$type === Data.Type.EventHandler;
    export const isProp = (value: any): value is Prop => value && value.$type === Data.Type.Prop;
  }

  export class Attr {
    readonly $type: Data.Type.Attr = Data.Type.Attr;

    constructor(
      readonly namespace: string | undefined,
      readonly name: string,
      readonly value: string,
    ) {}

    public matches(other: Attr) {
      return this.name === other.name
        && this.namespace === other.namespace;
    }
  }

  export class Prop<K extends string = string, V = any> {
    readonly $type: Data.Type.Prop = Data.Type.Prop;

    constructor(
      readonly name: K,
      readonly value: V,
    ) {}

    public matches(other: Prop) {
      return this.name === other.name;
    }
  }

  export class EventHandler<EventType extends string = string, Ev extends Event = Event, Args extends any[] = any[], Message = any> {
    readonly $type: Data.Type.EventHandler = Data.Type.EventHandler;

    constructor(
      readonly type: EventType,
      readonly handler: (event: Ev, ...args: Args) => Message,
      readonly args: Args,
      readonly options: EventHandler.Options = {},
    ) {}

    public matches(other: EventHandler) {
      return this.type === other.type
        && this.handler === other.handler
        && equals(this.args, other.args)
        && equals(this.options, other.options);
    }
  }

  export namespace EventHandler {
    export interface Options {
      capture?: boolean;
      passive?: boolean;
    }
  }
}

export class VThunk<Args extends any[] = any> {
  readonly $type: VNode.Type.Thunk = VNode.Type.Thunk;

  readonly thunk: (...args: Args) => VNode;
  readonly args: Args;
  private _vnode: VNode | undefined;

  constructor(thunk: (...args: Args) => VNode, args: Args) {
    this.thunk = thunk;
    this.args = args;
  }

  public render(): VNode {
    if (this._vnode === undefined) {
      this._vnode = this.thunk(...this.args);
    }
    return this._vnode;
  }
}
