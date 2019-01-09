import React from 'react';
import { compo } from '../src';
import { createState } from '../src/stateCreator';
import { createEffector } from '../src/effectCreator';

type Props = { btnName: string };

export const Counter = compo('Counter', () => {
  const [get, set] = createState(0);
  const titleEffect = createEffector();
  const onClick = () => set((c: number) => c + 1);

  return ({ btnName }: Props) => {
    const count = get();
    titleEffect(() => (document.title = `${count} clicks`));

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
