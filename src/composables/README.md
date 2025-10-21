# Vue Composables

Reusable composition functions for Vue 3 components following the Composition API best practices.

## What are Composables?

Composables are functions that encapsulate and reuse stateful logic using Vue's Composition API. Think of them as "logic components" that can be shared across multiple Vue components.

## Structure

```
composables/
├── index.ts           # Central export point
├── useCounter.ts      # Counter logic
├── README.md          # This file
└── [future composables...]
```

## Usage

Always import composables from the central export file:

```typescript
// ✅ Good - Import from central location
import { useCounter } from '../composables';

// ❌ Bad - Direct import
import { useCounter } from '../composables/useCounter';
```

## Available Composables

### useCounter

Counter state management with min/max constraints.

```vue
<script setup lang="ts">
import { useCounter } from '../composables';

const { count, increment, decrement, reset, canIncrement, canDecrement } =
  useCounter(0, {
    min: 0,
    max: 100,
    step: 1,
    onChange: (value) => console.log('Changed to:', value),
  });
</script>

<template>
  <div>
    <button @click="decrement" :disabled="!canDecrement">-</button>
    <span>{{ count }}</span>
    <button @click="increment" :disabled="!canIncrement">+</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

**Features:**
- Min/max value constraints
- Custom step values
- Computed bounds checking
- Event callbacks
- Readonly state

### useSimpleCounter

Minimal counter without constraints.

```typescript
const { count, increment, decrement, reset } = useSimpleCounter(0);
```

**Use when:**
- No min/max limits needed
- Simple increment/decrement only
- Minimal bundle size important

## Creating a Composable

### Basic Structure

```typescript
// composables/useFeature.ts
import { ref, computed, readonly } from 'vue';
import type { FeatureOptions, FeatureReturn } from '../types';

export function useFeature(options: FeatureOptions = {}): FeatureReturn {
  // 1. Internal state
  const state = ref(initialState);

  // 2. Computed properties
  const derived = computed(() => transform(state.value));

  // 3. Methods
  function action() {
    state.value = newState;
  }

  // 4. Return public API
  return {
    state: readonly(state),
    derived,
    action,
  };
}
```

### Step-by-Step Guide

#### 1. Create Composable File

```bash
touch src/composables/useYourFeature.ts
```

#### 2. Define Types

```typescript
// src/types/yourFeature.ts
export interface YourFeatureOptions {
  enabled?: boolean;
  onAction?: (data: string) => void;
}

export interface YourFeatureReturn {
  isActive: Ref<boolean>;
  toggle: () => void;
}
```

#### 3. Implement Composable

```typescript
// src/composables/useYourFeature.ts
import { ref, readonly } from 'vue';
import type { YourFeatureOptions, YourFeatureReturn } from '../types';

export function useYourFeature(
  options: YourFeatureOptions = {}
): YourFeatureReturn {
  const { enabled = false, onAction } = options;

  const isActive = ref(enabled);

  function toggle() {
    isActive.value = !isActive.value;
    onAction?.(isActive.value ? 'activated' : 'deactivated');
  }

  return {
    isActive: readonly(isActive),
    toggle,
  };
}
```

#### 4. Export from Index

```typescript
// src/composables/index.ts
export { useYourFeature } from './useYourFeature';
```

#### 5. Write Tests

```typescript
// src/composables/useYourFeature.test.ts
import { describe, it, expect } from 'vitest';
import { useYourFeature } from './useYourFeature';

describe('useYourFeature', () => {
  it('should initialize with default state', () => {
    const { isActive } = useYourFeature();
    expect(isActive.value).toBe(false);
  });

  it('should toggle state', () => {
    const { isActive, toggle } = useYourFeature();
    toggle();
    expect(isActive.value).toBe(true);
  });
});
```

## Best Practices

### 1. Naming Convention

Prefix all composables with `use`.

```typescript
// ✅ Good
useCounter()
useFetch()
useFormValidation()

// ❌ Bad
counter()
fetchData()
validateForm()
```

### 2. Return Readonly State

Prevent external mutations by returning readonly refs.

```typescript
export function useCounter() {
  const count = ref(0);

  return {
    count: readonly(count),  // ✅ Good - readonly
    // count,                 // ❌ Bad - mutable
  };
}
```

### 3. Accept Options Object

Make composables configurable with an options parameter.

```typescript
export function useCounter(
  initialValue: number = 0,
  options: CounterOptions = {}  // ✅ Flexible configuration
) {
  const { min, max, onChange } = options;
  // ...
}
```

### 4. Cleanup Side Effects

Clean up timers, subscriptions, and event listeners.

```typescript
import { onUnmounted } from 'vue';

export function useInterval(callback: () => void, delay: number) {
  const intervalId = setInterval(callback, delay);

  onUnmounted(() => {
    clearInterval(intervalId);  // ✅ Cleanup
  });
}
```

### 5. Type Everything

Provide full TypeScript support.

```typescript
export function useCounter(
  initialValue: number,
  options: CounterOptions
): CounterReturn {  // ✅ Explicit return type
  // ...
}
```

### 6. Document Public API

Use JSDoc comments for clarity.

```typescript
/**
 * Counter composable with min/max constraints
 *
 * @param initialValue - Starting count value
 * @param options - Counter configuration
 * @returns Counter state and methods
 *
 * @example
 * ```ts
 * const { count, increment } = useCounter(0, { max: 10 });
 * ```
 */
export function useCounter(
  initialValue: number,
  options: CounterOptions
): CounterReturn {
  // ...
}
```

## Common Patterns

### State Management

```typescript
export function useState<T>(initial: T) {
  const state = ref(initial);

  function setState(value: T) {
    state.value = value;
  }

  return {
    state: readonly(state),
    setState,
  };
}
```

### Async Data Fetching

```typescript
export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  async function fetch() {
    loading.value = true;
    try {
      const response = await window.fetch(url);
      data.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    fetch,
  };
}
```

### Event Listeners

```typescript
export function useEventListener(
  target: EventTarget,
  event: string,
  handler: EventListener
) {
  target.addEventListener(event, handler);

  onUnmounted(() => {
    target.removeEventListener(event, handler);
  });
}
```

### Local Storage

```typescript
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(
    JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue))
  );

  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  });

  return data;
}
```

### Debounce/Throttle

```typescript
export function useDebounce<T>(value: Ref<T>, delay: number) {
  const debounced = ref(value.value);

  watch(value, (newValue) => {
    const timeout = setTimeout(() => {
      debounced.value = newValue;
    }, delay);

    onUnmounted(() => clearTimeout(timeout));
  });

  return debounced;
}
```

## When to Use Composables

### ✅ Use Composables For:

- **Shared State**: Logic used in multiple components
- **Side Effects**: API calls, timers, subscriptions
- **Computed Logic**: Complex calculations
- **Event Handling**: Window resize, scroll, keyboard
- **Form Validation**: Reusable validation rules
- **Data Fetching**: HTTP requests
- **Local Storage**: Persisted state

### ❌ Don't Use Composables For:

- **One-time Logic**: Used only in one component
- **Simple Getters**: Just return a value
- **Component-specific UI**: Keep in component
- **Pure Functions**: Use regular functions instead

## Testing Composables

```typescript
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment', () => {
    const { count, increment } = useCounter(0);
    increment();
    expect(count.value).toBe(1);
  });

  it('should respect max value', () => {
    const { count, increment } = useCounter(9, { max: 10 });
    increment();
    expect(count.value).toBe(10);
    increment();
    expect(count.value).toBe(10); // Should not exceed max
  });
});
```

## Related Documentation

- [VUE_ARCHITECTURE.md](../md-docs/VUE_ARCHITECTURE.md) - Vue architecture guide
- [../components/README.md](../components/README.md) - Component guide
- [../types/README.md](../types/README.md) - TypeScript types
- [Vue Composables Guide](https://vuejs.org/guide/reusability/composables.html)
