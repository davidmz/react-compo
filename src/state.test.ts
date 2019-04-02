import EventEmitter from 'events';

import { newStateWith } from './state';
import { DO_UPDATE } from './compo';

describe('#newState', () => {
  const events = new EventEmitter();
  const newState = newStateWith(events);

  it('should return an initial state', () => {
    const [get] = newState(42);
    expect(get()).toBe(42);
  });

  it('should update state', () => {
    const [get, set] = newState(42);
    set(43);
    expect(get()).toBe(43);
  });

  it('should update state via function', () => {
    const [get, set] = newState(42);
    set((x) => x * 2);
    expect(get()).toBe(84);
  });

  it('should update on new state', () => {
    const [, set] = newState(42);
    const fn = jest.fn();
    events.once(DO_UPDATE, fn);
    set(43);
    expect(fn).toHaveBeenCalled();
  });

  it('should not update on the same state', () => {
    const [, set] = newState(42);
    const fn = jest.fn();
    events.once(DO_UPDATE, fn);
    set(42);
    expect(fn).not.toHaveBeenCalled();
  });
});
