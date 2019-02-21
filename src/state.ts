import { DO_UPDATE, Use, compoEvents } from './compo';

export type StateSetterArg<S> = S | ((v: S) => S);
export type StateGetter<S> = () => S;
export type StateSetter<S> = (v: StateSetterArg<S>) => void;

export const state = <S>(initial: S) => (
  use: Use
): [StateGetter<S>, StateSetter<S>] => {
  const events = use(compoEvents);
  let value = initial;
  return [
    // Get
    () => value,

    // Set
    (v: StateSetterArg<S>) => {
      if (typeof v === 'function') {
        v = (v as ((v: S) => S))(value);
      }
      if (value !== v) {
        value = v;
        events.emit(DO_UPDATE);
      }
    },
  ];
};
