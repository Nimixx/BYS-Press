<template>
  <div class="counter">
    <h2 v-if="label" class="counter__title">{{ label }}</h2>
    <div class="counter__display">
      <span class="counter__value">{{ count }}</span>
    </div>
    <div class="counter__buttons">
      <button
        class="counter__button counter__button--decrement"
        :disabled="disabled || !canDecrement"
        :aria-label="t('decrement')"
        @click="handleDecrement"
      >
        -
      </button>
      <button
        v-if="showReset"
        class="counter__button counter__button--reset"
        :disabled="disabled"
        :aria-label="t('reset')"
        @click="handleReset"
      >
        {{ t('reset') }}
      </button>
      <button
        class="counter__button counter__button--increment"
        :disabled="disabled || !canIncrement"
        :aria-label="t('increment')"
        @click="handleIncrement"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Counter Component
 *
 * Interactive counter with customizable min/max values and step.
 * Uses the useCounter composable for state management.
 *
 * @example
 * ```vue
 * <Counter
 *   :initialValue="10"
 *   :min="0"
 *   :max="100"
 *   :step="5"
 *   label="Product Quantity"
 *   showReset
 * />
 * ```
 */
import { useCounter } from '../composables/useCounter';
import type { CounterProps, CounterEmits } from '../types/counter';

// Props with defaults
const props = withDefaults(defineProps<CounterProps>(), {
  initialValue: 0,
  min: -Infinity,
  max: Infinity,
  step: 1,
  label: 'Interactive Counter',
  showReset: true,
  disabled: false,
});

// Emits
const emit = defineEmits<CounterEmits>();

// Use counter composable with all features
const {
  count,
  canIncrement,
  canDecrement,
  increment,
  decrement,
  reset,
} = useCounter(props.initialValue, {
  min: props.min,
  max: props.max,
  step: props.step,
  onIncrement: (value) => emit('increment', value),
  onDecrement: (value) => emit('decrement', value),
  onReset: (value) => emit('reset', value),
  onChange: (value) => {
    emit('update:modelValue', value);
    emit('change', value);
  },
});

// Event handlers
function handleIncrement() {
  if (!props.disabled) {
    increment();
  }
}

function handleDecrement() {
  if (!props.disabled) {
    decrement();
  }
}

function handleReset() {
  if (!props.disabled) {
    reset();
  }
}

// Simple i18n helper (can be replaced with actual i18n library)
function t(key: string): string {
  const translations: Record<string, string> = {
    increment: 'Increment',
    decrement: 'Decrement',
    reset: 'Reset',
  };
  return translations[key] || key;
}
</script>

<style scoped>
.counter {
  margin: 3rem auto;
  padding: 0;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.counter__title {
  margin: 0 0 2rem 0;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.counter__display {
  text-align: center;
  margin-bottom: 2rem;
}

.counter__value {
  font-size: 4rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.95);
  display: inline-block;
  min-width: 80px;
  font-variant-numeric: tabular-nums;
}

.counter__buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.counter__button {
  padding: 0.5rem 1.25rem;
  font-size: 1.125rem;
  font-weight: 400;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.counter__button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.counter__button:active {
  transform: translateY(0);
}

.counter__button--reset {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  opacity: 0.7;
}

.counter__button--reset:hover {
  opacity: 1;
}
</style>
