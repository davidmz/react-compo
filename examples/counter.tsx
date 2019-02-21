import React from 'react';
import { compo, state, effector } from 'react-compo';

type Props = { btnName: string };

export const Counter = compo('Counter', (use) => {
  // Declarations
  const [get, set] = use(state(0));
  const titleEffect = use(effector());
  const onClick = () => set((c: number) => c + 1);

  // Render function
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
