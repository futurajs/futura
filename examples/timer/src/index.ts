import { program } from "@futura/browser";
import { button, div, lazy, attributes, events } from "@futura/html";

import { /* after, */ every } from "./services/time";

const { classes } = attributes;
const { onClick } = events;

type State = number;

type Message
  = Tick
  | Reset;

class Tick {}
class Reset {}

const init = () =>
  ({
    state: 0,
    // requests: [after(1000, Tick)]
  });

const update = (state: State, message: Message) => {
  switch (message.constructor) {
    case Tick:
      return {
        state: state + 1,
        // requests: [ after(1000, Tick) ]
      };
    case Reset:
      return { state: 0 };
    default:
      return { state };
  }
};

const subscriptions = (_state: State) =>
  [ every(1000, Tick) ];

const view = (state: State) =>
  div([classes(["counter"])], [
    lazy(viewCount, state),
    lazy(viewButtons)
  ]);

const viewCount = (count: number) =>
  div([count.toString()]);

const viewButtons = () =>
  div([classes(["buttons"])], [
    button([ onClick(new Reset()) ], [ "Reset" ])
  ]);


const app = program<State, Message>({ init, update, subscriptions });
app.embed(view, document.getElementsByTagName("main")[0]);
