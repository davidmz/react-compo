import { state } from './state';
import { DO_UPDATE, useWith } from './compo';
import { Events, SimpleEvents } from './events';

describe('#stateCreator', () => {
  const events: Events = new SimpleEvents();
  const use = useWith(events);

  it('should return an initial state', () => {
    const [get] = use(state(42));
    expect(get()).toBe(42);
  });

  it('should update state', () => {
    const [get, set] = use(state(42));
    set(43);
    expect(get()).toBe(43);
  });

  it('should update state via function', () => {
    const [get, set] = use(state(42));
    set((x) => x * 2);
    expect(get()).toBe(84);
  });

  it('should update on new state', () => {
    const [, set] = use(state(42));
    const fn = jest.fn();
    events.once(DO_UPDATE, fn);
    set(43);
    expect(fn).toHaveBeenCalled();
  });

  it('should not update on the same state', () => {
    const [, set] = use(state(42));
    const fn = jest.fn();
    events.once(DO_UPDATE, fn);
    set(42);
    expect(fn).not.toHaveBeenCalled();
  });
});
