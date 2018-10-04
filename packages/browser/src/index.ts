import { Program } from "@futura/core";
import { render, VNode } from "@futura/virtual-dom";


export const program = <State, Message>(options: Program.Options<State, Message>): BrowserProgram<State, Message> =>
  new BrowserProgram(options);

class BrowserProgram<State, Message> extends Program<State, Message> {
  public embed(container: Element, view: View<State>) {
    let vnode: VNode | undefined = undefined;
    let node: Node | undefined = undefined;

    return this.observe((state: State) => {
      const newVNode = view(state);
      if (vnode && node) {
        const newNode = render(newVNode, vnode, node);
        if (newNode !== node) {
          container.replaceChild(newNode, node);
          node = newNode;
        }
      } else {
        node = render(newVNode);
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(node);
      }

      vnode = newVNode;
    });
  }
}

type View<State> = (state: State) => VNode;
