import { effector } from './effect';
import { DID_UPDATE, WILL_UNMOUNT, Use, useWith } from './compo';
import { Events, SimpleEvents } from './events';

describe('#effectCreator', () => {
  let events: Events;
  let use: Use;

  beforeEach(() => {
    events = new SimpleEvents();
    use = useWith(events);
  });

  it('should add an effect', () => {
    const eff = use(effector());
    const foo = jest.fn();
    eff(foo);
    events.emit(DID_UPDATE);

    expect(foo).toHaveBeenCalled();
  });

  it('should add two effects', () => {
    const eff1 = use(effector());
    const eff2 = use(effector());
    const foo = jest.fn();
    const bar = jest.fn();
    eff1(foo);
    eff2(bar);
    events.emit(DID_UPDATE);

    expect(foo).toHaveBeenCalled();
    expect(bar).toHaveBeenCalled();
  });

  it('should overwrite the same effect', () => {
    const eff = use(effector());
    const foo = jest.fn();
    const bar = jest.fn();
    eff(foo);
    eff(bar);
    events.emit(DID_UPDATE);

    expect(foo).not.toHaveBeenCalled();
    expect(bar).toHaveBeenCalled();
  });

  it('should not overwrite effect if deps is []', () => {
    const eff = use(effector());
    const foo = jest.fn();
    const bar = jest.fn();
    eff(foo, []);
    eff(bar, []);
    events.emit(DID_UPDATE);

    expect(foo).toHaveBeenCalled();
    expect(bar).not.toHaveBeenCalled();
  });

  it('should overwrite effect if deps is the same but not arrays', () => {
    const eff = use(effector());
    const foo = jest.fn();
    const bar = jest.fn();
    eff(foo, 'foo');
    eff(bar, 'foo');

    events.emit(DID_UPDATE);

    expect(foo).not.toHaveBeenCalled();
    expect(bar).toHaveBeenCalled();
  });

  it('should not overwrite effect if deps is equal arrays', () => {
    const eff = use(effector());
    const foo = jest.fn();
    const bar = jest.fn();
    eff(foo, ['foo', 1]);
    eff(bar, ['foo', 1]);

    events.emit(DID_UPDATE);

    expect(foo).toHaveBeenCalled();
    expect(bar).not.toHaveBeenCalled();
  });

  describe('cleaners', () => {
    it('should call cleaner after update', () => {
      const eff = use(effector());
      const cleaner = jest.fn();
      const effect = jest.fn(() => cleaner);

      eff(effect);
      events.emit(DID_UPDATE);
      expect(effect).toHaveBeenCalled();
      expect(cleaner).not.toHaveBeenCalled();
      jest.clearAllMocks();

      eff(effect);
      events.emit(DID_UPDATE);
      expect(effect).toHaveBeenCalled();
      expect(cleaner).toHaveBeenCalled();
      jest.clearAllMocks();

      events.emit(WILL_UNMOUNT);
      expect(effect).not.toHaveBeenCalled();
      expect(cleaner).toHaveBeenCalled();
      jest.clearAllMocks();
    });

    it('should call []-effect cleaner before unmount', () => {
      const eff = use(effector());
      const cleaner = jest.fn();
      const effect = jest.fn(() => cleaner);

      eff(effect, []);
      events.emit(DID_UPDATE);
      expect(effect).toHaveBeenCalled();
      expect(cleaner).not.toHaveBeenCalled();
      jest.clearAllMocks();

      eff(effect, []);
      events.emit(DID_UPDATE);
      expect(effect).not.toHaveBeenCalled();
      expect(cleaner).not.toHaveBeenCalled();
      jest.clearAllMocks();

      events.emit(WILL_UNMOUNT);
      expect(effect).not.toHaveBeenCalled();
      expect(cleaner).toHaveBeenCalled();
      jest.clearAllMocks();
    });
  });
});
