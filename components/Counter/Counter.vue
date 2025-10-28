<template>
  <div class="counter">
    <div class="counter__value">{{ count }}</div>
    <div class="counter__controls">
      <button class="counter__button counter__button--decrement" @click="decrement()">−</button>
      <button class="counter__button counter__button--increment" @click="increment()">+</button>
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
  gap: var(--space-4);
}

.counter__value {
  font-size: var(--text-4xl);
  font-weight: var(--font-light);
  color: var(--color-text);
  min-width: 3rem;
  text-align: center;
}

.counter__controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.counter__button {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  font-family: inherit;
  line-height: 1;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.counter__button:hover {
  color: var(--color-text);
  background: var(--color-surface);
}

.counter__button:active {
  transform: scale(0.9);
}

.counter__button:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
</style>
