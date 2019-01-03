import { bindStateCreator } from './stateCreator';

describe('#stateCreator', () => {
  const onChange = jest.fn();
  const createState = bindStateCreator(onChange);

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

  it('should call onChange on new state', () => {
    const [, set] = createState(42);
    set(43);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should not call onChange on the same state', () => {
    const [, set] = createState(42);
    set(42);
    expect(onChange).not.toHaveBeenCalled();
  });
});
