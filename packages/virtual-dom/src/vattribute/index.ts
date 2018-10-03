import { VAttr } from "./vattr";
import { VEvent } from "./vevent";
import { VProp } from "./vprop";

export { VAttr, VEvent, VProp };
// export type VAttribute<E extends Element, Prop extends StringKeys<E> = StringKeys<E>>
//   = VAttr
//   | VProp<Prop, E[Prop]>
//   | VEvent<string, Event>;

// type StringKeys<T> = Extract<keyof T, string>;
