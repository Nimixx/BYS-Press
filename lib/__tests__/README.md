# Test Directory

Centralized location for all test files in the Core Theme project.

## Structure

```
__tests__/
├── composables/           # Composable function tests
│   └── useCounter.test.ts
├── components/            # Vue component tests (future)
├── config/                # Configuration module tests
│   └── config.test.ts
└── utils/                 # Utility function tests
    └── errorHandler.test.ts
```

## Why Centralized Tests?

### Before (Co-located)
```
src/
├── composables/
│   ├── useCounter.ts
│   └── useCounter.test.ts    ❌ Mixed with source
├── js/
│   ├── config.ts
│   ├── config.test.ts        ❌ Mixed with source
│   └── utils/
│       ├── errorHandler.ts
│       └── errorHandler.test.ts  ❌ Mixed with source
```

### After (Centralized)
```
src/
├── __tests__/                ✅ All tests in one place
│   ├── composables/
│   │   └── useCounter.test.ts
│   ├── config/
│   │   └── config.test.ts
│   └── utils/
│       └── errorHandler.test.ts
├── composables/              ✅ Clean source code
│   └── useCounter.ts
├── js/                       ✅ Clean source code
│   ├── config.ts
│   └── utils/
│       └── errorHandler.ts
```

## Benefits

1. **Clean Source Directories**
   - Production code is separate from test code
   - Easier to navigate source files
   - Clearer project structure

2. **Easy Test Discovery**
   - All tests in one location
   - Quick access during development
   - Simplified test running

3. **Better Organization**
   - Mirror source structure
   - Maintain logical grouping
   - Scale as project grows

4. **Build Optimization**
   - Easier to exclude from builds
   - Clearer separation of concerns
   - Better for deployment

## Naming Convention

### Test Files
- **Pattern**: `[module-name].test.ts`
- **Examples**:
  - `useCounter.test.ts`
  - `errorHandler.test.ts`
  - `config.test.ts`

### Directory Structure
Mirror the source directory structure:
- Source: `src/composables/useCounter.ts`
- Test: `src/__tests__/composables/useCounter.test.ts`

## Writing Tests

### Import Paths
Since tests are in `__tests__/`, adjust import paths:

```typescript
// ❌ Old (co-located)
import { useCounter } from './useCounter';

// ✅ New (centralized)
import { useCounter } from '../../composables/useCounter';
```

### Test Structure
```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../../path/to/source';

describe('Your Module', () => {
  describe('yourFunction', () => {
    it('should do something', () => {
      const result = yourFunction();
      expect(result).toBe(expected);
    });
  });
});
```

## Running Tests

### All Tests
```bash
npm test                # Watch mode
npm run test:run        # Run once
npm run test:coverage   # With coverage
```

### Specific Test File
```bash
npm test useCounter     # Runs useCounter.test.ts
npm test errorHandler   # Runs errorHandler.test.ts
```

### By Category
```bash
npm test composables/   # All composable tests
npm test utils/         # All utility tests
npm test config/        # All config tests
```

## Test Categories

### Composables Tests (`composables/`)
Test Vue composables and reusable logic functions.

**What to test:**
- Return values and computed properties
- State changes and side effects
- Callbacks and event handlers
- Edge cases and error handling

**Example:**
```typescript
import { useCounter } from '../../composables/useCounter';

it('should increment counter', () => {
  const { count, increment } = useCounter(0);
  increment();
  expect(count.value).toBe(1);
});
```

### Component Tests (`components/`)
Test Vue component behavior and rendering.

**What to test:**
- Component rendering
- Props and emits
- User interactions
- Conditional rendering
- Computed properties

**Example:**
```typescript
import { mount } from '@vue/test-utils';
import MyComponent from '../../components/MyComponent.vue';

it('renders correctly', () => {
  const wrapper = mount(MyComponent);
  expect(wrapper.text()).toContain('Expected text');
});
```

### Utility Tests (`utils/`)
Test utility functions and helpers.

**What to test:**
- Function outputs for given inputs
- Error handling
- Edge cases
- Type guards

**Example:**
```typescript
import { formatDate } from '../../js/utils/format';

it('formats date correctly', () => {
  const result = formatDate('2024-01-01');
  expect(result).toBe('January 1, 2024');
});
```

### Config Tests (`config/`)
Test configuration modules and setup functions.

**What to test:**
- Configuration values
- API endpoints
- Feature flags
- Environment-specific logic

## Best Practices

### 1. Mirror Source Structure
```
src/composables/useForm.ts
  → __tests__/composables/useForm.test.ts

src/js/utils/validation.ts
  → __tests__/utils/validation.test.ts
```

### 2. Descriptive Test Names
```typescript
// ✅ Good
it('should return error when input is empty')

// ❌ Bad
it('works')
```

### 3. Test One Thing
```typescript
// ✅ Good
it('should increment count')
it('should decrement count')

// ❌ Bad
it('should increment and decrement count')
```

### 4. Use Arrange-Act-Assert
```typescript
it('should calculate total', () => {
  // Arrange
  const items = [1, 2, 3];

  // Act
  const total = calculateTotal(items);

  // Assert
  expect(total).toBe(6);
});
```

### 5. Mock External Dependencies
```typescript
import { vi } from 'vitest';

it('should call API', async () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  await fetchData();

  expect(mockFetch).toHaveBeenCalled();
});
```

## Adding New Tests

### 1. Create Test File
```bash
touch src/__tests__/[category]/[name].test.ts
```

### 2. Write Test
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../path/to/source';

describe('MyModule', () => {
  it('should work', () => {
    expect(myFunction()).toBe(expected);
  });
});
```

### 3. Run Test
```bash
npm test [name]
```

## Test Coverage

View coverage report:
```bash
npm run test:coverage
```

Coverage files are in `coverage/` directory (git-ignored).

**Goal:** Maintain >80% coverage for critical code.

## Troubleshooting

### Import Errors
**Problem:** Can't find module
```
Error: Cannot find module '../../composables/useCounter'
```

**Solution:** Check relative path from test to source
```typescript
// Test location: src/__tests__/composables/useCounter.test.ts
// Source: src/composables/useCounter.ts
// Correct path: ../../composables/useCounter
```

### Type Errors
**Problem:** TypeScript errors in tests

**Solution:** Ensure proper types are imported
```typescript
import type { MyType } from '../../types';
```

### Test Not Found
**Problem:** Vitest doesn't find new test

**Solution:** Tests must match pattern `*.test.ts` or `*.spec.ts`

## Related Documentation

- [TESTING.md](../../md-docs/TESTING.md) - Complete testing guide
- [Vitest Docs](https://vitest.dev/) - Vitest documentation
- [Testing Library](https://testing-library.com/) - Vue Testing Library

## Summary

✅ **All tests in `src/__tests__/`**
✅ **Mirror source directory structure**
✅ **Adjust import paths to `../../`**
✅ **54 tests passing**
✅ **Clean, organized codebase**

This centralized structure keeps your source code clean while maintaining organized, discoverable tests.
