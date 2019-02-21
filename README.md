# react-compo

_react-compo_ is the attempt to reinvent React hooks without magic. It is still in pre-release state so there is no full API documentation yet. But the simplest code with react-compo will looks like this:

```TypeScript
import React from 'react';
import { compo, state, effector } from 'react-compo';

type Props = { btnName: string };

export const Counter = compo('Counter', (use) => {
  // Declarations
  const [get, set] = use(state(0));    // like 'useState' React hook
  const titleEffect = use(effector()); // like 'useEffect' React hook
  const onClick = () => set((c: number) => c + 1);

  // Render function
  return ({ btnName }: Props) => {
    const count = get();
    titleEffect(() => (document.title = `${count} clicks`), [count]);

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
```
