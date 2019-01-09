export interface Bag<T> {
  (): T;
  (newVal: T): void;
}

export function newBag<T>(initial: T): Bag<T> {
  let val = initial;
  return function() {
    if (arguments.length === 0) {
      return val;
    }
    val = arguments[0];
  } as Bag<T>;
}
