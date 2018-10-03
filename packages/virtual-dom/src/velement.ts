import { VAttr, VEvent, VProp } from "./vattribute";
import { VNode } from "./vnode";

export class VElement<E extends Element> {
  private attrs: ReadonlyMap<string, VAttr>;
  private props: ReadonlyMap<string, VProp>;
  private events: ReadonlyMap<string, VEvent>;

  constructor(
    private namespace: string | undefined,
    private type: string,
    attributes: ReadonlyArray<VAttr | VProp | VEvent>,
    private children: ReadonlyArray<VNode>,
  ) {
    const classes: string[] = [];
    const attrs = new Map<string, VAttr>();
    const props = new Map<string, VProp>();
    const events = new Map<string, VEvent>();

    for (const attribute of attributes) {
      if (attribute instanceof VAttr) {
        if (attribute.namespace === undefined && attribute.name === "class") {
          classes.push(attribute.value);
        } else {
          attrs.set(attribute.qname, attribute);
        }
      } else if (attribute instanceof VProp) {
        if (attribute.key === "className" && typeof attribute.value === "string") {
          classes.push(attribute.value);
        } else {
          props.set(attribute.key, attribute);
        }
      } else if (attribute instanceof VEvent) {
        events.set(attribute.type, attribute);
      }
    }

    if (classes.length > 0) {
      const classVAttr = new VAttr("class", classes.join(" "));
      attrs.set(classVAttr.qname, classVAttr);
    }

    this.attrs = attrs;
    this.props = props;
    this.events = events;
  }

  public mount(): Node {
    const node = this.namespace
      ? document.createElementNS(this.namespace, this.type)
      : document.createElement(this.type);
    const element = node as E;

    this.updateAttrs(element, new Map());
    this.updateProps(element, new Map());
    this.updateEvents(element, new Map());

    for (const child of this.children) {
      element.appendChild(child.mount());
    }

    return element;
  }

  public unmount(node: Node): void {
    const children = node.childNodes;
    const vchildren = this.children;

    if (children.length !== vchildren.length) {
      throw new Error("Unmounting failed due to dom mismatch");
    }

    for (let i = 0; i < vchildren.length; i++) {
      const child = children[i];
      const vchild = vchildren[i];

      vchild.unmount(child);
    }
  }

  public update(node: Node, oldVNode: VElement<Element>): boolean {
    if (oldVNode === this) {
      return true;
    }

    if (
        node instanceof Element &&
        oldVNode instanceof VElement &&
        oldVNode.namespace === this.namespace &&
        oldVNode.type === this.type) {
      const element = node as E;
      const oldVElement = oldVNode;

      this.updateAttrs(element, oldVElement.attrs);
      this.updateProps(element, oldVElement.props);
      this.updateEvents(element, oldVElement.events);
      this.updateChildren(element, oldVElement.children);
      return true;
    }

    return false;
  }

  private updateAttrs(element: E, oldVAttrs: ReadonlyMap<string, VAttr>) {
    this.attrs.forEach((vattr, qname) => {
      const oldVAttr = oldVAttrs.get(qname);
      if (oldVAttr) {
        vattr.update(element, oldVAttr);
      } else {
        vattr.mount(element);
      }
    });

    oldVAttrs.forEach((oldVAttr, qname) => {
      if (!this.attrs.has(qname)) {
        oldVAttr.unmount(element);
      }
    });
  }

  private updateProps(element: E, oldVProps: ReadonlyMap<string, VProp>) {
    this.props.forEach((vprop, key) => {
      const oldVProp = oldVProps.get(key);
      if (oldVProp) {
        vprop.update(element, oldVProp);
      } else {
        vprop.mount(element);
      }
    });

    oldVProps.forEach((oldVProp, key) => {
      if (!this.props.has(key)) {
        oldVProp.unmount(element);
      }
    });
  }

  private updateEvents(element: E, oldVEvents: ReadonlyMap<string, VEvent>) {
    this.events.forEach((vevent, key) => {
      const oldVEvent = oldVEvents.get(key);
      if (oldVEvent) {
        vevent.update(element, oldVEvent);
      } else {
        vevent.mount(element);
      }
    });

    oldVEvents.forEach((oldVEvent, type) => {
      if (!this.events.has(type)) {
        oldVEvent.unmount(element);
      }
    });
  }

  private updateChildren(element: E, oldVChildren: ReadonlyArray<VNode>) {
    if (this.children === oldVChildren) {
      return;
    }
    /* FIXME: optimize */
    for (const oldVChild of oldVChildren) {
      oldVChild.unmount(element);
    }
    for (const vchild of this.children) {
      vchild.unmount(element);
    }
  }
}
