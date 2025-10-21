# Vue Components

This directory contains all Vue 3 components for the Core Theme.

## Quick Reference

### Component Organization

```
components/
├── Counter.vue              # Main counter component
├── examples/                # Example/demo components
│   └── AdvancedCounter.vue
├── forms/                   # Form components (future)
├── layout/                  # Layout components (future)
└── ui/                      # Reusable UI components (future)
```

### Adding a New Component

1. **Create component file**
   ```bash
   touch src/components/YourComponent.vue
   ```

2. **Define types** (if needed)
   ```typescript
   // src/types/yourComponent.ts
   export interface YourComponentProps {
     // ...
   }
   ```

3. **Register in vueComponents.ts**
   ```typescript
   // For eager loading (main bundle)
   import YourComponent from '../../components/YourComponent.vue';

   export const vueComponentRegistry = [
     {
       component: YourComponent,
       elementId: 'your-component',
       name: 'YourComponent',
     },
   ];

   // For lazy loading (code split)
   export const lazyVueComponentRegistry = [
     {
       elementId: 'your-component',
       name: 'YourComponent',
       loader: () => import('../../components/YourComponent.vue'),
     },
   ];
   ```

4. **Add mount point in Twig**
   ```twig
   <div id="your-component"></div>
   ```

### Component Template

```vue
<template>
  <div class="component">
    <h2>{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ComponentProps } from '../types';

const props = withDefaults(defineProps<ComponentProps>(), {
  title: 'Default Title',
});

const emit = defineEmits<{
  (e: 'action', value: string): void;
}>();
</script>

<style scoped>
.component {
  /* Styles */
}
</style>
```

## Component Categories

### UI Components (`/ui/`)
Small, reusable presentational components.

**Examples:** Button, Card, Badge, Spinner

**Characteristics:**
- No business logic
- Highly reusable
- Props-based configuration
- Event-based communication

### Layout Components (`/layout/`)
Structural components that define page layout.

**Examples:** Header, Footer, Sidebar, Container

**Characteristics:**
- Define page structure
- Contain other components
- Responsive design
- Global scope

### Form Components (`/forms/`)
Input controls and form-related components.

**Examples:** TextInput, Select, Checkbox, ContactForm

**Characteristics:**
- Form validation
- v-model support
- Accessibility
- Error handling

### Feature Components (root `/components/`)
Complex components that combine UI and business logic.

**Examples:** Counter, ProductCard, SearchBar

**Characteristics:**
- Use composables
- Combine multiple UI components
- Feature-specific logic
- May fetch data

## Best Practices

### 1. Single Responsibility
Each component should do one thing well.

✅ **Good:** `<ProductCard>`, `<SearchBar>`, `<UserAvatar>`
❌ **Bad:** `<ProductSearchWithCartAndUser>`

### 2. Props Down, Events Up
Components receive data via props and communicate via events.

```vue
<!-- Parent -->
<Counter :initialValue="count" @change="handleChange" />

<!-- Child emits -->
emit('change', newValue);
```

### 3. Use Composables for Logic
Extract reusable logic to composables.

```vue
<script setup>
import { useCounter } from '../composables';

const { count, increment } = useCounter();
</script>
```

### 4. Type Everything
Use TypeScript for props, emits, and refs.

```typescript
interface Props {
  title: string;
  count?: number;
}

interface Emits {
  (e: 'update', value: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
```

### 5. Scoped Styles
Use scoped styles to prevent CSS leaks.

```vue
<style scoped>
.component {
  /* Only affects this component */
}
</style>
```

### 6. Accessibility
Always consider keyboard navigation and screen readers.

```vue
<button
  :aria-label="description"
  :disabled="isDisabled"
  @click="handleClick"
>
  {{ label }}
</button>
```

## Code Splitting

### When to Eager Load
- Critical above-the-fold components
- Components on every page
- Small, frequently used components

### When to Lazy Load
- Large, complex components
- Page-specific components
- Components with heavy dependencies
- Below-the-fold content

**Performance Impact:**
- Lazy loading reduces initial bundle size
- Faster page load times
- Better performance on pages without the component

## Testing

Every component should have tests.

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage
```

**Test file naming:**
- Component: `Counter.vue`
- Test: `Counter.test.ts`

**What to test:**
- Rendering with different props
- User interactions (clicks, inputs)
- Event emissions
- Computed properties
- Disabled/error states

## Related Documentation

- [VUE_ARCHITECTURE.md](../md-docs/VUE_ARCHITECTURE.md) - Complete architecture guide
- [TESTING.md](../md-docs/TESTING.md) - Testing guide
- [../types/README.md](../types/README.md) - TypeScript types
- [../composables/README.md](../composables/README.md) - Composables guide

## Examples

See `examples/` directory for:
- **AdvancedCounter.vue** - Advanced usage with composables
- More examples coming soon...
