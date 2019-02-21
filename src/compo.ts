import { ComponentType, ReactNode, PureComponent } from 'react';
import { Events, SimpleEvents } from './events';

export const DID_UPDATE = 'DID_UPDATE';
export const WILL_UNMOUNT = 'WILL_UNMOUNT';
export const DO_UPDATE = 'UPDATE';

export type CompoFunc<P> = (use: Use) => RenderFunc<P>;
export type RenderFunc<P> = (props: P) => ReactNode;

export function compo<P>(func: CompoFunc<P>, _?: never): ComponentType<P>;
export function compo<P>(name: string, func: CompoFunc<P>): ComponentType<P>;
export function compo<P>(arg1: any, arg2: any): ComponentType<P> {
  const func = (typeof arg1 === 'string' ? arg2 : arg1) as CompoFunc<P>;
  const name = typeof arg1 === 'string' ? arg1 : func.name || '[=>]';

  return class extends PureComponent<P> {
    static displayName = name;
    renderFunc: RenderFunc<P> | null = null;
    events = new SimpleEvents();

    componentDidMount() {
      this.events.on(DO_UPDATE, this.forceUpdate.bind(this));
      this.events.emit(DID_UPDATE);
    }

    componentDidUpdate() {
      this.events.emit(DID_UPDATE);
    }

    componentWillUnmount() {
      this.events.emit(WILL_UNMOUNT);
      this.events.removeAllListeners();
    }

    render() {
      if (!this.renderFunc) {
        this.renderFunc = func(useWith(this.events));
      }
      return this.renderFunc(this.props);
    }
  };
}

export type Use = <T>(hc: HookCreator<T>) => T;
export type HookCreator<T> = (u: Use) => T;

export const compoEvents: HookCreator<Events> = () => {
  throw new Error('Incorrect usage');
};

export const useWith = (e: Events) => {
  const use: Use = (hc: any) => {
    if (hc === compoEvents) {
      return e;
    }
    return hc(use);
  };
  return use;
};
