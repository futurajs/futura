import { Signal } from "./signal";
import { Subscriber } from "./subscribable";
import { Subscription } from "./subscription";


export class Value<T> extends Signal<T> {
  private pValue: T;

  constructor(value: T) {
    super();
    this.pValue = value;
  }

  get value() {
    return this.pValue;
  }

  set value(newValue: T) {
    this.pValue = newValue;
    this.emit(newValue);
  }

  public subscribe(subscriber: Subscriber<T>): Subscription {
    subscriber(this.value);
    return super.subscribe(subscriber);
  }
}
