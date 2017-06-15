import asap from './asap';


export class Automaton<State extends HasTransitions<State, Event, Services>, Event, Services> {
  private _state: State;
  private readonly services: Services;
  private readonly subscribers: Subscriber<State>[] = [];

  constructor(state: State, services: Services) {
    this._state = state;
    this.services = services;
  }

  get state() {
    return this._state;
  }

  handleEvent = (event: Event) => {
    asap(() => {
      const state = this.state;
      try {
        const predicate = (transition: Transition<State, Event, Services>) =>
          isInstance(event, transition.on)

        const transitions = state.transitions || [];
        const matchingTransitions = transitions.filter(predicate);
        if (matchingTransitions.length > 0) {
          const newState = matchingTransitions[0].do.call(state, event, this.services);
          if (newState !== state) {
            this._state = newState;
            this.subscribers.forEach(notify => asap(notify, newState));
          }
        } else {
          console.warn('Unhandled event', event, ' in state ', state);
        }
      } catch (e) {
          console.error('Failed event', event, ' in state ', state, ' with error ', e);
      }
    });
  }

  subscribe(subscriber: Subscriber<State>): Subscription {
    const subscribers = this.subscribers;

    const notify = () => {
      const idx = subscribers.indexOf(notify);
      if (idx !== -1) {
        subscriber(this._state);
      }
    }

    const cancel = () => {
      const idx = subscribers.indexOf(notify);
      if (idx !== -1) {
        subscribers.splice(idx, 1);
      }
    }

    asap(notify);
    subscribers.push(notify);

    return { cancel };
  }
}

export interface HasTransitions<State, Event, Services> {
  transitions?: ReadonlyArray<Transition<State, Event, Services>>;
}

export interface Transition<State, Event, Services> {
  on: Function;
  do: (event: Event, services: Services) => State;
}

export interface Subscriber<State> {
  (state: State): void;
}

export interface Subscription {
  cancel(): void;
}

const isInstance = (value: any, type: any) =>
  value instanceof type;
