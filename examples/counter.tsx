import React from 'react';
import { compo } from '../src';

export const Counter = compo('Counter', ({ createState, createEffect }) => {
  const [get, set] = createState(0);
  const titleEffect = createEffect();
  const onClick = () => set((c: number) => c + 1);

  return () => {
    const count = get();
    titleEffect(() => (document.title = `${count} clicks`));

    return (
      <p>
        This{' '}
        <button type="button" onClick={onClick}>
          button
        </button>{' '}
        was clicked {count} times.
      </p>
    );
  };
});
