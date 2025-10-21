# Test Structure Reorganization

## ✅ Reorganization Complete

Successfully centralized all test files into a dedicated `src/__tests__/` directory for a cleaner project structure.

## What Changed

### Before: Co-located Tests ❌
Tests were mixed with source code throughout the project:

```
src/
├── composables/
│   ├── useCounter.ts
│   ├── useCounter.test.ts      ❌ Test mixed with source
│   ├── index.ts
│   └── README.md
├── components/
│   └── examples/
│       └── AdvancedCounter.vue
├── js/
│   ├── config.ts
│   ├── config.test.ts          ❌ Test mixed with source
│   └── utils/
│       ├── errorHandler.ts
│       └── errorHandler.test.ts ❌ Test mixed with source
```

**Problems:**
- Source directories cluttered with test files
- Harder to navigate production code
- Mixed concerns (code vs tests)
- Difficult to exclude tests from builds

### After: Centralized Tests ✅
All tests in one dedicated directory:

```
src/
├── __tests__/                   ✅ Centralized test directory
│   ├── composables/
│   │   └── useCounter.test.ts
│   ├── components/              (ready for future tests)
│   ├── config/
│   │   └── config.test.ts
│   ├── utils/
│   │   └── errorHandler.test.ts
│   └── README.md               ✅ Test documentation
├── composables/                 ✅ Clean source code
│   ├── useCounter.ts
│   ├── index.ts
│   └── README.md
├── components/                  ✅ Clean source code
│   ├── examples/
│   │   └── AdvancedCounter.vue
│   └── README.md
├── js/                          ✅ Clean source code
│   ├── config.ts
│   └── utils/
│       └── errorHandler.ts
```

**Benefits:**
- ✅ Clean separation of code and tests
- ✅ Easy to find all tests
- ✅ Mirror source structure
- ✅ Professional organization

## Files Moved

### 1. Composable Tests
**From:** `src/composables/useCounter.test.ts`
**To:** `src/__tests__/composables/useCounter.test.ts`
**Updated:** Import path to `../../composables/useCounter`

### 2. Utility Tests
**From:** `src/js/utils/errorHandler.test.ts`
**To:** `src/__tests__/utils/errorHandler.test.ts`
**Updated:** Import path to `../../js/utils/errorHandler`

### 3. Config Tests
**From:** `src/js/config.test.ts`
**To:** `src/__tests__/config/config.test.ts`
**Updated:** Import path to `../../js/config`

## Directory Structure

### Test Directory
```
src/__tests__/
├── composables/          # Composable tests
│   └── useCounter.test.ts
├── components/           # Component tests (future)
├── config/               # Configuration tests
│   └── config.test.ts
├── utils/                # Utility tests
│   └── errorHandler.test.ts
└── README.md             # Test documentation
```

### Source Directories (Now Clean)
```
src/
├── composables/          # Only source code
│   ├── useCounter.ts
│   ├── index.ts
│   └── README.md
├── components/           # Only Vue components
│   └── examples/
│       └── AdvancedCounter.vue
├── js/                   # Only JavaScript/TypeScript
│   ├── config.ts
│   ├── main.ts
│   └── utils/
│       └── errorHandler.ts
├── types/                # Only type definitions
│   ├── index.ts
│   └── ...
└── css/                  # Only stylesheets
    └── main.css
```

## Import Path Changes

All test imports updated to use relative paths from `__tests__/`:

### Before
```typescript
// src/composables/useCounter.test.ts
import { useCounter } from './useCounter';
```

### After
```typescript
// src/__tests__/composables/useCounter.test.ts
import { useCounter } from '../../composables/useCounter';
```

## Test Results

### ✅ All Tests Passing
```
✓ src/__tests__/composables/useCounter.test.ts (28 tests)
✓ src/__tests__/utils/errorHandler.test.ts (11 tests)
✓ src/__tests__/config/config.test.ts (15 tests)

Test Files  3 passed (3)
Tests       54 passed (54)
Duration    632ms
```

### ✅ Build Successful
```
dist/js/main.js               63.89 kB
dist/js/AdvancedCounter.js     2.18 kB
dist/css/main.css             14.20 kB
✓ built in 301ms
```

## Benefits of Centralized Structure

### 1. Clean Code Organization
- Production code is separate from tests
- Easier to navigate source files
- Clear directory purposes

### 2. Professional Structure
- Industry-standard pattern
- Matches frameworks like Next.js, Nuxt, etc.
- Easier for team collaboration

### 3. Better Scalability
- Add tests without cluttering source
- Easy to find and maintain tests
- Clear test categories

### 4. Build Optimization
- Simple to exclude from production builds
- Clearer separation for bundlers
- Better tree-shaking

### 5. Improved Discoverability
- All tests in one place
- Mirror source structure
- Quick test navigation

## Running Tests

### All Tests
```bash
npm test                # Watch mode
npm run test:run        # Run once
npm run test:coverage   # With coverage
```

### Specific Category
```bash
npm test composables/   # All composable tests
npm test utils/         # All utility tests
npm test config/        # All config tests
```

### Specific File
```bash
npm test useCounter     # Run useCounter tests
npm test errorHandler   # Run errorHandler tests
```

## Adding New Tests

### 1. Create Test File in Appropriate Category
```bash
# For a composable
touch src/__tests__/composables/useMyFeature.test.ts

# For a component
touch src/__tests__/components/MyComponent.test.ts

# For a utility
touch src/__tests__/utils/myUtil.test.ts
```

### 2. Write Test with Correct Import Path
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../path/to/source';

describe('MyFunction', () => {
  it('should work', () => {
    expect(myFunction()).toBe(expected);
  });
});
```

### 3. Run Tests
```bash
npm test myFunction
```

## Migration Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Test Location** | Co-located with source | Centralized in `__tests__/` |
| **Source Directories** | Mixed with `.test.ts` files | Clean, production code only |
| **Test Discovery** | Scattered across project | All in one directory |
| **Import Paths** | `./module` | `../../category/module` |
| **Organization** | File-level | Category-level |
| **Scalability** | Clutters source | Clean growth |

## Documentation Created

### New Documentation
- ✅ `src/__tests__/README.md` - Complete test guide
- ✅ `TEST_STRUCTURE_REORGANIZATION.md` - This file

### Updated Documentation
- ✅ Component README - Updated test references
- ✅ Composables README - Updated test references

## Best Practices

### 1. Mirror Source Structure
```
Source: src/composables/useForm.ts
Test:   src/__tests__/composables/useForm.test.ts
```

### 2. One Test File Per Source File
```
useCounter.ts → useCounter.test.ts
errorHandler.ts → errorHandler.test.ts
```

### 3. Organize by Category
- `composables/` - Composable tests
- `components/` - Component tests
- `utils/` - Utility tests
- `config/` - Configuration tests

### 4. Use Descriptive Names
```typescript
// ✅ Good
describe('useCounter', () => {
  it('should increment count when increment is called')
})

// ❌ Bad
describe('counter', () => {
  it('works')
})
```

## Project Structure Overview

### Complete Structure
```
core-theme/
├── src/
│   ├── __tests__/             ✅ All tests
│   │   ├── composables/
│   │   ├── components/
│   │   ├── config/
│   │   ├── utils/
│   │   └── README.md
│   ├── components/            Production code
│   ├── composables/           Production code
│   ├── types/                 Production code
│   ├── js/                    Production code
│   └── css/                   Production code
├── tests/                     PHP tests (separate)
├── dist/                      Build output
└── coverage/                  Test coverage
```

## Verification Checklist

- ✅ All test files moved to `__tests__/`
- ✅ Import paths updated correctly
- ✅ All tests passing (54/54)
- ✅ Build successful
- ✅ Source directories clean
- ✅ Documentation updated
- ✅ README created for tests

## Next Steps

1. **Continue this pattern** when adding new tests
2. **Keep tests organized** by category
3. **Maintain mirror structure** with source
4. **Update documentation** as needed

## Resources

- [Test Directory README](src/__tests__/README.md) - Detailed testing guide
- [Vitest Documentation](https://vitest.dev/) - Test framework docs
- [Testing Best Practices](md-docs/TESTING.md) - Project testing guide

---

**Summary:** ✅ Test structure successfully reorganized!

Your project now has a clean, professional structure with:
- All tests centralized in `src/__tests__/`
- Clean source directories
- Easy test discovery
- Scalable organization
- 54 tests passing
- Build successful
