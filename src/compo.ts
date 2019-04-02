import { ReactNode, PureComponent, ComponentType } from 'react';
import EventEmitter from 'events';

export type CompoFunc<P> = () => (props: P) => ReactNode;

export const DID_UPDATE = 'DID_UPDATE';
export const WILL_UNMOUNT = 'WILL_UNMOUNT';
export const DO_UPDATE = 'UPDATE';

let currentComponent: EventEmitter | null = null;

export function compo<P>(func: CompoFunc<P>, _?: never): ComponentType<P>;
export function compo<P>(name: string, func: CompoFunc<P>): ComponentType<P>;
export function compo<P>(arg1: any, arg2: any): ComponentType<P> {
  const func = (typeof arg1 === 'string' ? arg2 : arg1) as CompoFunc<P>;
  const name = typeof arg1 === 'string' ? arg1 : func.name || '[=>]';

  return class extends PureComponent<P> {
    static displayName = name;
    renderFunc: ((props: P) => ReactNode) | null = null;
    events = new EventEmitter();

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
        try {
          currentComponent = this.events;
          this.renderFunc = func();
        } finally {
          currentComponent = null;
        }
      }
      return this.renderFunc!(this.props);
    }
  };
}

export const withCurrentComponent = (
  name: string,
  maker: (events: EventEmitter) => (...args: any[]) => any
) => (...args: any[]): any => {
  if (!currentComponent) {
    throw new Error(
      `You can only use '${name}' on initialization phase of your 'compo' component, i.e. before the render function returning`
    );
  }
  return maker(currentComponent)(...args);
};
