// Main TypeScript Entry Point
import '../css/main.css';
import { mount } from 'svelte';
import Counter from '../components/Counter.svelte';
import ErrorBoundary from '../components/ErrorBoundary.svelte';
import { debugLog, THEME_CONFIG, isDevelopment } from './config';
import {
  setupGlobalErrorHandlers,
  handleComponentError,
  logWarning,
  ErrorSeverity,
} from './utils/errorHandler';

// Set up global error handlers
setupGlobalErrorHandlers();

// Log theme initialization (only in development)
if (isDevelopment) {
  debugLog('Core Theme loaded!', {
    version: THEME_CONFIG.version,
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
  });
}

/**
 * Mount a Svelte component with error boundary
 *
 * @param Component - Svelte component to mount
 * @param elementId - DOM element ID to mount to
 * @param componentName - Name for error tracking
 */
function mountWithErrorBoundary(
  Component: any,
  elementId: string,
  componentName: string,
): void {
  const element = document.getElementById(elementId);

  if (!element) {
    // Only warn if we expect the element to exist
    if (shouldWarnAboutMissingElement(elementId)) {
      logWarning(`Mount point #${elementId} not found`, {
        componentName,
        action: 'Component Mount',
      });
    }
    return;
  }

  try {
    // Mount component wrapped in ErrorBoundary
    mount(ErrorBoundary, {
      target: element,
      props: {
        componentName,
        children: () => {
          return mount(Component, { target: element });
        },
      },
    });

    debugLog(`${componentName} mounted successfully`);
  } catch (error) {
    handleComponentError(
      error as Error,
      {
        componentName,
        action: 'Mount Component',
        metadata: { elementId },
      },
      ErrorSeverity.HIGH,
    );

    // Show user-friendly error in the mount point
    element.innerHTML = `
      <div style="padding: 1rem; background: #fef2f2; border: 2px solid #fecaca; border-radius: 8px; color: #991b1b;">
        <strong>Failed to load component.</strong>
        <p style="margin: 0.5rem 0 0 0;">Please refresh the page or contact support if the problem persists.</p>
      </div>
    `;
  }
}

/**
 * Check if we should warn about missing element
 *
 * @param elementId - Element ID
 */
function shouldWarnAboutMissingElement(elementId: string): boolean {
  // Add logic to check if element is expected on current page
  const pageClasses = document.body.classList;

  if (elementId === 'svelte-counter' && pageClasses.contains('page-template-front-page')) {
    return true;
  }

  // Add more conditions as needed
  return false;
}

// Mount components
mountWithErrorBoundary(Counter, 'svelte-counter', 'Counter');

