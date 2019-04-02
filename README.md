# react-compo

_react-compo_ is the attempt to reinvent React hooks without magic. It is still in pre-release state so there is no full API documentation yet. But the simplest code with react-compo will looks like this:

```TypeScript
import React from 'react';
import {
   compo,
   newState,
   newReaction,
} from 'react-compo';

type Props = { btnName: string };

export const Counter = compo(
  'Counter', // Component 'displayName', may be omitted
  () => {
    // Initialization phase
    // This section executes once, before the first component render

    // State (like 'useState' React hook)
    const [getCount, setCount] = newState(0);
    // Reaction (like 'useEffect' React hook)
    const updateTitle = newReaction(
      (name: string, count: number) => (document.title = `${name} was clicked ${count} times`)
    );
    // Event handler (declare it once)
    const onClick = () => setCount((c: number) => c + 1);

    // Render phase
    // This functions calls at every render and performs render itself
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
  }
);
```
