# Error Handling Guide

This theme includes a comprehensive error handling system with error boundaries for Vue components, centralized error tracking, and user-friendly error displays.

> **Note**: This guide contains code examples that are in the process of being updated from Svelte 5 to Vue 3 syntax. While file extensions and imports have been updated, some code examples may still use Svelte-specific syntax patterns. When implementing error handling in Vue components, adapt the patterns to use Vue 3 Composition API with `ref()`, `computed()`, `onMounted()`, etc.

## Table of Contents

1. [Overview](#overview)
2. [Error Handler Utility](#error-handler-utility)
3. [ErrorBoundary Component](#errorboundary-component)
4. [Usage Examples](#usage-examples)
5. [Best Practices](#best-practices)
6. [Testing Error Handling](#testing-error-handling)
7. [Integration with Error Tracking Services](#integration-with-error-tracking-services)

---

## Overview

The error handling system consists of:

1. **Error Handler Utility** (`src/js/utils/errorHandler.ts`)
   - Centralized error handling
   - Error severity levels
   - Development vs production logging
   - Integration points for error tracking services

2. **ErrorBoundary Component** (`src/components/ErrorBoundary.vue`)
   - Reusable error boundary for Vue components
   - Prevents app crashes from component errors
   - User-friendly error UI
   - Automatic error logging

3. **Global Error Handlers** (setup in `src/js/main.ts`)
   - Catches unhandled promise rejections
   - Catches uncaught JavaScript errors
   - Network error handling

---

## Error Handler Utility

### Basic Usage

```typescript
import {
  handleComponentError,
  ErrorSeverity,
} from './utils/errorHandler';

try {
  // Your code
  riskyOperation();
} catch (error) {
  handleComponentError(
    error as Error,
    {
      componentName: 'MyComponent',
      action: 'User Action',
      metadata: { userId: 123 },
    },
    ErrorSeverity.HIGH,
  );
}
```

### Error Severity Levels

```typescript
enum ErrorSeverity {
  LOW = 'low',          // Minor issues, non-critical
  MEDIUM = 'medium',    // Standard errors
  HIGH = 'high',        // Important errors needing attention
  CRITICAL = 'critical' // Critical system failures
}
```

### Configuration

```typescript
import { configureErrorHandler } from './utils/errorHandler';

configureErrorHandler({
  isProduction: import.meta.env.PROD,
  enableConsoleLog: import.meta.env.DEV,
  enableErrorTracking: true,
  onError: (error, context) => {
    // Custom error handling logic
    console.log('Custom handler:', error, context);
  },
});
```

### Async Error Handling

```typescript
import { handleAsyncError } from './utils/errorHandler';

async function fetchData() {
  const [error, data] = await handleAsyncError(
    fetch('/api/data').then(res => res.json()),
    {
      componentName: 'DataFetcher',
      action: 'Fetch Data',
    },
  );

  if (error) {
    // Handle error
    return;
  }

  // Use data
  console.log(data);
}
```

### Safe Function Wrapper

```typescript
import { safeFunction } from './utils/errorHandler';

const safeClickHandler = safeFunction(
  (event: MouseEvent) => {
    // Potentially risky operation
    performAction();
  },
  {
    componentName: 'Button',
    action: 'Click Handler',
  },
);

// Use in Vue component
<button @click="safeClickHandler">Click Me</button>
```

### Network Error Handling

```typescript
import { handleNetworkError } from './utils/errorHandler';

async function fetchUser(id: number) {
  try {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
  } catch (error) {
    handleNetworkError(
      error as Error,
      `/api/users/${id}`,
      {
        componentName: 'UserProfile',
        metadata: { userId: id },
      },
    );
    return null;
  }
}
```

### Warning and Info Logging

```typescript
import { logWarning, logInfo } from './utils/errorHandler';

// Log warning
logWarning('Deprecated feature used', {
  componentName: 'OldComponent',
  metadata: { feature: 'legacyMethod' },
});

// Log info
logInfo('User logged in', { userId: 123 });
```

---

## ErrorBoundary Component

### Basic Usage

Wrap any component with ErrorBoundary to catch and handle errors:

```vue
<script setup lang="ts">
import ErrorBoundary from '../components/ErrorBoundary.vue';
import MyComponent from './MyComponent.vue';
</script>

<template>
  <ErrorBoundary componentName="MyComponent">
    <MyComponent />
  </ErrorBoundary>
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `componentName` | `string` | `'Unknown Component'` | Name for error tracking |
| `fallback` | `function` | `undefined` | Custom fallback UI |
| `showDetails` | `boolean` | `false` | Show error details in production |
| `severity` | `ErrorSeverity` | `MEDIUM` | Error severity level |
| `onError` | `function` | `undefined` | Callback when error occurs |

### Custom Fallback UI

```vue
<script setup lang="ts">
import ErrorBoundary from '../components/ErrorBoundary.vue';
import MyComponent from './MyComponent.vue';

  function customFallback(error: Error, reset: () => void) {
    return `
      <div class="custom-error">
        <h2>Something went wrong</h2>
        <p>${error.message}</p>
        <button onclick=${reset}>Retry</button>
      </div>
    `;
  }
</script>

<ErrorBoundary componentName="MyComponent" fallback={customFallback}>
  <MyComponent />
</ErrorBoundary>
```

### With Error Callback

```vue
<script>
  import ErrorBoundary from '../components/ErrorBoundary.vue';
  import { ErrorSeverity } from '../js/utils/errorHandler';

  function handleError(error: Error, context: ErrorContext) {
    // Send to analytics
    analytics.track('Component Error', {
      component: context.componentName,
      error: error.message,
    });
  }
</script>

<ErrorBoundary
  componentName="CriticalComponent"
  severity={ErrorSeverity.CRITICAL}
  onError={handleError}
>
  <CriticalComponent />
</ErrorBoundary>
```

---

## Usage Examples

### Example 1: Mounting Components

```typescript
// src/js/main.ts
import { createApp } from 'vue';
import ErrorBoundary from '../components/ErrorBoundary.vue';
import MyComponent from '../components/MyComponent.vue';
import { handleComponentError, ErrorSeverity } from './utils/errorHandler';

function mountComponent(elementId: string, Component: any) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.warn(`Mount point #${elementId} not found`);
    return;
  }

  try {
    mount(ErrorBoundary, {
      target: element,
      props: {
        componentName: 'MyComponent',
        children: () => {
          return mount(Component, { target: element });
        },
      },
    });
  } catch (error) {
    handleComponentError(
      error as Error,
      { componentName: 'MyComponent', action: 'Mount' },
      ErrorSeverity.HIGH,
    );
  }
}

mountComponent('app', MyComponent);
```

### Example 2: Form with Error Handling

```vue
<script setup lang="ts">
import ErrorBoundary from '../components/ErrorBoundary.vue';
  import { handleComponentError } from '../js/utils/errorHandler';

  let formData = $state({ name: '', email: '' });
  let loading = $state(false);
  let error = $state<string | null>(null);

  async function handleSubmit() {
    loading = true;
    error = null;

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      // Success
      alert('Form submitted successfully!');
    } catch (err) {
      error = 'Failed to submit form. Please try again.';
      handleComponentError(
        err as Error,
        {
          componentName: 'ContactForm',
          action: 'Form Submit',
          metadata: formData,
        },
      );
    } finally {
      loading = false;
    }
  }
</script>

<ErrorBoundary componentName="ContactForm">
  <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <input
      type="text"
      bind:value={formData.name}
      placeholder="Name"
      required
    />
    <input
      type="email"
      bind:value={formData.email}
      placeholder="Email"
      required
    />

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button type="submit" disabled={loading}>
      {loading ? 'Submitting...' : 'Submit'}
    </button>
  </form>
</ErrorBoundary>
```

### Example 3: Data Fetching Component

```vue
<script lang="ts">
import { onMounted } from 'vue';
import ErrorBoundary from '../components/ErrorBoundary.vue';
  import { handleAsyncError } from '../js/utils/errorHandler';

  interface User {
    id: number;
    name: string;
  }

  let users = $state<User[]>([]);
  let loading = $state(true);
  let error = $state<Error | null>(null);

  onMount(async () => {
    const [err, data] = await handleAsyncError<User[]>(
      fetch('/api/users').then(res => res.json()),
      {
        componentName: 'UserList',
        action: 'Fetch Users',
      },
    );

    if (err) {
      error = err;
    } else {
      users = data || [];
    }

    loading = false;
  });
</script>

<ErrorBoundary componentName="UserList">
  <div class="user-list">
    {#if loading}
      <p>Loading...</p>
    {:else if error}
      <p class="error">Failed to load users</p>
    {:else}
      <ul>
        {#each users as user}
          <li>{user.name}</li>
        {/each}
      </ul>
    {/if}
  </div>
</ErrorBoundary>
```

---

## Best Practices

### 1. Always Use ErrorBoundary for Top-Level Components

```vue
<!-- Good -->
<ErrorBoundary componentName="App">
  <App />
</ErrorBoundary>

<!-- Bad: No error boundary -->
<App />
```

### 2. Provide Meaningful Component Names

```vue
<!-- Good -->
<ErrorBoundary componentName="UserProfile">
  <UserProfile userId={123} />
</ErrorBoundary>

<!-- Bad: Generic name -->
<ErrorBoundary componentName="Component">
  <UserProfile userId={123} />
</ErrorBoundary>
```

### 3. Use Appropriate Severity Levels

```typescript
// Critical: Payment processing, data loss
handleComponentError(error, context, ErrorSeverity.CRITICAL);

// High: Form submission, authentication
handleComponentError(error, context, ErrorSeverity.HIGH);

// Medium: Data fetching, UI updates
handleComponentError(error, context, ErrorSeverity.MEDIUM);

// Low: Analytics, non-essential features
handleComponentError(error, context, ErrorSeverity.LOW);
```

### 4. Always Provide Context

```typescript
// Good: Rich context
handleComponentError(error, {
  componentName: 'CheckoutForm',
  action: 'Process Payment',
  metadata: {
    orderId: 12345,
    amount: 99.99,
    userId: 678,
  },
});

// Bad: No context
handleComponentError(error);
```

### 5. Handle Async Errors Properly

```typescript
// Good: Using handleAsyncError
const [error, data] = await handleAsyncError(
  fetchData(),
  { componentName: 'DataView' },
);

// Acceptable: Manual try-catch with proper handling
try {
  const data = await fetchData();
} catch (error) {
  handleComponentError(error, { componentName: 'DataView' });
}

// Bad: Unhandled promise
fetchData(); // No error handling
```

### 6. Don't Overuse Error Boundaries

```vue
<!-- Good: Error boundary around complex component -->
<ErrorBoundary componentName="Dashboard">
  <Dashboard />
</ErrorBoundary>

<!-- Bad: Error boundary around every small element -->
<ErrorBoundary componentName="Button1">
  <button>Click 1</button>
</ErrorBoundary>
<ErrorBoundary componentName="Button2">
  <button>Click 2</button>
</ErrorBoundary>
```

---

## Testing Error Handling

### Manual Testing

Create a test component that throws errors:

```vue
<!-- src/components/ErrorTest.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';

  let throwError = false;

  function causeError() {
    throw new Error('Test error from button click');
  }

  onMount(() => {
    if (throwError) {
      throw new Error('Test error on mount');
    }
  });
</script>

<div>
  <button onclick={causeError}>
    Throw Error
  </button>
</div>
```

Use it with ErrorBoundary:

```vue
<ErrorBoundary componentName="ErrorTest">
  <ErrorTest />
</ErrorBoundary>
```

### Automated Testing

```typescript
// src/components/ErrorBoundary.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/vue';
import ErrorBoundary from './ErrorBoundary.vue';

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    const { getByText } = render(ErrorBoundary, {
      props: {
        children: () => '<p>Child content</p>',
      },
    });

    expect(getByText('Child content')).toBeInTheDocument();
  });

  it('should catch and display error', () => {
    const onError = vi.fn();

    const { getByText } = render(ErrorBoundary, {
      props: {
        componentName: 'Test',
        onError,
        children: () => {
          throw new Error('Test error');
        },
      },
    });

    expect(getByText(/something went wrong/i)).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
  });
});
```

---

## Integration with Error Tracking Services

### Sentry Integration

```typescript
// src/js/utils/errorHandler.ts

// Add to sendToErrorTracker function
function sendToErrorTracker(errorInfo: any): void {
  if (window.Sentry) {
    window.Sentry.captureException(errorInfo.error, {
      level: errorInfo.severity,
      tags: {
        component: errorInfo.context.componentName,
      },
      extra: errorInfo.context.metadata,
    });
  }
}
```

### Setup Sentry

```typescript
// src/js/main.ts
import * as Sentry from '@sentry/browser';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: import.meta.env.MODE,
    beforeSend(event) {
      // Filter out errors you don't want to track
      return event;
    },
  });
}
```

### Custom API Endpoint

```typescript
// src/js/utils/errorHandler.ts

function sendToErrorTracker(errorInfo: any): void {
  fetch('/wp-json/core-theme/v1/log-error', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': window.coreTheme?.nonce,
    },
    body: JSON.stringify(errorInfo),
  }).catch(err => {
    console.error('Failed to send error to tracker:', err);
  });
}
```

Create WordPress endpoint:

```php
// In inc/CustomFunctionality.php or similar

add_action('rest_api_init', function() {
    register_rest_route('core-theme/v1', '/log-error', [
        'methods' => 'POST',
        'callback' => 'handle_error_log',
        'permission_callback' => '__return_true',
    ]);
});

function handle_error_log(WP_REST_Request $request) {
    $error_data = $request->get_json_params();

    // Log to file or database
    error_log(json_encode($error_data));

    // Or send to external service
    // wp_remote_post('https://your-error-tracking-service.com/api', [...]);

    return new WP_REST_Response(['success' => true], 200);
}
```

---

## Summary

The error handling system provides:

- ✅ Centralized error handling with the Error Handler utility
- ✅ Reusable ErrorBoundary component for Vue
- ✅ Global error handlers for unhandled errors
- ✅ Development-friendly logging
- ✅ Production-ready error tracking integration
- ✅ User-friendly error messages
- ✅ Flexible configuration options
- ✅ Comprehensive error context and metadata

For more examples, see the [CUSTOMIZE.md](CUSTOMIZE.md) guide.
