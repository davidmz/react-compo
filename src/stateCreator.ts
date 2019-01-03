export type StateSetterArg<S> = S | ((v: S) => S);
export type StateGetter<S> = () => S;
export type StateSetter<S> = (v: StateSetterArg<S>) => void;

export type StateCreator = <S>(initial: S) => [StateGetter<S>, StateSetter<S>];

export const bindStateCreator = (onChange: () => void) => <S>(
  initial: S
): [StateGetter<S>, StateSetter<S>] => {
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
        onChange();
      }
    },
  ];
};
