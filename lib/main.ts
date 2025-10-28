/**
 * Main TypeScript Entry Point
 *
 * This file initializes the theme, sets up error handlers,
 * and mounts all Vue components based on the component registry.
 *
 * To add new components:
 * 1. Import your component in lib/config/vueComponents.ts
 * 2. Add it to the vueComponentRegistry array with configuration
 * 3. Components will be automatically mounted on page load
 */

// Import design tokens and global styles
import '../config/tokens.css';
import '../src/css/main.css';

// Import configuration (must be before using debugLog)
import { debugLog, THEME_CONFIG, isDevelopment } from './config';
import { vueComponentRegistry, lazyVueComponentRegistry } from './config/vueComponents';

// Import utilities
import { setupGlobalErrorHandlers } from './utils/errorHandler';
import { mountVueComponents, mountVueComponentLazy } from './utils/vueComponentMount';

/**
 * Auto-loader System
 *
 * Automatically imports all component assets from the component-based structure.
 * Uses Vite's import.meta.glob for automatic discovery.
 *
 * CSS: Eager loading - bundles all styles into main.css
 * TypeScript: Eager loading - bundles all behaviors into main.js
 *
 * When you add a new component with .css or .ts files, they're automatically included!
 *
 * Note: Variables prefixed with _ indicate intentionally unused - the import side-effect
 * is what matters, not the returned module objects.
 */

// CSS Auto-loader
const _componentStyles = import.meta.glob('../components/**/*.css', { eager: true });
const _layoutStyles = import.meta.glob('../layouts/**/*.css', { eager: true });
const _pageStyles = import.meta.glob('../pages/**/*.css', { eager: true });

// TypeScript/JavaScript Auto-loader
// Automatically imports component behaviors (e.g., Alert.ts, Button.ts)
const componentBehaviors = import.meta.glob('../components/**/*.ts', { eager: true });
const pageBehaviors = import.meta.glob('../pages/**/*.ts', { eager: true });

/**
 * Module with optional initAll method
 */
interface ComponentModule {
  initAll?: () => void;
  default?: {
    initAll?: () => void;
  };
}

/**
 * Initialize all component behaviors
 *
 * Automatically calls initAll() on any component that exports it.
 * This allows components to self-initialize their behavior.
 */
function initComponentBehaviors(): void {
  const allBehaviors = { ...componentBehaviors, ...pageBehaviors };

  Object.entries(allBehaviors).forEach(([path, module]) => {
    const typedModule = module as ComponentModule;

    // Call initAll if the module exports it
    if (typedModule && typeof typedModule.initAll === 'function') {
      try {
        typedModule.initAll();
        debugLog(`Initialized behavior: ${path}`);
      } catch (error) {
        console.error(`Failed to initialize behavior ${path}:`, error);
      }
    }

    // Also check default export
    if (typedModule?.default && typeof typedModule.default.initAll === 'function') {
      try {
        typedModule.default.initAll();
        debugLog(`Initialized behavior (default export): ${path}`);
      } catch (error) {
        console.error(`Failed to initialize behavior ${path}:`, error);
      }
    }
  });
}

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

  // Initialize component behaviors (auto-discovered .ts files)
  initComponentBehaviors();

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

