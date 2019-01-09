import { createStateOn } from './stateCreator';
import { EventEmitter } from 'events';
import { UPDATE } from './compo';

describe('#stateCreator', () => {
  const events = new EventEmitter();
  const createState = createStateOn(events);

  it('should return an initial state', () => {
    const [get] = createState(42);
    expect(get()).toBe(42);
  });

  it('should update state', () => {
    const [get, set] = createState(42);
    set(43);
    expect(get()).toBe(43);
  });

  it('should update state via function', () => {
    const [get, set] = createState(42);
    set((x) => x * 2);
    expect(get()).toBe(84);
  });

  it('should update on new state', () => {
    const [, set] = createState(42);
    const fn = jest.fn();
    events.once(UPDATE, fn);
    set(43);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should not update on the same state', () => {
    const [, set] = createState(42);
    const fn = jest.fn();
    events.once(UPDATE, fn);
    set(42);
    expect(fn).not.toHaveBeenCalled();
  });
});
