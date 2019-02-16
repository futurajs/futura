import equals from "fast-deep-equal";

import { Eq, EqMap, EqSet } from "../collections";


export class Subscriptions<Sub, SubState> {
  private readonly onAdded: Subscriptions.OnAdded<Sub, SubState>;
  private readonly onRemoved: Subscriptions.OnRemoved<Sub, SubState>;

  private readonly eq: Eq<Sub>;
  private readonly currentSubs: EqMap<Sub, SubState>;

  constructor(
      onAdded: Subscriptions.OnAdded<Sub, SubState>,
      onRemoved: Subscriptions.OnRemoved<Sub, SubState>,
      eq: Eq<Sub> = equals,
  ) {
    this.onAdded = onAdded;
    this.onRemoved = onRemoved;
    this.eq = eq;

    this.currentSubs = new EqMap(this.eq);
  }

  public update(s: ReadonlyArray<Sub>) {
    const currentSubs = this.currentSubs;
    const nextSubs = new EqSet(this.eq, s);

    // Removed
    for (const [currentSub, currentSubState] of currentSubs.entries()) {
      if (!nextSubs.has(currentSub)) {
        currentSubs.delete(currentSub);
        this.onRemoved(currentSub, currentSubState, currentSubs.size);
      }
    }

    // Added
    for (const nextSub of nextSubs.values()) {
      if (!currentSubs.has(nextSub)) {
        const nextSubState = this.onAdded(nextSub, currentSubs.size);
        this.currentSubs.set(nextSub, nextSubState);
      }
    }
  }

  public forEach(callback: (sub: Sub, subState: SubState) => void) {
    for (const [sub, subState] of this.currentSubs.entries()) {
      callback(sub, subState);
    }
  }
}

export namespace Subscriptions {
  export type OnAdded<Value, State> = (sub: Value, currentSubscriptionsCount: number) => State;
  export type OnRemoved<Value, State> = (sub: Value, state: State, remainingSubscriptionsCount: number) => void;
}
