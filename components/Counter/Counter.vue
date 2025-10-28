<template>
  <div class="counter">
    <div class="counter__value">{{ count }}</div>
    <div class="counter__controls">
      <button
        class="counter__button counter__button--decrement"
        @click="decrement()"
      >
        −
      </button>
      <button
        class="counter__button counter__button--increment"
        @click="increment()"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Counter Component - Minimal Design
 *
 * Simple counter with increment/decrement controls.
 *
 * @component Counter
 */
import { ref } from 'vue';
import type { CounterProps } from './Counter.types';

const props = withDefaults(defineProps<CounterProps>(), {
  initialValue: 0,
});

const count = ref(props.initialValue);

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};
</script>

<style scoped>
.counter {
  display: inline-flex;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.counter__value {
  font-size: var(--text-5xl);
  font-weight: var(--font-light);
  color: var(--color-text);
  min-width: 4rem;
  text-align: center;
}

.counter__controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.counter__button {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  font-size: var(--text-xl);
  font-weight: var(--font-light);
  font-family: inherit;
  line-height: 1;
  color: var(--color-text);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.counter__button:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-border-hover);
}

.counter__button:active {
  transform: scale(0.95);
}

.counter__button:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
</style>
