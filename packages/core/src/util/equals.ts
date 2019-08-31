/*
MIT License

Copyright (c) 2017 Evgeny Poberezkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const hasBigInt64Array = typeof BigInt64Array !== 'undefined';

export function equals(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a === 'object' && typeof b === 'object' && a && b) {
    if (a.constructor !== b.constructor) return false;

    if (Array.isArray(a)) {
      const length = a.length;
      if (length !== b.length) return false;

      for (let i = length; i-- !== 0;) {
        if (!equals(a[i], b[i])) return false;
      }

      return true;
    }

    if (a instanceof Map) {
      if (a.size !== b.size) return false;

      for (let key of a.keys()) {
        if (!b.has(key)) return false;
      }

      for (let [key, value] of a.entries()) {
        if (!equals(value, b.get(key))) return false;
      }

      return true;
    }

    if (a instanceof Set) {
      if (a.size !== b.size) return false;
      for (let value of a.values()) {
        if (!b.has(value)) return false;
      }

      return true;
    }

    if (a.constructor.BYTES_PER_ELEMENT && (
      a instanceof Int8Array ||
      a instanceof Uint8Array ||
      a instanceof Uint8ClampedArray ||
      a instanceof Int16Array ||
      a instanceof Uint16Array ||
      a instanceof Int32Array ||
      a instanceof Uint32Array ||
      a instanceof Float32Array ||
      a instanceof Float64Array ||
      (hasBigInt64Array && (a instanceof BigInt64Array || a instanceof BigUint64Array))
    )) {
      const length = a.length;
      if (length !== b.length) return false;
      for (let i = length; i-- !== 0;) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    const keys = Object.keys(a);
    const length = keys.length;

    if (length !== Object.keys(b).length) return false;

    for (let i = length; i-- !== 0;) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    }

    for (let i = length; i-- !== 0;) {
      if (!equals(a[keys[i]], b[keys[i]])) return false;
    }

    return true;
  }

  return a !== a && b !== b;
}
