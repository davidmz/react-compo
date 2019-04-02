import EventEmitter from 'events';

import { newReactionWith, ReactionCreator } from './reaction';
import { DID_UPDATE, WILL_UNMOUNT } from './compo';

describe('#newReaction', () => {
  let events: EventEmitter;
  let newReaction: ReactionCreator;

  beforeEach(() => {
    events = new EventEmitter();
    newReaction = newReactionWith(events);
  });

  it('should add a reaction', () => {
    const foo = jest.fn();
    const eff = newReaction(foo);
    eff();
    events.emit(DID_UPDATE);

    expect(foo).toHaveBeenCalled();
  });

  it('should add two effects', () => {
    const foo = jest.fn();
    const bar = jest.fn();
    const fooReaction = newReaction(foo);
    const barReaction = newReaction(bar);
    fooReaction();
    barReaction();
    events.emit(DID_UPDATE);

    expect(foo).toHaveBeenCalled();
    expect(bar).toHaveBeenCalled();
  });

  it('should overwrite effect if deps are empty', () => {
    const effect = jest.fn();
    const eff = newReaction(effect);

    eff();
    events.emit(DID_UPDATE);
    expect(effect).toHaveBeenCalled();
    jest.clearAllMocks();

    eff();
    events.emit(DID_UPDATE);
    expect(effect).toHaveBeenCalled();
    jest.clearAllMocks();
  });

  it('should not call effect if deps are equal', () => {
    const effect = jest.fn();
    const eff = newReaction(effect);

    eff('foo', 1);
    events.emit(DID_UPDATE);
    expect(effect).toHaveBeenCalledWith('foo', 1);
    jest.clearAllMocks();

    eff('foo', 1);
    events.emit(DID_UPDATE);
    expect(effect).not.toHaveBeenCalled();
    jest.clearAllMocks();
  });

  describe('cleaners', () => {
    it('should call cleaner after update', () => {
      const cleaner = jest.fn();
      const effect = jest.fn(() => cleaner);
      const eff = newReaction(effect);

      eff();
      events.emit(DID_UPDATE);
      expect(effect).toHaveBeenCalled();
      expect(cleaner).not.toHaveBeenCalled();
      jest.clearAllMocks();

      eff();
      events.emit(DID_UPDATE);
      expect(effect).toHaveBeenCalled();
      expect(cleaner).toHaveBeenCalled();
      jest.clearAllMocks();

      events.emit(WILL_UNMOUNT);
      expect(effect).not.toHaveBeenCalled();
      expect(cleaner).toHaveBeenCalled();
      jest.clearAllMocks();
    });

    it('should call once-time cleaner before unmount', () => {
      const cleaner = jest.fn();
      const effect = jest.fn(() => cleaner);
      // Call at first render only
      newReaction(effect)();

      events.emit(DID_UPDATE);
      expect(effect).toHaveBeenCalled();
      expect(cleaner).not.toHaveBeenCalled();
      jest.clearAllMocks();

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
