import { Events, SimpleEvents } from './events';

describe('#Events', () => {
  let events: Events;

  beforeEach(() => {
    events = new SimpleEvents();
  });

  it('should add event listeners', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    events.on('E1', handler1);
    events.on('E2', handler2);
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
    events.emit('E1');
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();
    events.emit('E1');
    expect(handler1).toHaveBeenCalledTimes(2);
    expect(handler2).not.toHaveBeenCalled();
    events.emit('E2');
    expect(handler1).toHaveBeenCalledTimes(2);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should add one-time listener', () => {
    const handler1 = jest.fn();
    events.once('E1', handler1);
    expect(handler1).not.toHaveBeenCalled();
    events.emit('E1');
    expect(handler1).toHaveBeenCalledTimes(1);
    events.emit('E1');
    expect(handler1).toHaveBeenCalledTimes(1);
  });

  it('should remove one-time listener before it called', () => {
    const handler1 = jest.fn();
    events.once('E1', handler1);
    expect(handler1).not.toHaveBeenCalled();
    events.off('E1', handler1);
    events.emit('E1');
    expect(handler1).not.toHaveBeenCalled();
  });

  it('should remove listener', () => {
    const handler1 = jest.fn();
    events.once('E1', handler1);
    expect(handler1).not.toHaveBeenCalled();
    events.emit('E1');
    expect(handler1).toHaveBeenCalledTimes(1);
    events.off('E1', handler1);
    events.emit('E1');
    expect(handler1).toHaveBeenCalledTimes(1);
  });

  it('should remove all listeners', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    events.on('E1', handler1);
    events.on('E2', handler2);
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
    events.emit('E1');
    events.emit('E2');
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
    events.removeAllListeners();
    events.emit('E1');
    events.emit('E2');
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});
