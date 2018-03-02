import { Eq } from "./types";


export class EqSet<V> {
  private readonly eq: Eq<V>;
  private items: V[];

  constructor(eq: Eq<V>, values?: ReadonlyArray<V>) {
    this.eq = (a, b) => a === b || eq(a, b);
    this.items = [];

    if (values) {
      for (const value of values) {
        this.add(value);
      }
    }
  }

  get size() {
    return this.items.length;
  }

  public has(v: V): boolean {
    for (const item of this.items) {
      if (this.eq(v, item)) {
        return true;
      }
    }
    return false;
  }

  public add(v: V): this {
    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index];
      if (this.eq(v, item)) {
        this.items.splice(index, 1, v);
        return this;
      }
    }

    this.items.push(v);
    return this;
  }

  public delete(v: V): boolean {
    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index];
      if (this.eq(v, item)) {
        this.items.splice(index, 1);
        return true;
      }
    }

    return false;
  }

  public clear() {
    this.items = [];
  }

  public entries(): ReadonlyArray<[number, V]> {
    return this.items.map((value, index) => [index, value] as [number, V]);
  }

  public values(): ReadonlyArray<V> {
    return this.items;
  }
}
