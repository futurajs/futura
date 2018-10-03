export class VEvent<T extends string = string, Ev extends Event = Event> {
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

interface HasEvent<T extends string, Ev> {
  addEventListener(type: T, handler: (event: Ev) => void, options?: EventOptions): void;
  removeEventListener(type: T, handler: (event: Ev) => void, options?: EventOptions): void;
}

interface EventOptions {
  capture?: boolean;
  passive?: boolean;
}
