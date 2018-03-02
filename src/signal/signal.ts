import { Subscribable, Subscriber } from "./subscribable";
import { Subscription } from "./subscription";


export class Signal<T> implements Subscribable<T> {
  private readonly subscribers: Array<Subscriber<T>> = [];
  private readonly events: T[] = [];
  private emitting: boolean = false;

  public subscribe(subscriber: Subscriber<T>): Subscription {
    this.subscribers.push(subscriber);

    return new Subscription(() => {
      const index = this.subscribers.indexOf(subscriber);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    });
  }

  public emit(event: T) {
    this.events.push(event);
    if (!this.emitting) {
      this.emitting = true;

      while (this.events.length > 0) {
          const ev = this.events.shift();
          this.subscribers.forEach((subscriber) => {
              subscriber(ev!);
          });
      }

      this.emitting = false;
    }
  }
}
