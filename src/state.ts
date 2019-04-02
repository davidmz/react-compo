import EventEmitter from 'events';

import { DO_UPDATE, withCurrentComponent } from './compo';

export type StateGetter<S> = () => S;
export type StateSetter<S> = (v: S | ((v: S) => S)) => void;
export type StateCreator = <S>(initial: S) => [StateGetter<S>, StateSetter<S>];

export const newStateWith = (events: EventEmitter): StateCreator => <S>(
  initial: S
) => {
  let value = initial;
  return [
    // Get
    () => value,

    // Set
    (v: S | ((v: S) => S)) => {
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

export const newState = withCurrentComponent(
  'newState',
  newStateWith
) as StateCreator;
