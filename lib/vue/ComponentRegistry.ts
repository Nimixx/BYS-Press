/**
 * Component Registry
 *
 * Discovers and manages Vue components using Vite's glob import.
 * Handles component name extraction and lookup.
 *
 * @module vue/ComponentRegistry
 */

import type { ComponentModule } from './types';

/**
 * Auto-discover all Vue components using Vite's glob import
 * Lazy loading by default - components load only when needed
 */
const componentModules = import.meta.glob<ComponentModule>('../../components/**/*.vue', {
  eager: false,
});

/**
 * Component Registry class
 * Manages component discovery and lookup
 */
export class ComponentRegistry {
  /**
   * Extract component name from file path
   *
   * @param path - File path from glob (e.g., "../../components/Counter/Counter.vue")
   * @returns Component name (e.g., "Counter") or empty string if pattern doesn't match
   *
   * @example
   * extractComponentName("../../components/Counter/Counter.vue") // "Counter"
   * extractComponentName("../../components/PhotoGallery/PhotoGallery.vue") // "PhotoGallery"
   */
  private static extractComponentName(path: string): string {
    // Match pattern: components/ComponentName/ComponentName.vue
    // Group 1 captures the component name
    const match = path.match(/components\/([^/]+)\/\1\.vue$/);
    return match?.[1] ?? '';
  }

  /**
   * Find component module path by component name
   *
   * @param componentName - Name of the component to find
   * @returns Module path if found, undefined otherwise
   */
  static findModulePath(componentName: string): string | undefined {
    return Object.keys(componentModules).find(
      (path) => this.extractComponentName(path) === componentName
    );
  }

  /**
   * Get component module loader function
   *
   * @param modulePath - Path to component module
   * @returns Loader function that returns a promise
   * @throws Error if module path doesn't exist
   */
  static getModuleLoader(modulePath: string): () => Promise<ComponentModule> {
    const loader = componentModules[modulePath];

    if (!loader) {
      throw new Error(
        `Component module not found: ${modulePath}. Available components: ${this.getAvailableComponents().join(', ')}`
      );
    }

    return loader;
  }

  /**
   * Get list of all available components
   *
   * @returns Array of component names sorted alphabetically
   */
  static getAvailableComponents(): string[] {
    return Object.keys(componentModules)
      .map((path) => this.extractComponentName(path))
      .filter(Boolean)
      .sort();
  }

  /**
   * Check if component exists
   *
   * @param componentName - Name of component to check
   * @returns True if component exists
   */
  static hasComponent(componentName: string): boolean {
    return this.findModulePath(componentName) !== undefined;
  }
}
