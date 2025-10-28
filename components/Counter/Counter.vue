<template>
  <div class="counter">
    <div class="counter__header">
      <h3 class="counter__title">{{ title }}</h3>
      <span class="counter__range">{{ min }} - {{ max }}</span>
    </div>

    <div class="counter__display">
      <span class="counter__value">{{ count }}</span>
      <div class="counter__progress">
        <div
          class="counter__progress-bar"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <div class="counter__controls">
      <button
        class="counter__button"
        :disabled="!canDecrement"
        @click="decrement()"
      >
        - {{ step }}
      </button>
      <button class="counter__button" @click="reset()">
        Reset
      </button>
      <button
        class="counter__button"
        :disabled="!canIncrement"
        @click="increment()"
      >
        + {{ step }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Counter Component
 *
 * Interactive counter with progress visualization and configurable min/max/step.
 * Uses the useCounter composable for state management.
 *
 * @component Counter
 */
import { computed } from 'vue';
import { useCounter } from '../../composables/useCounter';
import type { CounterProps } from './Counter.types';

const props = withDefaults(defineProps<CounterProps>(), {
  title: 'Counter',
  initialValue: 0,
  min: 0,
  max: 100,
  step: 5,
});

const { count, canIncrement, canDecrement, increment, decrement, reset } =
  useCounter(props.initialValue, {
    min: props.min,
    max: props.max,
    step: props.step,
  });

const progressPercentage = computed(() => {
  const range = props.max - props.min;
  const current = count.value - props.min;
  return (current / range) * 100;
});
</script>

<style scoped>
.counter {
  padding: 2rem;
  border: 1px solid rgba(39, 39, 39, 0.608);
  border-radius: 8px;
}

.counter__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.counter__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 500;
}

.counter__range {
  font-size: 0.875rem;
  opacity: 0.6;
}

.counter__display {
  margin-bottom: 1.5rem;
}

.counter__value {
  display: block;
  font-size: 3rem;
  font-weight: 300;
  text-align: center;
  margin-bottom: 1rem;
}

.counter__progress {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.counter__progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.counter__controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.counter__button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
}

.counter__button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.counter__button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
