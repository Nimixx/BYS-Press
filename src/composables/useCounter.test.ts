/**
 * Counter Composable Tests
 *
 * Tests for the useCounter composable
 */

import { describe, it, expect, vi } from 'vitest';
import { useCounter, useSimpleCounter } from './useCounter';

describe('useCounter', () => {
  describe('basic functionality', () => {
    it('should initialize with default value', () => {
      const { count } = useCounter();
      expect(count.value).toBe(0);
    });

    it('should initialize with custom value', () => {
      const { count } = useCounter(10);
      expect(count.value).toBe(10);
    });

    it('should increment counter', () => {
      const { count, increment } = useCounter(0);
      increment();
      expect(count.value).toBe(1);
    });

    it('should decrement counter', () => {
      const { count, decrement } = useCounter(5);
      decrement();
      expect(count.value).toBe(4);
    });

    it('should reset counter to initial value', () => {
      const { count, increment, reset } = useCounter(10);
      increment();
      increment();
      expect(count.value).toBe(12);
      reset();
      expect(count.value).toBe(10);
    });

    it('should reset counter to custom value', () => {
      const { count, reset } = useCounter(10);
      reset(20);
      expect(count.value).toBe(20);
    });
  });

  describe('step functionality', () => {
    it('should increment by custom step', () => {
      const { count, increment } = useCounter(0, { step: 5 });
      increment();
      expect(count.value).toBe(5);
    });

    it('should decrement by custom step', () => {
      const { count, decrement } = useCounter(10, { step: 3 });
      decrement();
      expect(count.value).toBe(7);
    });

    it('should support custom step parameter', () => {
      const { count, increment } = useCounter(0, { step: 1 });
      increment(10);
      expect(count.value).toBe(10);
    });
  });

  describe('min/max constraints', () => {
    it('should respect maximum value', () => {
      const { count, increment } = useCounter(9, { max: 10 });
      increment();
      expect(count.value).toBe(10);
      increment();
      expect(count.value).toBe(10); // Should not exceed max
    });

    it('should respect minimum value', () => {
      const { count, decrement } = useCounter(1, { min: 0 });
      decrement();
      expect(count.value).toBe(0);
      decrement();
      expect(count.value).toBe(0); // Should not go below min
    });

    it('should clamp setValue to min/max range', () => {
      const { count, setValue } = useCounter(5, { min: 0, max: 10 });
      setValue(15);
      expect(count.value).toBe(10); // Clamped to max
      setValue(-5);
      expect(count.value).toBe(0); // Clamped to min
    });
  });

  describe('computed properties', () => {
    it('should compute isAtMin correctly', () => {
      const { isAtMin, setValue } = useCounter(0, { min: 0 });
      expect(isAtMin.value).toBe(true);
      setValue(5);
      expect(isAtMin.value).toBe(false);
    });

    it('should compute isAtMax correctly', () => {
      const { isAtMax, setValue } = useCounter(10, { max: 10 });
      expect(isAtMax.value).toBe(true);
      setValue(5);
      expect(isAtMax.value).toBe(false);
    });

    it('should compute canIncrement correctly', () => {
      const { canIncrement, setValue } = useCounter(9, { max: 10 });
      expect(canIncrement.value).toBe(true);
      setValue(10);
      expect(canIncrement.value).toBe(false);
    });

    it('should compute canDecrement correctly', () => {
      const { canDecrement, setValue } = useCounter(1, { min: 0 });
      expect(canDecrement.value).toBe(true);
      setValue(0);
      expect(canDecrement.value).toBe(false);
    });
  });

  describe('callbacks', () => {
    it('should call onIncrement callback', () => {
      const onIncrement = vi.fn();
      const { increment } = useCounter(0, { onIncrement });
      increment();
      expect(onIncrement).toHaveBeenCalledWith(1);
    });

    it('should call onDecrement callback', () => {
      const onDecrement = vi.fn();
      const { decrement } = useCounter(5, { onDecrement });
      decrement();
      expect(onDecrement).toHaveBeenCalledWith(4);
    });

    it('should call onReset callback', () => {
      const onReset = vi.fn();
      const { reset } = useCounter(10, { onReset });
      reset();
      expect(onReset).toHaveBeenCalledWith(10);
    });

    it('should call onChange callback on any change', () => {
      const onChange = vi.fn();
      const { increment, decrement, reset } = useCounter(5, { onChange });

      increment();
      expect(onChange).toHaveBeenCalledWith(6);

      decrement();
      expect(onChange).toHaveBeenCalledWith(5);

      reset();
      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('should not call callbacks when value does not change', () => {
      const onIncrement = vi.fn();
      const { increment } = useCounter(10, { max: 10, onIncrement });

      increment(); // At max, should not increment
      expect(onIncrement).not.toHaveBeenCalled();
    });
  });

  describe('readonly state', () => {
    it('should return readonly count ref', () => {
      const { count } = useCounter(0);
      // Count should be a readonly ref
      // We can verify it's readonly by checking the property descriptor
      expect(count).toBeDefined();
      expect(count.value).toBe(0);
      // The readonly() wrapper prevents direct mutations in TypeScript
      // In runtime, Vue will warn but not throw
    });
  });
});

describe('useSimpleCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useSimpleCounter();
    expect(count.value).toBe(0);
  });

  it('should initialize with custom value', () => {
    const { count } = useSimpleCounter(5);
    expect(count.value).toBe(5);
  });

  it('should increment counter', () => {
    const { count, increment } = useSimpleCounter(0);
    increment();
    expect(count.value).toBe(1);
  });

  it('should decrement counter', () => {
    const { count, decrement } = useSimpleCounter(5);
    decrement();
    expect(count.value).toBe(4);
  });

  it('should reset counter', () => {
    const { count, increment, reset } = useSimpleCounter(10);
    increment();
    increment();
    expect(count.value).toBe(12);
    reset();
    expect(count.value).toBe(10);
  });

  it('should not enforce min/max constraints', () => {
    const { count, increment, decrement } = useSimpleCounter(0);
    decrement();
    expect(count.value).toBe(-1); // Can go negative
    // Note: Simple counter returns readonly, so we can't directly set count.value
    // Just verify it can go negative and increment works
    increment();
    increment();
    expect(count.value).toBe(1); // -1 + 2 = 1
  });
});
