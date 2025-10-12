/**
 * Component Mounting Utilities
 *
 * Provides utilities for mounting Svelte components with error boundaries
 * and proper error handling
 *
 * @module utils/componentMount
 */

import { mount } from 'svelte';
import type { Component } from 'svelte';
import ErrorBoundary from '../../components/ErrorBoundary.svelte';
import { handleComponentError, logWarning, ErrorSeverity } from './errorHandler';
import { debugLog, isDevelopment } from '../config';

/**
 * Component mount configuration
 */
export interface ComponentConfig {
  /** Svelte component to mount */
  component: Component;
  /** DOM element ID to mount to */
  elementId: string;
  /** Component name for error tracking */
  name: string;
  /** Whether this component is required on the page */
  required?: boolean;
  /** Condition function to check if component should mount */
  condition?: () => boolean;
  /** Custom props to pass to the component */
  props?: Record<string, any>;
}

/**
 * Check if we should warn about missing element
 *
 * @param elementId - Element ID
 * @param required - Whether the element is required
 */
function shouldWarnAboutMissingElement(
  elementId: string,
  required: boolean = false,
): boolean {
  // If explicitly marked as required, always warn
  if (required) {
    return true;
  }

  // Add logic to check if element is expected on current page
  const pageClasses = document.body.classList;

  // Example: Counter is required on front page
  if (
    elementId === 'svelte-counter' &&
    pageClasses.contains('page-template-front-page')
  ) {
    return true;
  }

  // Add more conditions as needed
  return false;
}

/**
 * Mount a Svelte component with error boundary
 *
 * @param config - Component configuration
 * @returns True if mounted successfully, false otherwise
 */
export function mountComponent(config: ComponentConfig): boolean {
  const { component, elementId, name, required = false, condition, props = {} } = config;

  // Check condition if provided
  if (condition && !condition()) {
    debugLog(`Skipping ${name} - condition not met`);
    return false;
  }

  const element = document.getElementById(elementId);

  if (!element) {
    // Only warn if we expect the element to exist
    if (shouldWarnAboutMissingElement(elementId, required)) {
      logWarning(`Mount point #${elementId} not found`, {
        componentName: name,
        action: 'Component Mount',
      });
    }
    return false;
  }

  try {
    // Mount component wrapped in ErrorBoundary
    mount(ErrorBoundary, {
      target: element,
      props: {
        componentName: name,
        children: () => {
          return mount(component, {
            target: element,
            props,
          });
        },
      },
    });

    debugLog(`${name} mounted successfully`);
    return true;
  } catch (error) {
    handleComponentError(
      error as Error,
      {
        componentName: name,
        action: 'Mount Component',
        metadata: { elementId },
      },
      ErrorSeverity.HIGH,
    );

    // Show minimal error message using CSS classes (no inline styles)
    // Only in development - in production, leave element empty for security
    if (isDevelopment) {
      element.className = 'component-error';
      element.textContent = 'Failed to load component. Check console for details.';
    }

    return false;
  }
}

/**
 * Mount multiple components from configuration array
 *
 * @param configs - Array of component configurations
 * @returns Object with mount results
 */
export function mountComponents(
  configs: ComponentConfig[],
): { mounted: number; failed: number; skipped: number } {
  const results = {
    mounted: 0,
    failed: 0,
    skipped: 0,
  };

  for (const config of configs) {
    const result = mountComponent(config);

    if (result === false) {
      // Check if it was skipped (condition not met) or failed
      const element = document.getElementById(config.elementId);
      if (!element || (config.condition && !config.condition())) {
        results.skipped++;
      } else {
        results.failed++;
      }
    } else {
      results.mounted++;
    }
  }

  debugLog('Component mounting complete', results);
  return results;
}

/**
 * Lazy load and mount a component
 *
 * Useful for code splitting - components are loaded only when needed
 *
 * @param config - Component configuration (component can be a Promise)
 * @param loader - Function that returns a promise resolving to the component
 * @returns Promise that resolves to mount result
 */
export async function mountComponentLazy(
  config: Omit<ComponentConfig, 'component'>,
  loader: () => Promise<{ default: Component }>,
): Promise<boolean> {
  try {
    const module = await loader();
    return mountComponent({
      ...config,
      component: module.default,
    });
  } catch (error) {
    handleComponentError(
      error as Error,
      {
        componentName: config.name,
        action: 'Lazy Load Component',
        metadata: { elementId: config.elementId },
      },
      ErrorSeverity.HIGH,
    );
    return false;
  }
}
