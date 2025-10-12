# Testing Guide for Core Theme

This theme includes comprehensive testing infrastructure for both frontend (TypeScript/Svelte) and backend (PHP) code.

## Table of Contents

- [Frontend Testing (Vitest)](#frontend-testing-vitest)
- [Backend Testing (PHPUnit)](#backend-testing-phpunit)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Code Coverage](#code-coverage)
- [Continuous Integration](#continuous-integration)

---

## Frontend Testing (Vitest)

### Overview

Frontend tests use **Vitest** with:
- **@testing-library/svelte** for component testing
- **@testing-library/jest-dom** for DOM assertions
- **happy-dom** for fast DOM simulation
- Full TypeScript support

### Test Location

All frontend tests should be placed next to the files they test:
```
src/
├── components/
│   ├── Counter.svelte
│   └── Counter.test.ts
├── js/
│   ├── config.ts
│   └── config.test.ts
└── test-utils/
    └── setup.ts
```

### Running Frontend Tests

```bash
# Run tests in watch mode (development)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Watch mode (automatically reruns tests on change)
npm run test:watch
```

### Example Component Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import MyComponent from './MyComponent.svelte';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(MyComponent);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    render(MyComponent);
    const button = screen.getByRole('button');
    await fireEvent.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### Example Utility Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { myUtilityFunction } from './utils';

describe('myUtilityFunction', () => {
  it('returns expected value', () => {
    expect(myUtilityFunction('input')).toBe('expected output');
  });

  it('handles edge cases', () => {
    expect(myUtilityFunction('')).toBe('');
    expect(myUtilityFunction(null)).toBeUndefined();
  });
});
```

---

## Backend Testing (PHPUnit)

### Overview

Backend tests use **PHPUnit 10** with:
- **Brain Monkey** for WordPress function mocking
- **Mockery** for advanced mocking
- PSR-4 autoloading

### Test Location

All PHP tests should be in the `tests/` directory:
```
tests/
├── bootstrap.php
├── SecurityHeadersTest.php
└── ThemeSetupTest.php
```

### Running Backend Tests

```bash
# Run PHP tests
composer test

# Run with coverage (requires Xdebug)
composer test:coverage

# Or via npm
npm run test:php
```

### Example PHP Test

```php
<?php

namespace CoreTheme\Tests;

use PHPUnit\Framework\TestCase;
use Brain\Monkey;
use Brain\Monkey\Functions;

class MyFeatureTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    public function testMyFunction(): void
    {
        // Mock WordPress functions
        Functions\when('get_option')->justReturn('test_value');

        // Your test logic
        $result = my_theme_function();

        $this->assertEquals('expected', $result);
    }
}
```

---

## Running Tests

### Run All Tests

```bash
# Run both frontend and backend tests
npm run test:all
```

### Run Specific Tests

```bash
# Frontend: Run specific test file
npx vitest src/components/Counter.test.ts

# Frontend: Run tests matching pattern
npx vitest --grep="Counter"

# Backend: Run specific test
./vendor/bin/phpunit tests/SecurityHeadersTest.php

# Backend: Run specific test method
./vendor/bin/phpunit --filter=testProductionEnvironmentDetection
```

### Watch Mode

```bash
# Frontend watch mode (reruns on file changes)
npm run test:watch

# Backend doesn't have native watch mode, but you can use:
watch -n 1 composer test
```

---

## Writing Tests

### Frontend Test Best Practices

1. **Test User Behavior, Not Implementation**
   ```typescript
   // Good: Test what users see/do
   expect(screen.getByText('Submit')).toBeInTheDocument();

   // Bad: Test implementation details
   expect(component.state.isSubmitting).toBe(false);
   ```

2. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('displays error message when form submission fails', () => {});

   // Bad
   it('test 1', () => {});
   ```

3. **Arrange-Act-Assert Pattern**
   ```typescript
   it('increments counter on button click', async () => {
     // Arrange
     render(Counter);
     const button = screen.getByText('+');

     // Act
     await fireEvent.click(button);

     // Assert
     expect(screen.getByText('1')).toBeInTheDocument();
   });
   ```

4. **Mock External Dependencies**
   ```typescript
   import { vi } from 'vitest';

   it('calls API on submit', async () => {
     global.fetch = vi.fn().mockResolvedValue({
       ok: true,
       json: async () => ({ success: true }),
     });

     // Test logic
   });
   ```

### Backend Test Best Practices

1. **Mock WordPress Functions**
   ```php
   use Brain\Monkey\Functions;

   // Simple return
   Functions\when('get_option')->justReturn('value');

   // With expectations
   Functions\expect('add_action')
       ->once()
       ->with('init', \Mockery::type('callable'));
   ```

2. **Test Security Features**
   ```php
   public function testInputSanitization(): void
   {
       $dirty = '<script>alert("xss")</script>';
       $clean = my_sanitize_function($dirty);

       $this->assertStringNotContainsString('<script>', $clean);
   }
   ```

3. **Test Edge Cases**
   ```php
   public function testHandlesEmptyInput(): void
   {
       $result = my_function('');
       $this->assertEquals('default', $result);
   }

   public function testHandlesNullInput(): void
   {
       $result = my_function(null);
       $this->assertNull($result);
   }
   ```

---

## Code Coverage

### Frontend Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/html/index.html
```

Coverage reports include:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

### Backend Coverage

```bash
# Requires Xdebug extension
composer test:coverage

# View HTML report
open coverage/html/index.html
```

### Coverage Goals

Aim for:
- **80%+** statement coverage
- **70%+** branch coverage
- **100%** coverage for security-critical code

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:run

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
      - run: composer install
      - run: composer test
```

---

## Test Structure

### Frontend Test Structure

```
src/
├── components/          # Svelte components with tests
│   ├── Counter.svelte
│   └── Counter.test.ts
├── js/                 # TypeScript modules with tests
│   ├── config.ts
│   └── config.test.ts
└── test-utils/         # Shared test utilities
    └── setup.ts        # Global test setup
```

### Backend Test Structure

```
tests/
├── bootstrap.php              # Test environment setup
├── SecurityHeadersTest.php    # Security functionality tests
└── ThemeSetupTest.php         # Theme setup tests
```

---

## Common Issues & Solutions

### Frontend Issues

**Issue:** `Cannot find module '@testing-library/svelte'`
```bash
Solution: npm install
```

**Issue:** `ReferenceError: fetch is not defined`
```typescript
Solution: Mock fetch in your test
global.fetch = vi.fn().mockResolvedValue({});
```

**Issue:** Tests fail with Svelte 5 runes
```typescript
Solution: Use $state() and $derived() properly in components
```

### Backend Issues

**Issue:** `Class 'Brain\Monkey' not found`
```bash
Solution: composer install
```

**Issue:** `Cannot use 'header()' in tests`
```php
Solution: Mock headers_sent() in your tests
Functions\when('headers_sent')->justReturn(false);
```

**Issue:** `Call to undefined function`
```php
Solution: Add function mock in tests/bootstrap.php
```

---

## Resources

### Frontend Testing
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/)
- [Svelte Testing Guide](https://svelte.dev/docs/testing)

### Backend Testing
- [PHPUnit Documentation](https://phpunit.de/)
- [Brain Monkey](https://giuseppe-mazzapica.gitbook.io/brain-monkey/)
- [Mockery](http://docs.mockery.io/)

---

## Test Commands Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run frontend tests in watch mode |
| `npm run test:run` | Run frontend tests once |
| `npm run test:ui` | Run frontend tests with UI |
| `npm run test:coverage` | Run frontend tests with coverage |
| `npm run test:watch` | Run frontend tests in watch mode |
| `npm run test:php` | Run PHP tests |
| `npm run test:all` | Run all tests (frontend + backend) |
| `composer test` | Run PHP tests via Composer |
| `composer test:coverage` | Run PHP tests with coverage |

---

**Last Updated:** October 2025
**Maintained by:** Core Theme Team
