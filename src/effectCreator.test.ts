import { createEffectorOn, EffectCreator } from './effectCreator';
import { EventEmitter } from 'events';
import { DID_UPDATE, WILL_UNMOUNT } from './compo';

describe('#effectCreator', () => {
  let createEffect: EffectCreator;
  let events: EventEmitter;

  beforeEach(() => {
    events = new EventEmitter();
    createEffect = createEffectorOn(events);
  });

  it('should add an effect', () => {
    const eff = createEffect();
    const foo = jest.fn();
    eff(foo);
    events.emit(DID_UPDATE);

    expect(foo).toHaveBeenCalled();
  });

  it('should add two effects', () => {
    const eff1 = createEffect();
    const eff2 = createEffect();
    const foo = jest.fn();
    const bar = jest.fn();
    eff1(foo);
    eff2(bar);
    events.emit(DID_UPDATE);

    expect(foo).toHaveBeenCalled();
    expect(bar).toHaveBeenCalled();
  });

  it('should overwrite the same effect', () => {
    const eff = createEffect();
    const foo = jest.fn();
    const bar = jest.fn();
    eff(foo);
    eff(bar);
    events.emit(DID_UPDATE);

    expect(foo).not.toHaveBeenCalled();
    expect(bar).toHaveBeenCalled();
  });

  it('should not overwrite effect if deps is []', () => {
    const eff = createEffect();
    const foo = jest.fn();
    const bar = jest.fn();
    eff(foo, []);
    eff(bar, []);
    events.emit(DID_UPDATE);

    expect(foo).toHaveBeenCalled();
    expect(bar).not.toHaveBeenCalled();
  });

  it('should overwrite effect if deps is the same but not arrays', () => {
    const eff = createEffect();
    const foo = jest.fn();
    const bar = jest.fn();
    eff(foo, 'foo');
    eff(bar, 'foo');

    events.emit(DID_UPDATE);

    expect(foo).not.toHaveBeenCalled();
    expect(bar).toHaveBeenCalled();
  });

  it('should not overwrite effect if deps is equal arrays', () => {
    const eff = createEffect();
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
      const eff = createEffect();
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
      const eff = createEffect();
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
