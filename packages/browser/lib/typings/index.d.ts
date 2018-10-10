import { Program } from "@futura/core";
import { VNode } from "@futura/virtual-dom";
export declare const program: <State, Message>(options: Program.Options<State, Message>) => BrowserProgram<State, Message>;
declare class BrowserProgram<State, Message> extends Program<State, Message> {
    embed(view: View<State>, container: Element, before?: Node | null): {
        cancel: () => void;
    };
}
declare type View<State> = (state: State) => VNode;
export {};
