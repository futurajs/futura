import { Program } from "@futura/core";
import { render, update, VNode } from "@futura/virtual-dom";


export const program = <State, Message>(options: Program.Options<State, Message>): BrowserProgram<State, Message> =>
  new BrowserProgram(options);

class BrowserProgram<State, Message> extends Program<State, Message> {
  public embed(view: View<State>, container: Element, before: Node | null = null) {
    let vnode: VNode | undefined = undefined;
    let node: Node | undefined = undefined;
    const dispatch = this.update;

    const sub = this.observe((state: State) => {
      const newVNode = view(state);

      if (vnode && node) {
        const newNode = update(dispatch, node, vnode, newVNode);
        if (newNode !== node) {
          container.replaceChild(newNode, node);
          node = newNode;
        }
      } else {
        node = render(dispatch, newVNode);
        container.insertBefore(node, before);
      }

      vnode = newVNode;
    });

    return {
      cancel: () => {
        if (node) {
          container.removeChild(node);
          vnode = undefined;
          node = undefined;
        }
        sub.cancel();
      }
    };
  }
}

type View<State> = (state: State) => VNode;
