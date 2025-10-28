/**
 * Counter Composable
 *
 * Reusable counter logic that can be used across multiple components.
 * Follows Vue 3 Composition API best practices.
 *
 * @module composables/useCounter
 */

import { ref, computed, readonly } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { CounterOptions, CounterReturn } from './useCounter.types';

/**
 * Counter composable with full state management
 *
 * @param initialValue - Starting count value (default: 0)
 * @param options - Counter configuration options
 * @returns Counter state and methods
 *
 * @example
 * ```ts
 * const { count, increment, decrement, reset } = useCounter(0, {
 *   min: 0,
 *   max: 100,
 *   step: 1
 * });
 * ```
 */
export function useCounter(
  initialValue: number = 0,
  options: CounterOptions = {}
): CounterReturn {
  const {
    min = -Infinity,
    max = Infinity,
    step = 1,
    onIncrement,
    onDecrement,
    onReset,
    onChange,
  } = options;

  // Internal state
  const count = ref<number>(initialValue);
  const initialCount = ref<number>(initialValue);

  // Computed properties
  const isAtMin = computed(() => count.value <= min);
  const isAtMax = computed(() => count.value >= max);
  const canIncrement = computed(() => !isAtMax.value);
  const canDecrement = computed(() => !isAtMin.value);

  /**
   * Increment the counter
   * @param customStep - Optional custom step value
   */
  function increment(customStep?: number): void {
    const stepValue = customStep ?? step;
    const newValue = Math.min(count.value + stepValue, max);

    if (newValue !== count.value) {
      count.value = newValue;
      onIncrement?.(count.value);
      onChange?.(count.value);
    }
  }

  /**
   * Decrement the counter
   * @param customStep - Optional custom step value
   */
  function decrement(customStep?: number): void {
    const stepValue = customStep ?? step;
    const newValue = Math.max(count.value - stepValue, min);

    if (newValue !== count.value) {
      count.value = newValue;
      onDecrement?.(count.value);
      onChange?.(count.value);
    }
  }

  /**
   * Reset counter to initial value
   * @param value - Optional new initial value
   */
  function reset(value?: number): void {
    const resetValue = value ?? initialCount.value;
    count.value = resetValue;
    onReset?.(count.value);
    onChange?.(count.value);
  }

  /**
   * Set counter to specific value
   * @param value - New counter value
   */
  function setValue(value: number): void {
    const clampedValue = Math.max(min, Math.min(max, value));
    count.value = clampedValue;
    onChange?.(count.value);
  }

  return {
    // State (readonly to prevent external mutations)
    count: readonly(count) as Ref<number>,
    isAtMin: readonly(isAtMin) as ComputedRef<boolean>,
    isAtMax: readonly(isAtMax) as ComputedRef<boolean>,
    canIncrement: readonly(canIncrement) as ComputedRef<boolean>,
    canDecrement: readonly(canDecrement) as ComputedRef<boolean>,

    // Methods
    increment,
    decrement,
    reset,
    setValue,
  };
}

/**
 * Simple counter composable (minimal version)
 *
 * Use this for basic counter needs without min/max constraints
 *
 * @param initialValue - Starting count value
 * @returns Basic counter state and methods
 */
export function useSimpleCounter(initialValue: number = 0) {
  const count = ref(initialValue);

  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => count.value = initialValue;

  return {
    count: readonly(count),
    increment,
    decrement,
    reset,
  };
}
