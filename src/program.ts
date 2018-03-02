import { Req, Services, Sub } from "./services";
import { Signal, Subscription, Value } from "./signal";


export const program = <State, Message>(options: Program.Options<State, Message>) =>
  new Program(options);


/** Internals */

export class Program<State, Message> {
  private readonly state$: Value<State>;
  private readonly message$: Signal<Message>;
  private readonly services: Services<Message>;

  constructor(options: Program.Options<State, Message>) {
    const { init, update, subscriptions } = options;
    const { state: initialState, requests: initialRequests } = init();

    this.state$ = new Value(initialState);
    this.message$ = new Signal<Message>();
    this.services = new Services(this.update);

    this.message$.subscribe((message) => {
      const { state, requests = [] } = update(this.state$.value, message);

      this.state$.value = state;
      this.services.handleRequests(requests);
      this.services.updateSubscriptions(subscriptions ? subscriptions(state) : []);
    });
    this.services.handleRequests(initialRequests);
    this.services.updateSubscriptions(subscriptions ? subscriptions(initialState) : []);
  }

  get state() {
    return this.state$.value;
  }

  public update = (message: Message) => {
    this.message$.emit(message);
  }

  public observe = (observer: (state: State) => void): Subscription => {
    return this.state$.subscribe(observer);
  }
}


/** Types */

export namespace Program {
  export interface Options<State, Message> {
    init(): Next<State, Message>;
    update(state: State, message: Message): Next<State, Message>;
    subscriptions?(state: State): ReadonlyArray<Sub<Message, any>>;
  }

  export interface Next<State, Message> {
    state: State;
    requests: ReadonlyArray<Req<Message, any>>;
  }
}

export type Dispatch<Message = any> = (message: Message) => void;
