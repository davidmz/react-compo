import { ComponentType, ReactNode, PureComponent } from 'react';
import { EventEmitter } from 'events';

import { currentComponent } from './current-component';

export const DID_UPDATE = 'DID_UPDATE';
export const WILL_UNMOUNT = 'WILL_UNMOUNT';
export const UPDATE = 'UPDATE';

export type RenderFunc<P> = (props: P) => ReactNode;
export type Fabric<P> = () => RenderFunc<P>;

export function compo<P>(fabric: Fabric<P>, _?: never): ComponentType<P>;
export function compo<P>(name: string, fabric: Fabric<P>): ComponentType<P>;
export function compo<P>(arg1: any, arg2: any): ComponentType<P> {
  const fabric = (typeof arg1 === 'string' ? arg2 : arg1) as Fabric<P>;
  const name = typeof arg1 === 'string' ? arg1 : fabric.name || '[=>]';

  return class extends PureComponent<P> {
    static displayName = name;
    renderFunc: RenderFunc<P> | null = null;
    events = new EventEmitter();

    constructor(props: P) {
      super(props);
      this.events.on(UPDATE, this.forceUpdate.bind(this));
    }

    componentDidMount() {
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
          currentComponent(this.events);
          this.renderFunc = fabric();
        } finally {
          currentComponent(null);
        }
      }
      return this.renderFunc(this.props);
    }
  };
}
