import { Eq } from "./types";


export class EqMap<K, V> {
  private readonly eq: Eq<K>;
  private items: Array<[K, V]>;

  constructor(eq: Eq<K>) {
    this.eq = (a, b) => a === b || eq(a, b);
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  public has(k: K): boolean {
    for (const [ik] of this.items) {
      if (this.eq(k, ik)) {
        return true;
      }
    }
    return false;
  }

  public get(k: K): V | undefined {
    for (const [ik, iv] of this.items) {
      if (this.eq(k, ik)) {
        return iv;
      }
    }

    return undefined;
  }

  public set(k: K, v: V): this {
    if (v !== undefined) {
      for (let index = 0; index < this.items.length; index++) {
        const [ik] = this.items[index];
        if (this.eq(k, ik)) {
          this.items.splice(index, 1, [k, v]);
          return this;
        }
      }
      this.items.push([k, v]);
    } else {
      this.delete(k);
    }

    return this;
  }

  public delete(k: K): V | undefined {
    for (let index = 0; index < this.items.length; index++) {
      const [ik, iv] = this.items[index];
      if (this.eq(k, ik)) {
        this.items.splice(index, 1);
        return iv;
      }
    }

    return undefined;
  }

  public clear() {
    this.items = [];
  }

  public entries(): ReadonlyArray<[K, V]> {
    return this.items;
  }

  public keys(): ReadonlyArray<K> {
    return this.items.map(([key]) => key);
  }

  public values(): ReadonlyArray<V> {
    return this.items.map(([, value]) => value);
  }
}
