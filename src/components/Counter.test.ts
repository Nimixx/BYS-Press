/**
 * Counter Component Tests
 *
 * Tests for the Counter Vue component
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Counter from './Counter.vue';

describe('Counter.vue', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(Counter);
      expect(wrapper.find('.counter').exists()).toBe(true);
      expect(wrapper.find('.counter__value').text()).toBe('0');
    });

    it('should render with custom label', () => {
      const wrapper = mount(Counter, {
        props: { label: 'Custom Counter' },
      });
      expect(wrapper.find('.counter__title').text()).toBe('Custom Counter');
    });

    it('should not render label when not provided', () => {
      const wrapper = mount(Counter, {
        props: { label: '' },
      });
      expect(wrapper.find('.counter__title').exists()).toBe(false);
    });

    it('should render with initial value', () => {
      const wrapper = mount(Counter, {
        props: { initialValue: 10 },
      });
      expect(wrapper.find('.counter__value').text()).toBe('10');
    });

    it('should show reset button when showReset is true', () => {
      const wrapper = mount(Counter, {
        props: { showReset: true },
      });
      expect(wrapper.find('.counter__button--reset').exists()).toBe(true);
    });

    it('should hide reset button when showReset is false', () => {
      const wrapper = mount(Counter, {
        props: { showReset: false },
      });
      expect(wrapper.find('.counter__button--reset').exists()).toBe(false);
    });
  });

  describe('interactions', () => {
    it('should increment when increment button clicked', async () => {
      const wrapper = mount(Counter);
      const incrementBtn = wrapper.find('.counter__button--increment');

      await incrementBtn.trigger('click');
      expect(wrapper.find('.counter__value').text()).toBe('1');

      await incrementBtn.trigger('click');
      expect(wrapper.find('.counter__value').text()).toBe('2');
    });

    it('should decrement when decrement button clicked', async () => {
      const wrapper = mount(Counter, {
        props: { initialValue: 5 },
      });
      const decrementBtn = wrapper.find('.counter__button--decrement');

      await decrementBtn.trigger('click');
      expect(wrapper.find('.counter__value').text()).toBe('4');
    });

    it('should reset when reset button clicked', async () => {
      const wrapper = mount(Counter, {
        props: { initialValue: 5 },
      });

      await wrapper.find('.counter__button--increment').trigger('click');
      expect(wrapper.find('.counter__value').text()).toBe('6');

      await wrapper.find('.counter__button--reset').trigger('click');
      expect(wrapper.find('.counter__value').text()).toBe('5');
    });
  });

  describe('constraints', () => {
    it('should disable increment button at max value', async () => {
      const wrapper = mount(Counter, {
        props: { initialValue: 9, max: 10 },
      });

      const incrementBtn = wrapper.find('.counter__button--increment');
      expect(incrementBtn.attributes('disabled')).toBeUndefined();

      await incrementBtn.trigger('click');
      expect(incrementBtn.attributes('disabled')).toBeDefined();
    });

    it('should disable decrement button at min value', async () => {
      const wrapper = mount(Counter, {
        props: { initialValue: 1, min: 0 },
      });

      const decrementBtn = wrapper.find('.counter__button--decrement');
      expect(decrementBtn.attributes('disabled')).toBeUndefined();

      await decrementBtn.trigger('click');
      expect(decrementBtn.attributes('disabled')).toBeDefined();
    });

    it('should respect step value', async () => {
      const wrapper = mount(Counter, {
        props: { initialValue: 0, step: 5 },
      });

      await wrapper.find('.counter__button--increment').trigger('click');
      expect(wrapper.find('.counter__value').text()).toBe('5');

      await wrapper.find('.counter__button--increment').trigger('click');
      expect(wrapper.find('.counter__value').text()).toBe('10');
    });
  });

  describe('disabled state', () => {
    it('should disable all buttons when disabled prop is true', () => {
      const wrapper = mount(Counter, {
        props: { disabled: true },
      });

      expect(
        wrapper.find('.counter__button--increment').attributes('disabled')
      ).toBeDefined();
      expect(
        wrapper.find('.counter__button--decrement').attributes('disabled')
      ).toBeDefined();
      expect(
        wrapper.find('.counter__button--reset').attributes('disabled')
      ).toBeDefined();
    });

    it('should not trigger actions when disabled', async () => {
      const wrapper = mount(Counter, {
        props: { disabled: true, initialValue: 5 },
      });

      await wrapper.find('.counter__button--increment').trigger('click');
      expect(wrapper.find('.counter__value').text()).toBe('5'); // Unchanged
    });
  });

  describe('events', () => {
    it('should emit increment event', async () => {
      const wrapper = mount(Counter);
      await wrapper.find('.counter__button--increment').trigger('click');

      expect(wrapper.emitted('increment')).toBeTruthy();
      expect(wrapper.emitted('increment')![0]).toEqual([1]);
    });

    it('should emit decrement event', async () => {
      const wrapper = mount(Counter, {
        props: { initialValue: 5 },
      });
      await wrapper.find('.counter__button--decrement').trigger('click');

      expect(wrapper.emitted('decrement')).toBeTruthy();
      expect(wrapper.emitted('decrement')![0]).toEqual([4]);
    });

    it('should emit reset event', async () => {
      const wrapper = mount(Counter, {
        props: { initialValue: 10 },
      });
      await wrapper.find('.counter__button--reset').trigger('click');

      expect(wrapper.emitted('reset')).toBeTruthy();
      expect(wrapper.emitted('reset')![0]).toEqual([10]);
    });

    it('should emit change event on any value change', async () => {
      const wrapper = mount(Counter);

      await wrapper.find('.counter__button--increment').trigger('click');
      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')![0]).toEqual([1]);
    });

    it('should emit update:modelValue for v-model support', async () => {
      const wrapper = mount(Counter);

      await wrapper.find('.counter__button--increment').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([1]);
    });
  });

  describe('accessibility', () => {
    it('should have aria-label on buttons', () => {
      const wrapper = mount(Counter);

      expect(
        wrapper.find('.counter__button--increment').attributes('aria-label')
      ).toBe('Increment');
      expect(
        wrapper.find('.counter__button--decrement').attributes('aria-label')
      ).toBe('Decrement');
      expect(
        wrapper.find('.counter__button--reset').attributes('aria-label')
      ).toBe('Reset');
    });
  });
});
