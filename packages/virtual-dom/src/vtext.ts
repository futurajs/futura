import { VNode } from "./vnode";


export class VText {
  constructor(
    private content: string,
  ) {}

  public mount(): Node {
    return document.createTextNode(this.content);
  }

  public unmount(_node: Node): void {
    // Nothing
  }

  public update(oldNode: Node, oldVNode: VNode): boolean {
    if (oldVNode === this) {
      return true;
    }

    if (oldNode instanceof Text && oldVNode instanceof VText) {
      if (oldVNode.content !== this.content) {
        oldNode.replaceData(0, this.content.length, this.content);
      }
      return true;
    }

    return false;
  }
}
