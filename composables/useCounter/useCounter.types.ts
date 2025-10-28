/**
 * Counter Composable Types
 *
 * Type definitions for the useCounter composable.
 *
 * @module composables/useCounter
 */

import type { Ref, ComputedRef } from 'vue';

/**
 * Counter configuration options
 */
export interface CounterOptions {
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step value for increment/decrement */
  step?: number;
  /** Callback when counter is incremented */
  onIncrement?: (value: number) => void;
  /** Callback when counter is decremented */
  onDecrement?: (value: number) => void;
  /** Callback when counter is reset */
  onReset?: (value: number) => void;
  /** Callback on any value change */
  onChange?: (value: number) => void;
}

/**
 * Counter composable return type
 */
export interface CounterReturn {
  /** Current count value */
  count: Ref<number>;
  /** Whether counter is at minimum value */
  isAtMin: ComputedRef<boolean>;
  /** Whether counter is at maximum value */
  isAtMax: ComputedRef<boolean>;
  /** Whether counter can be incremented */
  canIncrement: ComputedRef<boolean>;
  /** Whether counter can be decremented */
  canDecrement: ComputedRef<boolean>;
  /** Increment the counter */
  increment: (customStep?: number) => void;
  /** Decrement the counter */
  decrement: (customStep?: number) => void;
  /** Reset counter to initial value */
  reset: (value?: number) => void;
  /** Set counter to specific value */
  setValue: (value: number) => void;
}
