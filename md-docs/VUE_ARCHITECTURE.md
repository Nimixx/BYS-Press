# Vue Architecture Guide

This guide explains the scalable Vue 3 architecture used in Core Theme, including component organization, code splitting, composables, and best practices.

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Component Organization](#component-organization)
3. [Composables (Reusable Logic)](#composables)
4. [TypeScript Types](#typescript-types)
5. [Code Splitting Strategy](#code-splitting-strategy)
6. [Component Registry](#component-registry)
7. [Adding New Components](#adding-new-components)
8. [Best Practices](#best-practices)
9. [Performance Optimization](#performance-optimization)

## Folder Structure

```
src/
├── components/              # Vue components
│   ├── Counter.vue         # Example component
│   ├── examples/           # Example/demo components
│   │   └── AdvancedCounter.vue
│   ├── forms/              # Form components (future)
│   ├── layout/             # Layout components (future)
│   └── ui/                 # Reusable UI components (future)
├── composables/            # Reusable composition functions
│   ├── index.ts           # Central export
│   └── useCounter.ts      # Counter logic
├── types/                  # TypeScript type definitions
│   ├── index.ts           # Central export
│   ├── counter.ts         # Counter-related types
│   └── components.ts      # Component system types
└── js/
    ├── config/
    │   └── vueComponents.ts  # Component registry
    └── utils/
        └── vueComponentMount.ts  # Mounting utilities
```

## Component Organization

### Principles

1. **Single Responsibility**: Each component does one thing well
2. **Composition over Inheritance**: Use composables for shared logic
3. **Props Down, Events Up**: Unidirectional data flow
4. **Type Safety**: Full TypeScript support

### Component Categories

#### 1. **UI Components** (`/components/ui/`)
Reusable, presentational components with no business logic.

Example: Button, Card, Modal, Badge

#### 2. **Layout Components** (`/components/layout/`)
Structural components that define page layout.

Example: Header, Footer, Sidebar, Container

#### 3. **Form Components** (`/components/forms/`)
Input controls and form-related components.

Example: TextInput, Select, Checkbox, ContactForm

#### 4. **Feature Components** (`/components/`)
Complex, feature-specific components that combine UI and logic.

Example: Counter, ProductCard, SearchBar

#### 5. **Example Components** (`/components/examples/`)
Demo components for documentation and learning.

## Composables

Composables are reusable functions that encapsulate stateful logic using Vue's Composition API.

### Structure

```typescript
// src/composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const isEven = computed(() => count.value % 2 === 0);

  function increment() {
    count.value++;
  }

  return {
    count,
    isEven,
    increment,
  };
}
```

### When to Use Composables

- **State Management**: Shared reactive state
- **Side Effects**: API calls, subscriptions, timers
- **Computed Logic**: Derived state calculations
- **DOM Interactions**: Event listeners, resize handlers
- **Reusable Logic**: Code used in multiple components

### Naming Convention

- Prefix with `use`: `useCounter`, `useFetch`, `useAuth`
- Descriptive and specific: `useFormValidation` not `useForm`

### Best Practices

1. **Return Readonly State**: Prevent external mutations
   ```typescript
   return {
     count: readonly(count),
     increment,
   };
   ```

2. **Accept Options**: Make composables configurable
   ```typescript
   function useCounter(initial = 0, options = {}) {
     const { min, max } = options;
     // ...
   }
   ```

3. **Cleanup Side Effects**: Use `onUnmounted`
   ```typescript
   onUnmounted(() => {
     clearInterval(intervalId);
   });
   ```

4. **Type Everything**: Full TypeScript support
   ```typescript
   export function useCounter(
     initial: number = 0,
     options: CounterOptions = {}
   ): CounterReturn {
     // ...
   }
   ```

## TypeScript Types

### Centralized Type System

All types are defined in `src/types/` and exported through `src/types/index.ts`.

```typescript
// Import from central location
import type { CounterProps, CounterEmits } from '../types';
```

### Type Categories

#### 1. **Component Props**
```typescript
export interface CounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}
```

#### 2. **Component Emits**
```typescript
export interface CounterEmits {
  (e: 'update:modelValue', value: number): void;
  (e: 'change', value: number): void;
}
```

#### 3. **Composable Options**
```typescript
export interface CounterOptions {
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}
```

#### 4. **Composable Returns**
```typescript
export interface CounterReturn {
  count: Ref<number>;
  increment: () => void;
  decrement: () => void;
}
```

## Code Splitting Strategy

### Eager vs. Lazy Loading

#### **Eager Loading** (Main Bundle)
Components loaded immediately, bundled in `main.js`.

**Use for:**
- Critical above-the-fold components
- Components on every page (header, footer)
- Small, frequently used components

```typescript
// vueComponents.ts
import Counter from '../../components/Counter.vue';

export const vueComponentRegistry: ComponentConfig[] = [
  {
    component: Counter,
    elementId: 'vue-counter',
    name: 'Counter',
  },
];
```

#### **Lazy Loading** (Code Split)
Components loaded on-demand, create separate chunks.

**Use for:**
- Large, complex components
- Components on specific pages only
- Components with heavy dependencies
- Below-the-fold interactive elements

```typescript
// vueComponents.ts
export const lazyVueComponentRegistry: LazyComponentConfig[] = [
  {
    elementId: 'advanced-counter',
    name: 'AdvancedCounter',
    loader: () => import('../../components/examples/AdvancedCounter.vue'),
  },
];
```

### Bundle Analysis

```bash
# Build and analyze bundle
npm run build

# Check dist/ for generated chunks:
# - main-[hash].js - Main bundle (eager components)
# - AdvancedCounter-[hash].js - Lazy chunk
```

### Performance Impact

**Eager Loading:**
- ✅ Instant component availability
- ✅ No loading delay
- ❌ Larger initial bundle
- ❌ Slower initial page load

**Lazy Loading:**
- ✅ Smaller initial bundle
- ✅ Faster initial page load
- ✅ Only load when needed
- ❌ Small delay when first used
- ❌ Additional HTTP request

## Component Registry

The component registry (`src/js/config/vueComponents.ts`) is the central configuration for all Vue components.

### Registry Structure

```typescript
// Eager-loaded components
export const vueComponentRegistry: ComponentConfig[] = [
  {
    component: Counter,           // The Vue component
    elementId: 'vue-counter',     // DOM mount point
    name: 'Counter',              // For debugging
    required: false,              // Warn if missing?
    condition: () => true,        // Should mount?
    props: { initialValue: 0 },  // Props to pass
  },
];

// Lazy-loaded components
export const lazyVueComponentRegistry: LazyComponentConfig[] = [
  {
    elementId: 'contact-form',
    name: 'ContactForm',
    loader: () => import('../../components/forms/ContactForm.vue'),
    condition: () => pageConditions.hasBodyClass('page-contact'),
  },
];
```

### Page Conditions

Use `pageConditions` helper to conditionally mount components:

```typescript
export const pageConditions = {
  isFrontPage: () => document.body.classList.contains('home'),
  isSinglePost: () => document.body.classList.contains('single-post'),
  isArchive: () => document.body.classList.contains('archive'),
  elementExists: (id) => document.getElementById(id) !== null,
  hasBodyClass: (className) => document.body.classList.contains(className),
};
```

**Examples:**

```typescript
// Only on front page
condition: () => pageConditions.isFrontPage()

// Only if mount point exists
condition: () => pageConditions.elementExists('my-component')

// Custom condition
condition: () => window.innerWidth > 768

// Combined conditions
condition: () =>
  pageConditions.isFrontPage() &&
  pageConditions.elementExists('hero-slider')
```

## Adding New Components

### Step-by-Step Guide

#### 1. Create Component File

```bash
# UI component
touch src/components/ui/Button.vue

# Form component
touch src/components/forms/ContactForm.vue

# Feature component
touch src/components/ProductCard.vue
```

#### 2. Define Types (if needed)

```typescript
// src/types/button.ts
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void;
}
```

```typescript
// src/types/index.ts
export type { ButtonProps, ButtonEmits } from './button';
```

#### 3. Create Composable (if needed)

```typescript
// src/composables/useForm.ts
import { ref } from 'vue';

export function useForm() {
  const isSubmitting = ref(false);
  const errors = ref({});

  async function submit(data) {
    isSubmitting.value = true;
    // Handle submission
    isSubmitting.value = false;
  }

  return { isSubmitting, errors, submit };
}
```

```typescript
// src/composables/index.ts
export { useForm } from './useForm';
```

#### 4. Build the Component

```vue
<!-- src/components/ui/Button.vue -->
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps, ButtonEmits } from '../../types';

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
});

const emit = defineEmits<ButtonEmits>();

const buttonClasses = computed(() => [
  'button',
  `button--${props.variant}`,
  `button--${props.size}`,
]);

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event);
  }
}
</script>

<style scoped>
.button {
  /* Base styles */
}

.button--primary {
  /* Primary variant */
}

.button--secondary {
  /* Secondary variant */
}
</style>
```

#### 5. Register Component

**For Eager Loading:**

```typescript
// src/js/config/vueComponents.ts
import Button from '../../components/ui/Button.vue';

export const vueComponentRegistry: ComponentConfig[] = [
  {
    component: Button,
    elementId: 'primary-button',
    name: 'Button',
    props: { variant: 'primary' },
  },
];
```

**For Lazy Loading:**

```typescript
// src/js/config/vueComponents.ts
export const lazyVueComponentRegistry: LazyComponentConfig[] = [
  {
    elementId: 'contact-form',
    name: 'ContactForm',
    loader: () => import('../../components/forms/ContactForm.vue'),
    condition: () => pageConditions.hasBodyClass('page-contact'),
  },
];
```

#### 6. Add Mount Point in Twig

```twig
{# views/pages/front-page.twig #}
<div id="vue-counter"></div>
<div id="primary-button"></div>
```

#### 7. Test the Component

```bash
# Run dev server
npm run dev

# Visit page and verify component mounts
# Check browser console for mount confirmation
```

## Best Practices

### Component Design

1. **Keep Components Small**: Under 200 lines when possible
2. **Single Responsibility**: One clear purpose per component
3. **Composable Logic**: Extract reusable logic to composables
4. **Props Validation**: Use TypeScript interfaces
5. **Emit Events**: Don't mutate props directly

### Performance

1. **Lazy Load Heavy Components**: Use code splitting
2. **Use `v-if` for Conditional Rendering**: Not `v-show` for large trees
3. **Memoize Computed Values**: Cache expensive calculations
4. **Virtual Scrolling**: For long lists
5. **Async Components**: Load on interaction

### TypeScript

1. **Type Everything**: Props, emits, composables
2. **Use Interfaces**: Not `type` for objects
3. **Readonly Returns**: From composables
4. **Generic Types**: For reusable components
5. **Strict Mode**: Enable in tsconfig.json

### Code Organization

1. **Consistent Naming**: PascalCase components, camelCase functions
2. **File Colocation**: Group related files together
3. **Index Exports**: Central export points
4. **Clear Folder Structure**: Categorize by type/feature
5. **Documentation**: JSDoc comments for complex logic

### Accessibility

1. **Semantic HTML**: Use proper elements
2. **ARIA Labels**: For icon buttons
3. **Keyboard Navigation**: Tab, Enter, Escape support
4. **Focus Management**: Proper focus indicators
5. **Screen Reader Support**: Announce state changes

## Performance Optimization

### Bundle Size

```bash
# Check bundle sizes
npm run build
ls -lh dist/js/

# Analyze what's in your bundle
npm run build -- --mode=analyze
```

### Optimization Strategies

1. **Code Splitting**: Lazy load non-critical components
2. **Tree Shaking**: Remove unused code
3. **Minification**: Enabled in production builds
4. **Compression**: Gzip/Brotli on server
5. **Preload Critical Chunks**: Use `<link rel="preload">`

### Component Loading Strategies

#### **Critical Path** (Eager)
```typescript
// Header, navigation, above-fold content
import Header from '../../components/layout/Header.vue';
```

#### **Below the Fold** (Lazy)
```typescript
// Footer, modals, forms
loader: () => import('../../components/layout/Footer.vue')
```

#### **On Interaction** (Lazy)
```typescript
// Modals, lightboxes, complex forms
loader: () => import('../../components/ui/Modal.vue')
```

#### **Route-based** (Lazy)
```typescript
// Page-specific components
condition: () => pageConditions.hasBodyClass('page-about')
loader: () => import('../../components/pages/AboutHero.vue')
```

## Examples

### Complete Component Example

**File:** `src/components/ProductCard.vue`

```vue
<template>
  <article class="product-card">
    <img :src="product.image" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p class="price">{{ formatPrice(product.price) }}</p>
    <button @click="addToCart" :disabled="isAdding">
      {{ isAdding ? 'Adding...' : 'Add to Cart' }}
    </button>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

interface Emits {
  (e: 'add-to-cart', productId: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isAdding = ref(false);

async function addToCart() {
  isAdding.value = true;
  emit('add-to-cart', props.product.id);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  isAdding.value = false;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}
</script>

<style scoped>
.product-card {
  /* Component styles */
}
</style>
```

**Types:** `src/types/product.ts`

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}
```

**Registration:** `src/js/config/vueComponents.ts`

```typescript
export const lazyVueComponentRegistry: LazyComponentConfig[] = [
  {
    elementId: 'product-grid',
    name: 'ProductCard',
    loader: () => import('../../components/ProductCard.vue'),
    condition: () => pageConditions.hasBodyClass('page-shop'),
  },
];
```

## Related Documentation

- [TESTING.md](./TESTING.md) - Component testing guide
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
- [CUSTOMIZE.md](./CUSTOMIZE.md) - Customization guide
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
