/**
 * Main TypeScript Entry Point
 *
 * This file initializes the theme, sets up error handlers,
 * and mounts all Svelte components based on the component registry.
 *
 * To add new components:
 * 1. Import your component in src/js/config/components.ts
 * 2. Add it to the componentRegistry array with configuration
 * 3. Components will be automatically mounted on page load
 */

// Import styles
import '../css/main.css';

// Import configuration
import { debugLog, THEME_CONFIG, isDevelopment } from './config';
import { componentRegistry, lazyComponentRegistry } from './config/components';

// Import utilities
import { setupGlobalErrorHandlers } from './utils/errorHandler';
import { mountComponents, mountComponentLazy } from './utils/componentMount';

/**
 * Initialize theme
 */
function initTheme(): void {
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

  // Mount all registered components
  mountComponents(componentRegistry);

  // Mount lazy-loaded components
  for (const lazyConfig of lazyComponentRegistry) {
    mountComponentLazy(
      {
        elementId: lazyConfig.elementId,
        name: lazyConfig.name,
        condition: lazyConfig.condition,
        required: lazyConfig.required,
        props: lazyConfig.props,
      },
      lazyConfig.loader,
    );
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

