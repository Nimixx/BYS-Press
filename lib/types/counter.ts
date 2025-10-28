/**
 * Counter Types
 *
 * Type definitions for counter-related components and composables
 *
 * @module types/counter
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

/**
 * Counter component props
 */
export interface CounterProps {
  /** Initial counter value */
  initialValue?: number;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step value */
  step?: number;
  /** Display label */
  label?: string;
  /** Show reset button */
  showReset?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Counter component emits
 */
export interface CounterEmits {
  (e: 'update:modelValue', value: number): void;
  (e: 'increment', value: number): void;
  (e: 'decrement', value: number): void;
  (e: 'reset', value: number): void;
  (e: 'change', value: number): void;
}
