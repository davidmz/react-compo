import { EventEmitter } from 'events';
import { newBag } from './bag';

export const currentComponent = newBag<EventEmitter | null>(null);

// Typescript cannot preserve generic types here, so use a lot of any
export const bindToCurrentComponent = <T extends (...args: any[]) => any>(
  name: string,
  createOn: (e: EventEmitter) => T
) => (...args: any[]) => {
  const events = currentComponent();
  if (!events) {
    throw new Error(
      `You can use '${name}' only on initialization phase of your 'compo' component, i.e. before the render function creation.`
    );
  }
  return createOn(events)(...args);
};
