# Vue Component Architecture

## Overview

Vue components in this theme use an **auto-discovery system** that matches the Twig component pattern. No manual configuration is required - just create a component and use it.

## Component Structure

### File Organization

Components follow a co-located pattern with all related files in one directory:

```
components/
└── Counter/
    ├── Counter.vue        # Component (template + script + styles)
    ├── Counter.types.ts   # TypeScript types (optional)
    └── index.ts           # Barrel export (optional)
```

### Composables Structure

Composables follow the same pattern:

```
composables/
└── useCounter/
    ├── useCounter.ts       # Composable logic
    ├── useCounter.types.ts # TypeScript types
    └── index.ts            # Barrel export
```

## Usage in Templates

### Basic Usage

Mount a Vue component using the `data-vue-component` attribute:

```twig
{# Lazy-loaded by default (loads when visible) #}
<div data-vue-component="Counter"></div>
```

### Eager Loading

Load component immediately with main bundle:

```twig
{# Load immediately, no lazy loading #}
<div data-vue-component="Counter" data-eager></div>
```

### Passing Props

Pass data to components using JSON in `data-props`:

```twig
<div
  data-vue-component="Counter"
  data-props='{"title": "My Counter", "initialValue": 10, "max": 100}'
></div>
```

### Complete Example

```twig
{# FrontPage.twig #}
<div class="counters">
  {# Eager-loaded critical component #}
  <div
    data-vue-component="Counter"
    data-eager
    data-props='{"title": "Main Counter", "min": 0, "max": 50}'
  ></div>

  {# Lazy-loaded below-the-fold component #}
  <div
    data-vue-component="PhotoGallery"
    data-props='{"layout": "masonry", "columns": 3}'
  ></div>
</div>
```

## Creating New Components

### 1. Create Component Directory

```bash
mkdir -p components/MyComponent
```

### 2. Create Vue Component

**components/MyComponent/MyComponent.vue**

```vue
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { MyComponentProps } from './MyComponent.types';

const props = withDefaults(defineProps<MyComponentProps>(), {
  title: 'Default Title',
  description: 'Default description',
});

const count = ref(0);

function handleClick() {
  count.value++;
}
</script>

<style scoped>
.my-component {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.my-component h2 {
  margin: 0 0 0.5rem;
}
</style>
```

### 3. Create Type Definitions (Optional)

**components/MyComponent/MyComponent.types.ts**

```typescript
/**
 * MyComponent Props
 */
export interface MyComponentProps {
  /** Component title */
  title?: string;
  /** Component description */
  description?: string;
}
```

### 4. Use in Template

**pages/SomePage.twig**

```twig
<div
  data-vue-component="MyComponent"
  data-props='{"title": "Hello", "description": "World"}'
></div>
```

That's it! No imports, no registry, no configuration needed.

## Auto-Discovery System

### How It Works

1. **Vite Glob Import** discovers all `components/**/*.vue` files
2. **Main.ts** calls `autoMountVueComponents()` on page load
3. **DOM Scanner** finds all `[data-vue-component]` elements
4. **Component Matcher** matches element names to discovered components
5. **Lazy/Eager Loader** loads components based on `data-eager` attribute
6. **Vue Mounter** creates and mounts Vue app instances

### Component Naming Convention

Component files **must** follow this naming pattern:

```
✅ components/Counter/Counter.vue
✅ components/PhotoGallery/PhotoGallery.vue
✅ components/ContactForm/ContactForm.vue

❌ components/Counter/index.vue (won't be discovered)
❌ components/counter/Counter.vue (folder name mismatch)
❌ components/Counter.vue (must be in folder)
```

The folder name and file name (without .vue) must match exactly.

### Lazy Loading Strategy

Components are **lazy-loaded by default** using **Intersection Observer**:

- Component code is split into separate chunk
- Loads when element is 100px from viewport
- Reduces initial bundle size
- Better performance for large pages

Use `data-eager` only for:
- Above-the-fold components
- Critical interactive elements
- Components needed immediately

## Component Composition

### Using Composables

Create reusable logic with composables:

**composables/useCounter/useCounter.ts**

```typescript
import { ref, computed } from 'vue';
import type { CounterOptions, CounterReturn } from './useCounter.types';

export function useCounter(
  initialValue: number = 0,
  options: CounterOptions = {}
): CounterReturn {
  const count = ref(initialValue);

  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => count.value = initialValue;

  return {
    count,
    increment,
    decrement,
    reset,
  };
}
```

**Use in component:**

```vue
<script setup lang="ts">
import { useCounter } from '../../composables/useCounter';

const { count, increment, decrement, reset } = useCounter(0, {
  min: 0,
  max: 100,
});
</script>
```

### Component Communication

**Props Down:**

```twig
<div data-vue-component="Child" data-props='{"message": "Hello"}'></div>
```

```vue
<script setup lang="ts">
defineProps<{ message: string }>();
</script>
```

**Events Up (via callbacks):**

```typescript
interface Props {
  onSave?: (data: FormData) => void;
}

const props = defineProps<Props>();

function handleSubmit(data: FormData) {
  props.onSave?.(data);
}
```

## TypeScript Support

### Component Props Types

Define props interface in `.types.ts` file:

```typescript
export interface ComponentProps {
  title: string;
  count?: number;
  disabled?: boolean;
  onUpdate?: (value: number) => void;
}
```

Import in component:

```vue
<script setup lang="ts">
import type { ComponentProps } from './Component.types';

const props = withDefaults(defineProps<ComponentProps>(), {
  count: 0,
  disabled: false,
});
</script>
```

### Composable Types

```typescript
// useCounter.types.ts
export interface CounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

export interface CounterReturn {
  count: Ref<number>;
  increment: () => void;
  decrement: () => void;
}
```

## Best Practices

### 1. Component Co-location

Keep all related files together:

```
✅ components/Button/Button.vue
✅ components/Button/Button.types.ts

❌ lib/types/button.ts (scattered types)
```

### 2. Naming Conventions

- **PascalCase** for component names: `Counter`, `PhotoGallery`
- **camelCase** for props: `initialValue`, `maxCount`
- **kebab-case** in templates: `data-vue-component="MyComponent"`

### 3. Props Design

```typescript
// ✅ Good - clear, typed, with defaults
interface Props {
  title?: string;
  count?: number;
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Counter',
  count: 0,
  max: 100,
});

// ❌ Bad - no types, unclear purpose
const props = defineProps({
  data: Object,
  config: Object,
});
```

### 4. Composable Reusability

Extract common logic to composables:

```typescript
// ✅ Reusable logic
const { data, loading, error } = useFetch('/api/posts');
const { count, increment } = useCounter(0);

// ❌ Duplicated logic in components
const data = ref(null);
const loading = ref(false);
// ... fetch logic repeated in every component
```

### 5. Performance

- Use `data-eager` sparingly (only critical components)
- Lazy load heavy components (galleries, charts, forms)
- Keep components small and focused
- Use `v-once` for static content
- Use `v-memo` for expensive lists

### 6. Scoped Styles

Always use scoped styles to prevent conflicts:

```vue
<style scoped>
/* Only affects this component */
.button {
  padding: 0.5rem 1rem;
}
</style>
```

## Migration Guide

### From Old Manual Registry

**Before (manual):**

```typescript
// lib/config/vueComponents.ts
import Counter from '../../src/components/Counter.vue';

export const vueComponentRegistry = [
  {
    component: Counter,
    elementId: 'counter-eager',
    name: 'Counter',
    props: { max: 50 },
  },
];
```

```twig
<div id="counter-eager"></div>
```

**After (auto-discovery):**

```
components/Counter/Counter.vue
```

```twig
<div data-vue-component="Counter" data-eager data-props='{"max": 50}'></div>
```

Benefits:
- ✅ No manual imports
- ✅ No registry configuration
- ✅ Multiple instances possible
- ✅ Auto code-splitting
- ✅ Consistent with Twig components

## Debugging

### Check Available Components

Open browser console:

```javascript
// List all discovered components
autoMountVueComponents.getAvailableComponents()
// ["Counter", "PhotoGallery", "ContactForm"]
```

### Component Not Found

If component doesn't mount:

1. **Check file structure:**
   ```
   ✅ components/Counter/Counter.vue
   ❌ components/Counter/index.vue
   ```

2. **Check naming match:**
   ```twig
   ✅ data-vue-component="Counter" + components/Counter/Counter.vue
   ❌ data-vue-component="counter" + components/Counter/Counter.vue
   ```

3. **Check build output:**
   ```bash
   npm run build
   # Should see: dist/js/Counter.js
   ```

4. **Check browser console** for warnings

### Enable Debug Mode

Set in `.env`:

```
VITE_ENABLE_DEBUG=true
```

Console will show:
- Component discovery
- Mount points found
- Lazy load triggers
- Mount success/failure

## Examples

### Simple Counter

```vue
<template>
  <div class="counter">
    <button @click="decrement">-</button>
    <span>{{ count }}</span>
    <button @click="increment">+</button>
  </div>
</template>

<script setup lang="ts">
import { useCounter } from '../../composables/useCounter';

interface Props {
  initialValue?: number;
  min?: number;
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  initialValue: 0,
  min: 0,
  max: 100,
});

const { count, increment, decrement } = useCounter(
  props.initialValue,
  { min: props.min, max: props.max }
);
</script>

<style scoped>
.counter {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
```

### Form with Validation

```vue
<template>
  <form @submit.prevent="handleSubmit" class="contact-form">
    <input v-model="email" type="email" required />
    <textarea v-model="message" required></textarea>
    <button :disabled="!isValid">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const email = ref('');
const message = ref('');

const isValid = computed(() => {
  return email.value.includes('@') && message.value.length > 10;
});

function handleSubmit() {
  // Handle submission
}
</script>
```

## Summary

**Key Benefits:**

✅ **Zero Configuration** - Just create component and use it
✅ **Auto Code-Splitting** - Each component becomes separate chunk
✅ **Smart Lazy Loading** - Loads only when needed
✅ **Type Safety** - Full TypeScript support
✅ **Co-location** - All files together
✅ **Consistent** - Matches Twig component pattern
✅ **Performance** - Optimal bundle sizes
✅ **Developer Experience** - Minimal boilerplate

**Quick Start:**

1. Create `components/YourComponent/YourComponent.vue`
2. Use in Twig: `<div data-vue-component="YourComponent"></div>`
3. Done!
