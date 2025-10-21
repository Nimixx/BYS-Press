# AdvancedCounter Component Setup

## ✅ Component is Ready to Render

The AdvancedCounter component is fully configured and will render on your front page.

## Setup Summary

### 1. Component File
**Location:** `src/components/examples/AdvancedCounter.vue`

**Features:**
- Uses `useCounter` composable
- Progress bar visualization
- Min/Max range display
- Custom step buttons
- Responsive design

### 2. Twig Template
**File:** `views/pages/front-page.twig`

**Mount Point:**
```twig
<div id="advanced-counter"></div>
```

### 3. Component Registry
**File:** `src/js/config/vueComponents.ts`

**Configuration:**
```typescript
{
  elementId: 'advanced-counter',
  name: 'AdvancedCounter',
  loader: () => import('../../components/examples/AdvancedCounter.vue'),
  condition: () => pageConditions.elementExists('advanced-counter'),
  props: {
    title: 'Advanced Counter',
    initialValue: 50,
    min: 0,
    max: 100,
    step: 5,
  },
}
```

### 4. Code Splitting
The component is **lazy-loaded**, creating a separate JavaScript chunk:

```
dist/js/AdvancedCounter.js     1.45 kB  ✨ (separate chunk)
dist/css/AdvancedCounter.css   1.32 kB  ✨ (separate chunk)
```

**Benefits:**
- Only loads when the `#advanced-counter` element exists
- Doesn't bloat the main bundle
- Faster initial page load

## How to View

### Development Mode
```bash
npm run dev
```

Then visit your WordPress front page. The AdvancedCounter will appear below the regular counter.

### Production Build
```bash
npm run build
```

The component will be code-split into its own chunk and loaded on-demand.

## Component Props

You can customize the component by changing the props in `vueComponents.ts`:

```typescript
props: {
  title: 'Advanced Counter',    // Component title
  initialValue: 50,             // Starting value
  min: 0,                       // Minimum value
  max: 100,                     // Maximum value
  step: 5,                      // Increment/decrement step
}
```

## Visual Features

The component displays:
- **Title**: Configurable heading
- **Range**: Shows min-max values
- **Current Value**: Large display
- **Progress Bar**: Visual percentage indicator
- **Controls**: -5, Reset, +5 buttons
- **Disabled States**: Buttons disabled at min/max

## Customization

### Change Colors
Edit `src/components/examples/AdvancedCounter.vue`:

```vue
<style scoped>
.advanced-counter {
  border: 1px solid rgba(215, 12, 12, 0.894); /* Change this */
}

.advanced-counter__progress-bar {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); /* Change this */
}
</style>
```

### Change Behavior
Modify props in the registry or create a new instance with different settings.

### Add Multiple Instances
```twig
{# Twig template #}
<div id="advanced-counter-1"></div>
<div id="advanced-counter-2"></div>
```

```typescript
// Registry
{
  elementId: 'advanced-counter-1',
  name: 'AdvancedCounter1',
  loader: () => import('../../components/examples/AdvancedCounter.vue'),
  props: { title: 'Counter 1', min: 0, max: 50 },
},
{
  elementId: 'advanced-counter-2',
  name: 'AdvancedCounter2',
  loader: () => import('../../components/examples/AdvancedCounter.vue'),
  props: { title: 'Counter 2', min: 0, max: 200, step: 10 },
},
```

## Verification Checklist

✅ Component file exists: `src/components/examples/AdvancedCounter.vue`
✅ Mount point added: `<div id="advanced-counter"></div>` in front-page.twig
✅ Registered in: `src/js/config/vueComponents.ts` (lazy registry)
✅ Build creates separate chunk: `dist/js/AdvancedCounter.js`
✅ Uses composable: `useCounter` for logic

## Troubleshooting

### Component not showing?

1. **Check mount point exists:**
   ```twig
   {# In front-page.twig #}
   <div id="advanced-counter"></div>
   ```

2. **Build assets:**
   ```bash
   npm run build
   ```

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for mount confirmation or errors

4. **Verify condition:**
   The component mounts when `#advanced-counter` element exists

### Want to eager-load instead?

Move from `lazyVueComponentRegistry` to `vueComponentRegistry`:

```typescript
// 1. Import at top
import AdvancedCounter from '../../components/examples/AdvancedCounter.vue';

// 2. Add to eager registry
export const vueComponentRegistry: ComponentConfig[] = [
  {
    component: AdvancedCounter,
    elementId: 'advanced-counter',
    name: 'AdvancedCounter',
    props: { /* ... */ },
  },
];
```

## Next Steps

- Customize colors and styles
- Adjust min/max/step values
- Create more example components
- Add to other pages

Your AdvancedCounter component is ready to use! 🚀
