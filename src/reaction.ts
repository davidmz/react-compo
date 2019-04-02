import EventEmitter from 'events';

import { DID_UPDATE, WILL_UNMOUNT, withCurrentComponent } from './compo';

export type ReactionCreator = <F extends (...args: any[]) => any>(
  reaction: F
) => (...args: Parameters<F>) => void;

export const newReactionWith = (events: EventEmitter): ReactionCreator => <
  F extends (...args: any[]) => any
>(
  reaction: F
) => {
  let shouldRun: boolean = false;
  let cleaner: (() => void) | null = null;
  let prevArgs: Parameters<F> | null = null;

  events.on(DID_UPDATE, () => {
    if (!shouldRun) {
      return;
    }
    cleaner && cleaner();
    const cl = reaction(...prevArgs!);
    cleaner = null;
    shouldRun = false;
    if (typeof cl === 'function') {
      cleaner = cl as () => void;
    }
  });

  events.once(WILL_UNMOUNT, () => {
    cleaner && cleaner();
    shouldRun = false;
    cleaner = null;
    prevArgs = null;
  });

  return (...args: Parameters<F>) => {
    if (!arrEqual(args, prevArgs)) {
      shouldRun = true;
      prevArgs = args;
    }
  };
};

export const newReaction = withCurrentComponent(
  'newReaction',
  newReactionWith
) as ReactionCreator;

///////////////////

function arrEqual(a1: any, a2: any): boolean {
  if (
    !Array.isArray(a1) ||
    !Array.isArray(a2) ||
    a1.length !== a2.length ||
    a1.length === 0 // this is different from React's useEffect
  ) {
    return false;
  }
  for (let i = 0; i < a2.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}
