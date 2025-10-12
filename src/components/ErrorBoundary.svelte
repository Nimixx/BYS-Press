<script lang="ts">
  /**
   * ErrorBoundary Component
   *
   * A reusable error boundary for Svelte components that catches and handles
   * errors gracefully, preventing the entire app from crashing
   *
   * Usage:
   * <ErrorBoundary componentName="MyComponent">
   *   <MyComponent />
   * </ErrorBoundary>
   */

  import { onMount, onDestroy } from 'svelte';
  import {
    handleComponentError,
    getUserFriendlyErrorMessage,
    ErrorSeverity,
    type ErrorContext,
  } from '../js/utils/errorHandler';

  // Props
  interface Props {
    /** Name of the component being wrapped (for error tracking) */
    componentName?: string;
    /** Custom fallback UI (function that returns a component) */
    fallback?: (error: Error, reset: () => void) => any;
    /** Whether to show error details in production */
    showDetails?: boolean;
    /** Error severity level */
    severity?: ErrorSeverity;
    /** Callback when error occurs */
    onError?: (error: Error, errorInfo: ErrorContext) => void;
    /** Children components */
    children?: any;
  }

  let {
    componentName = 'Unknown Component',
    fallback,
    showDetails = false,
    severity = ErrorSeverity.MEDIUM,
    onError,
    children,
  }: Props = $props();

  // State
  let hasError = $state(false);
  let error = $state<Error | null>(null);
  let errorCount = $state(0);

  /**
   * Handle caught errors
   */
  function catchError(err: Error | Event) {
    const actualError = err instanceof Error ? err : new Error(String(err));

    error = actualError;
    hasError = true;
    errorCount++;

    // Log error
    const errorContext: ErrorContext = {
      componentName,
      action: 'Component Render',
      metadata: {
        errorCount,
        timestamp: new Date().toISOString(),
      },
    };

    handleComponentError(actualError, errorContext, severity);

    // Custom error handler
    if (onError) {
      try {
        onError(actualError, errorContext);
      } catch (handlerError) {
        console.error('Error in ErrorBoundary onError handler:', handlerError);
      }
    }
  }

  /**
   * Reset error state
   */
  function reset() {
    hasError = false;
    error = null;
  }

  /**
   * Handle component mount
   */
  onMount(() => {
    // Set up error event listener
    window.addEventListener('error', catchError);
    window.addEventListener('unhandledrejection', (event) => {
      catchError(new Error(event.reason?.message || String(event.reason)));
    });
  });

  /**
   * Clean up event listeners
   */
  onDestroy(() => {
    window.removeEventListener('error', catchError);
  });

  // Derived values
  const isProduction = import.meta.env.PROD;
  const userFriendlyMessage = $derived(
    error ? getUserFriendlyErrorMessage(error) : '',
  );
</script>

{#if hasError && error}
  {#if fallback}
    <!-- Custom fallback UI -->
    {@render fallback(error, reset)}
  {:else}
    <!-- Default fallback UI -->
    <div class="error-boundary">
      <div class="error-boundary__content">
        <div class="error-boundary__icon" role="img" aria-label="Error">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <h3 class="error-boundary__title">Oops! Something went wrong</h3>

        <p class="error-boundary__message">
          {userFriendlyMessage}
        </p>

        {#if (!isProduction || showDetails) && error}
          <details class="error-boundary__details">
            <summary>Error Details</summary>
            <div class="error-boundary__error-info">
              <p><strong>Component:</strong> {componentName}</p>
              <p><strong>Error:</strong> {error.message}</p>
              {#if error.stack}
                <pre class="error-boundary__stack">{error.stack}</pre>
              {/if}
            </div>
          </details>
        {/if}

        <button class="error-boundary__button" onclick={reset} type="button">
          Try Again
        </button>
      </div>
    </div>
  {/if}
{:else}
  <!-- Render children when no error -->
  {@render children?.()}
{/if}

<style>
  .error-boundary {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    padding: 2rem;
    background: #fef2f2;
    border: 2px solid #fecaca;
    border-radius: 8px;
    margin: 1rem 0;
  }

  .error-boundary__content {
    text-align: center;
    max-width: 500px;
  }

  .error-boundary__icon {
    color: #dc2626;
    margin-bottom: 1rem;
    display: inline-block;
  }

  .error-boundary__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #991b1b;
    margin-bottom: 0.5rem;
  }

  .error-boundary__message {
    color: #7f1d1d;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .error-boundary__details {
    margin-bottom: 1.5rem;
    text-align: left;
    background: white;
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid #fecaca;
  }

  .error-boundary__details summary {
    cursor: pointer;
    font-weight: 600;
    color: #991b1b;
    user-select: none;
    margin-bottom: 0.5rem;
  }

  .error-boundary__details summary:hover {
    color: #7f1d1d;
  }

  .error-boundary__error-info {
    font-size: 0.875rem;
    color: #7f1d1d;
  }

  .error-boundary__error-info p {
    margin: 0.5rem 0;
  }

  .error-boundary__stack {
    font-size: 0.75rem;
    font-family: 'Monaco', 'Courier New', monospace;
    background: #fef2f2;
    padding: 0.75rem;
    border-radius: 4px;
    overflow-x: auto;
    margin-top: 0.75rem;
    color: #7f1d1d;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .error-boundary__button {
    background: #dc2626;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .error-boundary__button:hover {
    background: #b91c1c;
  }

  .error-boundary__button:active {
    background: #991b1b;
  }

  .error-boundary__button:focus {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }
</style>
