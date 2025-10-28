# TypeScript Types

Centralized type definitions for the Core Theme Vue application.

## Structure

```
types/
├── index.ts          # Central export point
├── components.ts     # Component system types
├── counter.ts        # Counter-related types
└── README.md         # This file
```

## Usage

Always import types from the central `index.ts` file:

```typescript
// ✅ Good - Import from central location
import type { CounterProps, ComponentConfig } from '../types';

// ❌ Bad - Direct import
import type { CounterProps } from '../types/counter';
```

## Type Categories

### Component Props

Define the interface for component props.

```typescript
export interface ComponentProps {
  title: string;
  count?: number;
  disabled?: boolean;
}
```

**Usage in components:**

```vue
<script setup lang="ts">
import type { ComponentProps } from '../types';

const props = withDefaults(defineProps<ComponentProps>(), {
  count: 0,
  disabled: false,
});
</script>
```

### Component Emits

Define event signatures for component emissions.

```typescript
export interface ComponentEmits {
  (e: 'update:modelValue', value: number): void;
  (e: 'change', value: number): void;
}
```

**Usage in components:**

```vue
<script setup lang="ts">
import type { ComponentEmits } from '../types';

const emit = defineEmits<ComponentEmits>();

function handleChange(value: number) {
  emit('update:modelValue', value);
  emit('change', value);
}
</script>
```

### Composable Options

Define configuration options for composables.

```typescript
export interface ComposableOptions {
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}
```

**Usage in composables:**

```typescript
import type { ComposableOptions } from '../types';

export function useComposable(options: ComposableOptions = {}) {
  const { min = 0, max = 100 } = options;
  // ...
}
```

### Composable Returns

Define the return type of composables.

```typescript
export interface ComposableReturn {
  value: Ref<number>;
  increment: () => void;
  decrement: () => void;
}
```

**Usage in composables:**

```typescript
import type { ComposableReturn } from '../types';

export function useComposable(): ComposableReturn {
  const value = ref(0);

  return {
    value,
    increment: () => value.value++,
    decrement: () => value.value--,
  };
}
```

## Best Practices

### 1. Use Interfaces for Objects

Prefer `interface` over `type` for object shapes.

```typescript
// ✅ Good
export interface UserProps {
  name: string;
  age: number;
}

// ❌ Avoid (for objects)
export type UserProps = {
  name: string;
  age: number;
}
```

### 2. Optional vs Required

Make optional what can reasonably have a default.

```typescript
export interface ButtonProps {
  label: string;          // Required
  variant?: 'primary' | 'secondary';  // Optional
  disabled?: boolean;     // Optional
}
```

### 3. Document Complex Types

Add JSDoc comments for clarity.

```typescript
/**
 * Configuration options for the counter composable
 */
export interface CounterOptions {
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Callback fired when value changes */
  onChange?: (value: number) => void;
}
```

### 4. Use Literal Types for Variants

Define specific allowed values.

```typescript
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}
```

### 5. Generic Types for Reusability

Create generic types for flexible components.

```typescript
export interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
}
```

## Adding New Types

### 1. Create Type File

```bash
touch src/types/yourFeature.ts
```

### 2. Define Types

```typescript
// src/types/yourFeature.ts

/**
 * Your Feature Props
 */
export interface YourFeatureProps {
  title: string;
  enabled?: boolean;
}

/**
 * Your Feature Emits
 */
export interface YourFeatureEmits {
  (e: 'action', data: string): void;
}

/**
 * Your Feature Options
 */
export interface YourFeatureOptions {
  timeout?: number;
  onComplete?: () => void;
}
```

### 3. Export from Index

```typescript
// src/types/index.ts
export type {
  YourFeatureProps,
  YourFeatureEmits,
  YourFeatureOptions,
} from './yourFeature';
```

### 4. Use in Components/Composables

```typescript
import type { YourFeatureProps } from '../types';

const props = defineProps<YourFeatureProps>();
```

## Common Patterns

### v-model Support

```typescript
export interface InputProps {
  modelValue: string;
}

export interface InputEmits {
  (e: 'update:modelValue', value: string): void;
}
```

### Callback Props

```typescript
export interface FormProps {
  onSubmit?: (data: FormData) => void | Promise<void>;
  onError?: (error: Error) => void;
}
```

### Conditional Types

```typescript
export interface ComponentProps<T extends 'single' | 'multiple'> {
  mode: T;
  value: T extends 'single' ? string : string[];
}
```

### Readonly Props

```typescript
export interface DataProps {
  readonly items: readonly Item[];
}
```

## Type Utilities

### Vue Built-in Types

```typescript
import type { Ref, ComputedRef, PropType } from 'vue';

// Ref type
const count: Ref<number> = ref(0);

// Computed type
const double: ComputedRef<number> = computed(() => count.value * 2);

// Complex prop type
defineProps({
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },
});
```

### Custom Type Guards

```typescript
export function isCounterProps(props: unknown): props is CounterProps {
  return (
    typeof props === 'object' &&
    props !== null &&
    'initialValue' in props
  );
}
```

## Related Documentation

- [VUE_ARCHITECTURE.md](../md-docs/VUE_ARCHITECTURE.md) - Vue architecture
- [../components/README.md](../components/README.md) - Component guide
- [../composables/README.md](../composables/README.md) - Composables guide
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
