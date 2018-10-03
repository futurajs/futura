export class VProp<K extends string = string, V = any> {
  constructor(
    readonly key: K,
    readonly value: V,
  ) {}

  public mount<E extends HasProp<K, V>>(element: E) {
    element[this.key] = this.value;
  }

  public unmount<E extends HasProp<K, V>>(element: E) {
    delete element[this.key];
  }

  public update<E extends HasProp<K, V>>(element: E, oldVProp: VProp<K, V>): void {
    // assert: oldVProp.key === this.key
    if (oldVProp.value !== this.value) {
      element[this.key] = this.value;
    }
  }
}

type HasProp<K extends string, V> = {
  [property in K]: V;
}
