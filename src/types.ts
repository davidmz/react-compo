import { StateCreator } from './stateCreator';
import { EffectCreator } from './effectCreator';
import { ReactNode } from 'react';

export interface CompoTools {
  // Predefined tools
  createState: StateCreator;
  createEffect: EffectCreator;
  // Helper to bind a custom tool creator
  use: CustomToolBinder;
}

type CustomToolBinder = <T>(cc: CustomToolCreator<T>) => T;
export type CustomToolCreator<T> = (tools: CompoTools) => T;

export type RenderFunc<P> = (props: P) => ReactNode;
export type CompoFunc<P> = (hc: CompoTools) => RenderFunc<P>;
