import { newBag } from './bag';

describe('#bag', () => {
  it('should return initial value', () => {
    const bag = newBag(42);
    expect(bag()).toBe(42);
  });

  it('should change value', () => {
    const bag = newBag(42);
    bag(43);
    expect(bag()).toBe(43);
  });

  it('should change value to undefined', () => {
    const bag = newBag<number | undefined>(42);
    bag(undefined);
    expect(bag()).toBeUndefined();
  });
});
