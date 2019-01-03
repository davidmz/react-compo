export type EffectCleaner = () => void;
export type Effect = () => any;

export type Effector = (effect: Effect, deps?: any) => void;

export type EffectCreator = () => Effector;

export const bindEffectCreator = (
  onEffect: (key: string, effect: Effect) => void
): EffectCreator => {
  let keyCounter = 0;
  return () => {
    const key = `${++keyCounter}`;
    let prevDeps: any;
    return (effect: Effect, deps?: any) => {
      if (deps && Array.isArray(deps)) {
        if (arrEqual(deps, prevDeps)) {
          // Skip this call
          return;
        }
        prevDeps = deps;
      }
      onEffect(key, effect);
    };
  };
};

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
