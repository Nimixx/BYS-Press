# Vue Quick Start Guide

Quick reference for working with the Vue architecture in Core Theme.

## 📁 Project Structure

```
src/
├── components/      # Vue components
├── composables/     # Reusable logic
├── types/          # TypeScript types
└── js/config/      # Component registry
```

## 🚀 Adding a Component (5 Steps)

### 1. Create Component
```bash
touch src/components/MyComponent.vue
```

### 2. Write Component
```vue
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <button @click="handleClick">{{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import type { MyComponentProps, MyComponentEmits } from '../types';

const props = defineProps<MyComponentProps>();
const emit = defineEmits<MyComponentEmits>();

function handleClick() {
  emit('click', count.value);
}
</script>

<style scoped>
.my-component { /* styles */ }
</style>
```

### 3. Define Types (optional but recommended)
```typescript
// src/types/myComponent.ts
export interface MyComponentProps {
  title: string;
  initialCount?: number;
}

export interface MyComponentEmits {
  (e: 'click', count: number): void;
}

// src/types/index.ts
export type { MyComponentProps, MyComponentEmits } from './myComponent';
```

### 4. Register Component
```typescript
// src/js/config/vueComponents.ts

// Eager loading (bundled in main.js)
import MyComponent from '../../components/MyComponent.vue';

export const vueComponentRegistry: ComponentConfig[] = [
  {
    component: MyComponent,
    elementId: 'my-component',
    name: 'MyComponent',
  },
];

// OR lazy loading (separate chunk)
export const lazyVueComponentRegistry: LazyComponentConfig[] = [
  {
    elementId: 'my-component',
    name: 'MyComponent',
    loader: () => import('../../components/MyComponent.vue'),
  },
];
```

### 5. Add to Template
```twig
{# views/pages/front-page.twig #}
<div id="my-component"></div>
```

## 🎯 Creating a Composable

### 1. Create File
```bash
touch src/composables/useMyFeature.ts
```

### 2. Write Composable
```typescript
import { ref, computed, readonly } from 'vue';
import type { MyFeatureOptions, MyFeatureReturn } from '../types';

export function useMyFeature(
  options: MyFeatureOptions = {}
): MyFeatureReturn {
  const state = ref(initialState);

  const computed = computed(() => transform(state.value));

  function action() {
    state.value = newState;
  }

  return {
    state: readonly(state),
    computed,
    action,
  };
}
```

### 3. Export
```typescript
// src/composables/index.ts
export { useMyFeature } from './useMyFeature';
```

### 4. Use in Component
```vue
<script setup lang="ts">
import { useMyFeature } from '../composables';

const { state, action } = useMyFeature({ /* options */ });
</script>
```

## 🔷 TypeScript Types

### Props
```typescript
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}
```

### Emits
```typescript
export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void;
}
```

### Composable Options
```typescript
export interface FeatureOptions {
  enabled?: boolean;
  onChange?: (value: string) => void;
}
```

### Composable Return
```typescript
export interface FeatureReturn {
  value: Ref<string>;
  toggle: () => void;
}
```

## 🧪 Testing

### Component Test
```typescript
// src/components/MyComponent.test.ts
import { mount } from '@vue/test-utils';
import MyComponent from './MyComponent.vue';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' }
    });
    expect(wrapper.text()).toContain('Test');
  });
});
```

### Composable Test
```typescript
// src/composables/useMyFeature.test.ts
import { useMyFeature } from './useMyFeature';

describe('useMyFeature', () => {
  it('works correctly', () => {
    const { state, action } = useMyFeature();
    action();
    expect(state.value).toBe(expected);
  });
});
```

## 📋 Component Registry Options

### Eager Loading (Main Bundle)
```typescript
{
  component: Counter,           // Import at top
  elementId: 'vue-counter',     // DOM mount point
  name: 'Counter',              // For debugging
  required: false,              // Warn if missing?
  condition: () => true,        // Should mount?
  props: { initialValue: 0 },  // Props to pass
}
```

### Lazy Loading (Code Split)
```typescript
{
  elementId: 'contact-form',
  name: 'ContactForm',
  loader: () => import('../../components/forms/ContactForm.vue'),
  condition: () => pageConditions.hasBodyClass('page-contact'),
}
```

### Page Conditions
```typescript
condition: () => pageConditions.isFrontPage()
condition: () => pageConditions.elementExists('my-component')
condition: () => pageConditions.hasBodyClass('page-about')
condition: () => window.innerWidth > 768  // Custom
```

## 🎨 Component Patterns

### Basic Component
```vue
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
const message = 'Hello World';
</script>
```

### Component with Props
```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});
</script>
```

### Component with Emits
```vue
<script setup lang="ts">
interface Emits {
  (e: 'update', value: string): void;
}

const emit = defineEmits<Emits>();

function handleUpdate() {
  emit('update', 'new value');
}
</script>
```

### Component with Composable
```vue
<script setup lang="ts">
import { useCounter } from '../composables';

const { count, increment } = useCounter(0, {
  min: 0,
  max: 10,
});
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

## 🚦 Eager vs Lazy Loading

### When to Eager Load
- ✅ Critical above-the-fold components
- ✅ Used on every page
- ✅ Small file size (<5kb)
- ✅ Required for initial render

### When to Lazy Load
- ✅ Large components (>10kb)
- ✅ Page-specific components
- ✅ Below the fold
- ✅ Heavy dependencies

## 📦 Import Patterns

### Components
```typescript
// Central export (recommended)
import { Counter } from '../components';

// Direct import (when needed)
import Counter from '../components/Counter.vue';
```

### Composables
```typescript
// Central export (recommended)
import { useCounter } from '../composables';

// Multiple imports
import { useCounter, useForm } from '../composables';
```

### Types
```typescript
// Central export (always)
import type { CounterProps, CounterEmits } from '../types';
```

## 🛠️ Common Tasks

### Update Component Props
```typescript
// 1. Update types
export interface CounterProps {
  newProp?: string;  // Add new prop
}

// 2. Use in component
const props = defineProps<CounterProps>();
```

### Add Component Styles
```vue
<style scoped>
.component {
  /* Component styles */
}

/* Use CSS custom properties */
.component {
  color: var(--color-text);
  padding: var(--spacing-md);
}
</style>
```

### Pass Data from Twig
```twig
{# Twig template #}
<div
  id="my-component"
  data-title="{{ post.title }}"
  data-count="{{ post.count }}"
></div>
```

```typescript
// Component
onMounted(() => {
  const el = document.getElementById('my-component');
  const title = el?.dataset.title;
  const count = Number(el?.dataset.count);
});
```

## 🔍 Debugging

### Check Mount Status
```typescript
// In vueComponentMount.ts
debugLog(`${name} mounted successfully`);
```

### Component Not Mounting?
1. ✅ Check element ID matches registry
2. ✅ Verify condition returns true
3. ✅ Check browser console for errors
4. ✅ Verify Twig template has mount point

### Type Errors?
1. ✅ Run `npm run check` for TypeScript errors
2. ✅ Ensure types are exported from `types/index.ts`
3. ✅ Verify import paths are correct

## 📚 Documentation

- **Complete Guide**: [VUE_ARCHITECTURE.md](../md-docs/VUE_ARCHITECTURE.md)
- **Components**: [components/README.md](./components/README.md)
- **Composables**: [composables/README.md](./composables/README.md)
- **Types**: [types/README.md](./types/README.md)
- **Upgrade Summary**: [VUE_UPGRADE_SUMMARY.md](../VUE_UPGRADE_SUMMARY.md)

## 🚀 Commands

```bash
# Development
npm run dev              # Start dev server with HMR

# Building
npm run build            # Build for production

# Testing
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:coverage    # Generate coverage report

# Linting
npm run lint             # Check for issues
npm run lint:fix         # Auto-fix issues
npm run format           # Format code
npm run check            # Lint + format check
```

## 💡 Tips

1. **Always use types** - Define props and emits interfaces
2. **Use composables** - Extract reusable logic
3. **Lazy load when possible** - Better performance
4. **Test components** - Catch bugs early
5. **Follow naming conventions** - `useFeature`, `ComponentName.vue`
6. **Document complex logic** - JSDoc comments
7. **Keep components small** - Single responsibility
8. **Use readonly state** - From composables

## 🎯 Quick Examples

### Counter Component
See: `src/components/Counter.vue`

### Advanced Counter
See: `src/components/examples/AdvancedCounter.vue`

### useCounter Composable
See: `src/composables/useCounter.ts`

---

**Questions?** Check the full documentation in `md-docs/VUE_ARCHITECTURE.md`
