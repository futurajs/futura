import { Dispatch } from "@futura/core";

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

  constructor(
    readonly namespace: string | undefined,
    readonly tagName: string,
    readonly data: ReadonlyArray<VElement.Attr | VElement.EventHandler | VElement.Prop>,
    readonly children: VElement.Children,
  ) {}
}

export namespace VElement {
  export type Children = ReadonlyArray<VNode> | ReadonlyArray<[any, VNode]>;
  export type Child = VNode| [any, VNode];
  export type Data = ReadonlyArray<Attr | EventHandler | Prop>;

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
  }

  export class Prop<K extends string = string, V = any> {
    readonly $type: Data.Type.Prop = Data.Type.Prop;

    constructor(
      readonly name: K,
      readonly value: V,
    ) {}
  }

  export class EventHandler<T extends string = string, Ev extends Event = Event, A extends any[] = any[], M = any> {
    readonly $type: Data.Type.EventHandler = Data.Type.EventHandler;

    private _listener: ((event: Ev) => void) | undefined;

    constructor(
      readonly type: T,
      readonly handler: (event: Ev, ...args: A) => M,
      readonly args: A,
      readonly options: EventHandler.Options = {},
    ) {}

    public createListener(dispatch: Dispatch) {
      if (!this._listener) {
        this._listener = (event: Ev) => {
          const result = this.handler(event, ...this.args);
          if (result !== undefined) {
            dispatch(result);
          }
        }
        return this._listener;
      } else {
        throw new Error(`@futura/virtual-dom: Listener already created`);
      }
    }

    public takeListener(other: EventHandler) {
      this._listener = other._listener;
      other._listener = undefined;
    }

    public getListener() {
      if (this._listener) {
        return this._listener;
      } else {
        throw new Error(`@futura/virtual-dom: Listener not created`);
      }
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
