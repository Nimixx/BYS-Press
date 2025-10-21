/**
 * Vue Component Mounting Utilities
 *
 * Provides utilities for mounting Vue components with error handling
 * Compatible with the existing component mounting system
 *
 * @module utils/vueComponentMount
 */

import { createApp, type Component as VueComponent, type App } from 'vue';
import { handleComponentError, logWarning, ErrorSeverity } from './errorHandler';
import { debugLog, isDevelopment } from '../config';

// Import types from central location
import type { ComponentConfig } from '../../types/components';

/**
 * @deprecated Use ComponentConfig from '../../types/components' instead
 * Kept for backward compatibility
 */
export type VueComponentConfig = ComponentConfig;

/**
 * Stored Vue app instances for cleanup
 */
const vueApps: Map<string, App> = new Map();

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
    elementId === 'vue-counter' &&
    pageClasses.contains('page-template-front-page')
  ) {
    return true;
  }

  // Add more conditions as needed
  return false;
}

/**
 * Mount a Vue component
 *
 * @param config - Component configuration
 * @returns True if mounted successfully, false otherwise
 */
export function mountVueComponent(config: ComponentConfig): boolean {
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
        action: 'Vue Component Mount',
      });
    }
    return false;
  }

  try {
    // Create Vue app instance
    const app = createApp(component, props);

    // Mount the app
    app.mount(element);

    // Store app instance for potential cleanup
    vueApps.set(elementId, app);

    debugLog(`${name} mounted successfully (Vue)`);
    return true;
  } catch (error) {
    handleComponentError(
      error as Error,
      {
        componentName: name,
        action: 'Mount Vue Component',
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
 * Mount multiple Vue components from configuration array
 *
 * @param configs - Array of Vue component configurations
 * @returns Object with mount results
 */
export function mountVueComponents(
  configs: ComponentConfig[],
): { mounted: number; failed: number; skipped: number } {
  const results = {
    mounted: 0,
    failed: 0,
    skipped: 0,
  };

  for (const config of configs) {
    const result = mountVueComponent(config);

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

  debugLog('Vue component mounting complete', results);
  return results;
}

/**
 * Lazy load and mount a Vue component
 *
 * Useful for code splitting - components are loaded only when needed
 *
 * @param config - Component configuration (component can be a Promise)
 * @param loader - Function that returns a promise resolving to the component
 * @returns Promise that resolves to mount result
 */
export async function mountVueComponentLazy(
  config: Omit<ComponentConfig, 'component'>,
  loader: () => Promise<{ default: VueComponent }>,
): Promise<boolean> {
  try {
    const module = await loader();
    return mountVueComponent({
      ...config,
      component: module.default,
    });
  } catch (error) {
    handleComponentError(
      error as Error,
      {
        componentName: config.name,
        action: 'Lazy Load Vue Component',
        metadata: { elementId: config.elementId },
      },
      ErrorSeverity.HIGH,
    );
    return false;
  }
}

/**
 * Unmount a Vue component by element ID
 *
 * @param elementId - The element ID where the component is mounted
 * @returns True if unmounted successfully, false otherwise
 */
export function unmountVueComponent(elementId: string): boolean {
  const app = vueApps.get(elementId);

  if (!app) {
    debugLog(`No Vue app found for element #${elementId}`);
    return false;
  }

  try {
    app.unmount();
    vueApps.delete(elementId);
    debugLog(`Vue component unmounted from #${elementId}`);
    return true;
  } catch (error) {
    handleComponentError(
      error as Error,
      {
        componentName: elementId,
        action: 'Unmount Vue Component',
        metadata: { elementId },
      },
      ErrorSeverity.MEDIUM,
    );
    return false;
  }
}

/**
 * Unmount all Vue components
 */
export function unmountAllVueComponents(): void {
  vueApps.forEach((app, elementId) => {
    try {
      app.unmount();
      debugLog(`Vue component unmounted from #${elementId}`);
    } catch (error) {
      handleComponentError(
        error as Error,
        {
          componentName: elementId,
          action: 'Unmount All Vue Components',
          metadata: { elementId },
        },
        ErrorSeverity.LOW,
      );
    }
  });
  vueApps.clear();
}
