import { ComponentType, PureComponent } from 'react';

import { CompoTools, CompoFunc, RenderFunc } from './types';
import { bindStateCreator } from './stateCreator';
import { bindEffectCreator, Effect, EffectCleaner } from './effectCreator';

export { CompoTools as StdTools } from './types';

export function compo<P>(wrapped: CompoFunc<P>, _?: never): ComponentType<P>;
export function compo<P>(name: string, wrapped: CompoFunc<P>): ComponentType<P>;
export function compo<P>(arg1: any, arg2: any): ComponentType<P> {
  const wrapped = (typeof arg1 === 'string' ? arg2 : arg1) as CompoFunc<P>;
  const name = typeof arg1 === 'string' ? arg1 : wrapped.name || '[=>]';

  return class extends PureComponent<P> {
    static displayName = name;

    renderFunc: RenderFunc<P> | null = null;
    effects: { [key: string]: Effect } = {};
    cleaners: { [key: string]: EffectCleaner } = {};

    applyEffects = () => {
      Object.keys(this.effects).forEach((id) => {
        if (this.cleaners[id]) {
          this.cleaners[id]();
          delete this.cleaners[id];
        }
        const cl = this.effects[id]();
        if (typeof cl === 'function') {
          this.cleaners[id] = cl as EffectCleaner;
        }
      });
      this.effects = {};
    };

    componentDidMount() {
      this.applyEffects();
    }

    componentDidUpdate() {
      this.applyEffects();
    }

    componentWillUnmount() {
      Object.keys(this.cleaners).forEach((id) => this.cleaners[id]());
      this.cleaners = {};
    }

    onStateChange = () => this.forceUpdate();
    onEffect = (key: string, effect: Effect) => (this.effects[key] = effect);

    render() {
      // Is it a first render?
      if (!this.renderFunc) {
        const creators: CompoTools = {
          createState: bindStateCreator(this.onStateChange),
          createEffect: bindEffectCreator(this.onEffect),
          use: (customCreator) => customCreator(creators),
        };
        this.renderFunc = wrapped(creators);
      }
      return this.renderFunc(this.props);
    }
  };
}
