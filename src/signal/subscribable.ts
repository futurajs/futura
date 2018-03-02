import { Subscription } from "./subscription";


export interface Subscribable<T> {
  subscribe(subscriber: Subscriber<T>): Subscription;
}

export type Subscriber<T> = (value: T) => void;
