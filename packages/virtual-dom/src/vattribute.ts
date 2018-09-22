// tslint:disable:max-classes-per-file


export type VAttribute<E extends Element, Prop extends Extract<keyof E, string> = Extract<keyof E, string>>
  = VAttr
  | VProp<Prop, E[Prop]>
  | VEvent<string, Event>;

export namespace VAttribute {
  export function isVAttribute(value: any): value is VAttribute<any> {
    return value instanceof VAttr || value instanceof VProp || value instanceof VEvent;
  }
}

export class VAttr {
  constructor(
    readonly name: string,
    readonly value: string,
    readonly namespace?: string,
  ) {}

  public get qname(): string {
    return this.namespace
      ? `${this.namespace}:${this.name}`
      : this.name;
  }

  public mount(element: Element): void {
    if (this.namespace) {
      element.setAttributeNS(this.namespace, this.name, this.value);
    } else {
      element.setAttribute(this.name, this.value);
    }
  }

  public unmount(element: Element): void {
    if (this.namespace) {
      element.removeAttributeNS(this.namespace, this.name);
    } else {
      element.removeAttribute(this.name);
    }
  }

  public update(element: Element, oldVAttr: VAttr): void {
    // assert: oldVAttr.namespace === this.namespace
    // assert: oldVAttr.name === this.name
    if (this.value !== oldVAttr.value) {
      this.mount(element);
    }
  }
}

export class VProp<K extends string, V> {
  constructor(
    readonly key: K,
    readonly value: V,
  ) {}
}

export class VEvent<T extends string, Ev extends Event> {
  constructor(
    readonly type: T,
    readonly handler: (event: Ev) => void,
    readonly options: EventOptions = {},
  ) {}

  public mount<E extends HasEvent<T, Ev>>(element: E) {
    element.addEventListener(this.type, this.handler, this.options);
  }

  public unmount<E extends HasEvent<T, Ev>>(element: E) {
    element.removeEventListener(this.type, this.handler, this.options);
  }

  public update<E extends HasEvent<T, Ev>>(element: E, oldVEvent: VEvent<T, Ev>): void {
    // assert: oldVEvent.type === this.type
    if (this.handler !== oldVEvent.handler ||
        !!this.options.capture !== !!oldVEvent.options.capture ||
        !!this.options.passive !== !!oldVEvent.options.passive) {
      oldVEvent.unmount(element);
      this.mount(element);
    }
  }
}

export interface HasEvent<T extends string, Ev extends Event> {
  addEventListener(type: T, handler: (event: Ev) => void, options?: EventOptions): void;
  removeEventListener(type: T, handler: (event: Ev) => void, options?: EventOptions): void;
}

export interface EventOptions {
  capture?: boolean;
  passive?: boolean;
}
