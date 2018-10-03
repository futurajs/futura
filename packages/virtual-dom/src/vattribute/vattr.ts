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
