import React from 'react';
import { shallow, mount } from 'enzyme';

import { compo } from '.';
import { state } from './state';
import { effector } from './effect';

function delay(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

describe('react-compo', () => {
  it('should render a component created by compo', () => {
    const Test = compo<{ name: string }>(() => ({ name }) => <>Hi, {name}!</>);
    const wrapper = shallow(<Test name={'Alice'} />);
    expect(wrapper.text()).toBe('Hi, Alice!');
  });

  it('should set displayName on named function', () => {
    const Test = compo(function Test() {
      return () => null;
    });
    expect(Test.displayName).toBe('Test');
  });

  it('should set displayName on anonymous function', () => {
    const Test = compo(() => () => null);
    expect(Test.displayName).toBe('[=>]');
  });

  it('should explicitly set displayName', () => {
    const Test = compo('TestName', () => () => null);
    expect(Test.displayName).toBe('TestName');
  });

  describe('state', () => {
    it('should get state value', () => {
      const Test = compo((use) => {
        const [getNum] = use(state(42));
        return () => <>{getNum()}</>;
      });
      const wrapper = shallow(<Test />);
      expect(wrapper.text()).toBe('42');
    });

    it('should set state value', () => {
      let setValue = (_: number) => {};
      let renderFunc = jest.fn();

      const Test = compo((use) => {
        const [getNum, setNum] = use(state(42));
        setValue = (v: number) => setNum(v);
        renderFunc = jest.fn(() => <>{getNum()}</>);
        return renderFunc;
      });

      const wrapper = mount(<Test />);
      expect(wrapper.text()).toBe('42');
      renderFunc.mockClear();

      setValue(43);
      expect(renderFunc).toHaveBeenCalled();
      expect(wrapper.text()).toBe('43');
    });

    it('should not re-render on same value', () => {
      let setValue = (_: number) => {};
      let renderFunc = jest.fn();

      const Test = compo((use) => {
        const [getNum, setNum] = use(state(42));
        setValue = (v: number) => setNum(v);
        renderFunc = jest.fn(() => <>{getNum()}</>);
        return renderFunc;
      });

      const wrapper = mount(<Test />);
      expect(wrapper.text()).toBe('42');
      renderFunc.mockClear();

      setValue(42);
      expect(renderFunc).not.toHaveBeenCalled();
      expect(wrapper.text()).toBe('42');
    });
  });

  describe('effects', () => {
    it('should call effect function', (done) => {
      const Test = compo((use) => {
        const myEffect = use(effector());
        return () => {
          myEffect(done);
          return null;
        };
      });

      mount(<Test />);
    });

    it('should call cleaner on unmount', (done) => {
      const Test = compo((use) => {
        const myEffect = use(effector());
        return () => {
          myEffect(() => done);
          return null;
        };
      });

      const wrapper = mount(<Test />);
      wrapper.unmount();
    });

    it('should call effect with condition', async () => {
      const wasRendered = jest.fn();
      const effect = jest.fn();

      const Test = compo((use) => {
        const myEffect = use(effector());
        return ({ x, y }) => {
          wasRendered(x, y);
          myEffect(effect, [x]);
          return null;
        };
      });

      const wrapper = mount(<Test x={1} y={1} />);
      expect(wasRendered).toHaveBeenCalledWith(1, 1);
      await delay(20);
      expect(effect).toHaveBeenCalled();
      wasRendered.mockClear();
      effect.mockClear();

      wrapper.setProps({ x: 1, y: 2 });
      expect(wasRendered).toHaveBeenCalledWith(1, 2);
      await delay(20);
      expect(effect).not.toHaveBeenCalled();
      wasRendered.mockClear();
      effect.mockClear();

      wrapper.setProps({ x: 2, y: 2 });
      expect(wasRendered).toHaveBeenCalledWith(2, 2);
      await delay(20);
      expect(effect).toHaveBeenCalled();
      wasRendered.mockClear();
      effect.mockClear();
    });

    it('should call cleaner on unmount (effect with [] deps)', async () => {
      const wasRendered = jest.fn();
      const cleaner = jest.fn();
      const effect = jest.fn(() => cleaner);

      const Test = compo((use) => {
        const myEffect = use(effector());
        return ({ x, y }: { x: number; y: number }) => {
          wasRendered(x, y);
          myEffect(effect, []);
          return null;
        };
      });

      const wrapper = mount(<Test x={1} y={1} />);
      expect(wasRendered).toHaveBeenCalledWith(1, 1);
      // await delay(20);
      expect(cleaner).not.toHaveBeenCalled();
      expect(effect).toHaveBeenCalled();
      wasRendered.mockClear();
      effect.mockClear();

      wrapper.setProps({ x: 1, y: 2 });
      expect(wasRendered).toHaveBeenCalledWith(1, 2);
      // await delay(20);
      expect(cleaner).not.toHaveBeenCalled();
      expect(effect).not.toHaveBeenCalled();
      wasRendered.mockClear();
      effect.mockClear();

      wrapper.setProps({ x: 2, y: 2 });
      expect(wasRendered).toHaveBeenCalledWith(2, 2);
      // await delay(20);
      expect(cleaner).not.toHaveBeenCalled();
      expect(effect).not.toHaveBeenCalled();
      wasRendered.mockClear();
      effect.mockClear();

      wrapper.unmount();
      expect(wasRendered).not.toHaveBeenCalled();
      await delay(20);
      expect(effect).not.toHaveBeenCalled();
      expect(cleaner).toHaveBeenCalled();
      wasRendered.mockClear();
      effect.mockClear();
    });
  });
});
