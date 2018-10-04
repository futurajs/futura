import { program } from "@futura/browser";
import { div } from "@futura/html";

import { after } from "./services/time";


type State = number;

type Message = Tick;
class Tick {}

const init = () =>
  ({
    state: 0,
    requests: [after(1000, Tick)]
  });

const update = (state: State, message: Message) => {
  switch (message.constructor) {
    case Tick:
      return { state: state + 1, requests: [ after(1000, Tick) ] };
    default:
      return { state };
  }
};

const view = (state: State) =>
  div([], state.toString());


const app = program<number, any>({ init, update });
const embed = app.embed(document.getElementsByTagName("main")[0], view);

if (module.hot) {
  module.hot.dispose(function () {
    embed.cancel();
  });
}
