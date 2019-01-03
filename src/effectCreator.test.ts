import { bindEffectCreator, EffectCreator } from './effectCreator';

describe('#effectCreator', () => {
  let createEffect: EffectCreator;
  const onEffect = jest.fn();
  beforeEach(() => {
    createEffect = bindEffectCreator(onEffect);
  });

  it('should add an effect', () => {
    const eff = createEffect();
    const foo = () => null;
    eff(foo);

    expect(onEffect).toHaveBeenCalledTimes(1);
    expect(onEffect).toHaveBeenCalledWith('1', foo);
  });

  it('should add two effects', () => {
    const eff1 = createEffect();
    const eff2 = createEffect();
    const foo = () => null;
    const bar = () => null;
    eff1(foo);
    eff2(bar);

    expect(onEffect).toHaveBeenCalledTimes(2);
    expect(onEffect).toHaveBeenNthCalledWith(1, '1', foo);
    expect(onEffect).toHaveBeenNthCalledWith(2, '2', bar);
  });

  it('should overwrite the same effect', () => {
    const eff = createEffect();
    const foo = () => null;
    const bar = () => null;
    eff(foo);
    eff(bar);

    expect(onEffect).toHaveBeenCalledTimes(2);
    expect(onEffect).toHaveBeenNthCalledWith(1, '1', foo);
    expect(onEffect).toHaveBeenNthCalledWith(2, '1', bar);
  });

  it('should not overwrite effect if deps is []', () => {
    const eff = createEffect();
    const foo = () => null;
    const bar = () => null;
    eff(foo, []);
    eff(bar, []);

    expect(onEffect).toHaveBeenCalledTimes(1);
    expect(onEffect).toHaveBeenNthCalledWith(1, '1', foo);
  });

  it('should overwrite effect if deps is the same but not arrays', () => {
    const eff = createEffect();
    const foo = () => null;
    const bar = () => null;
    eff(foo, 'foo');
    eff(bar, 'foo');

    expect(onEffect).toHaveBeenCalledTimes(2);
    expect(onEffect).toHaveBeenNthCalledWith(1, '1', foo);
    expect(onEffect).toHaveBeenNthCalledWith(2, '1', bar);
  });

  it('should not overwrite effect if deps is equal arrays', () => {
    const eff = createEffect();
    const foo = () => null;
    const bar = () => null;
    eff(foo, ['foo', 1]);
    eff(bar, ['foo', 1]);

    expect(onEffect).toHaveBeenCalledTimes(1);
    expect(onEffect).toHaveBeenCalledWith('1', foo);
  });
});
