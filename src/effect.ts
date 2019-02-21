import { DID_UPDATE, WILL_UNMOUNT, Use, compoEvents } from './compo';

export type EffectCleaner = () => void;
export type Effect = () => any;

export type Effector = (effect: Effect, deps?: any) => void;

export const effector = () => (use: Use): Effector => {
  const events = use(compoEvents);
  let effect: Effect | null = null;
  let cleaner: EffectCleaner | null = null;
  let prevDeps: any;

  events.on(DID_UPDATE, () => {
    if (!effect) {
      return;
    }
    cleaner && cleaner();
    const cl = effect();
    effect = null;
    cleaner = null;
    if (typeof cl === 'function') {
      cleaner = cl as EffectCleaner;
    }
  });

  events.once(WILL_UNMOUNT, () => {
    cleaner && cleaner();
    effect = null;
    cleaner = null;
    prevDeps = null;
  });

  return (eff: Effect, deps?: any) => {
    if (!arrEqual(deps, prevDeps)) {
      prevDeps = deps;
      effect = eff;
    }
  };
};

///////////////////

function arrEqual(a1: any, a2: any): boolean {
  if (!Array.isArray(a1) || !Array.isArray(a2) || a1.length !== a2.length) {
    return false;
  }
  for (let i = 0; i < a2.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}