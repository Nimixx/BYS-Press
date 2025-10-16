/**
 * Main TypeScript Entry Point
 *
 * This file initializes the theme, sets up error handlers,
 * and mounts all Vue components based on the component registry.
 *
 * To add new components:
 * 1. Import your component in src/js/config/vueComponents.ts
 * 2. Add it to the vueComponentRegistry array with configuration
 * 3. Components will be automatically mounted on page load
 */

// Import styles
import '../css/main.css';

// Import configuration
import { debugLog, THEME_CONFIG, isDevelopment } from './config';
import { vueComponentRegistry, lazyVueComponentRegistry } from './config/vueComponents';

// Import utilities
import { setupGlobalErrorHandlers } from './utils/errorHandler';
import { mountVueComponents, mountVueComponentLazy } from './utils/vueComponentMount';

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

  // Mount all registered Vue components
  mountVueComponents(vueComponentRegistry);

  // Mount lazy-loaded Vue components
  for (const lazyConfig of lazyVueComponentRegistry) {
    void mountVueComponentLazy(
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

