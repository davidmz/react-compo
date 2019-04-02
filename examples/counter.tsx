import React from 'react';
import { compo, newState, newReaction } from '../src';

type Props = { btnName: string };

export const Counter = compo(function Counter() {
  // Initialization
  const [getCount, setCount] = newState(0);
  const updateTitle = newReaction(
    (name: string, count: number) =>
      (document.title = `${name} was clicked ${count} times`)
  );
  const onClick = () => setCount((c: number) => c + 1);

  // Render function
  return ({ btnName }: Props) => {
    const count = getCount();
    updateTitle(btnName, count);

    return (
      <p>
        This{' '}
        <button type="button" onClick={onClick}>
          {btnName}
        </button>{' '}
        was clicked {count} times.
      </p>
    );
  };
});
