import React from 'react';
import { shallow, mount } from 'enzyme';

import { compo } from './compo';
import { newState } from './state';
import { newReaction } from './reaction';

describe('react-compo', () => {
  it('should render a component created by compo', () => {
    const Test = compo<{ name: string }>(() => ({ name }) => <>Hi, {name}!</>);
    const wrapper = shallow(<Test name={'Alice'} />);
    expect(wrapper.text()).toBe('Hi, Alice!');
  });

  describe('displayName', () => {
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
  });

  describe('state', () => {
    it('should get state value', () => {
      const Test = compo(() => {
        const [getNum] = newState(42);
        return () => <>{getNum()}</>;
      });
      const wrapper = shallow(<Test />);
      expect(wrapper.text()).toBe('42');
    });

    it('should set state value', () => {
      let setValue = (_: number) => {};
      let renderFunc = jest.fn();

      const Test = compo(() => {
        const [getNum, setNum] = newState(42);
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

      const Test = compo(() => {
        const [getNum, setNum] = newState(42);
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

  describe('reaction', () => {
    it('should call reaction function', () => {
      const reaction = jest.fn();

      const Test = compo(() => {
        newReaction(reaction)();
        return () => null;
      });

      mount(<Test />);
      expect(reaction).toHaveBeenCalled();
    });

    it('should call cleaner on unmount', () => {
      const cleaner = jest.fn();

      const Test = compo(() => {
        newReaction(() => cleaner)();
        return () => null;
      });

      const wrapper = mount(<Test />);
      expect(cleaner).not.toHaveBeenCalled();
      wrapper.unmount();
      expect(cleaner).toHaveBeenCalled();
    });

    it('should call reaction with condition', () => {
      const wasRendered = jest.fn();
      const reaction = jest.fn();

      const Test = compo(() => {
        const myReaction = newReaction(reaction);
        return ({ x, y }) => {
          wasRendered(x, y);
          myReaction(x);
          return null;
        };
      });

      const wrapper = mount(<Test x={1} y={1} />);
      expect(wasRendered).toHaveBeenCalledWith(1, 1);
      expect(reaction).toHaveBeenCalledWith(1);
      wasRendered.mockClear();
      reaction.mockClear();

      wrapper.setProps({ x: 1, y: 2 });
      expect(wasRendered).toHaveBeenCalledWith(1, 2);
      expect(reaction).not.toHaveBeenCalled();
      wasRendered.mockClear();
      reaction.mockClear();

      wrapper.setProps({ x: 2, y: 2 });
      expect(wasRendered).toHaveBeenCalledWith(2, 2);
      expect(reaction).toHaveBeenCalledWith(2);
      wasRendered.mockClear();
      reaction.mockClear();
    });

    it('should call reaction without arguments after every rendering', () => {
      const reaction = jest.fn();

      const Test = compo(() => {
        const myReaction = newReaction(reaction);
        // @ts-ignore: We don't actually use this property
        return ({ x }) => {
          myReaction();
          return null;
        };
      });

      const wrapper = mount(<Test x={1} />);
      expect(reaction).toHaveBeenCalledWith();
      reaction.mockClear();

      wrapper.setProps({ x: 2 });
      expect(reaction).toHaveBeenCalled();
      reaction.mockClear();
    });
  });
});
