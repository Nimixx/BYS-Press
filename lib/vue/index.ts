/**
 * Vue Component Auto-Discovery System
 *
 * Automatically discovers and mounts Vue components based on DOM elements.
 * Components are lazy-loaded by default using Intersection Observer.
 *
 * Usage in Twig:
 * - Eager: <div data-vue-component="ComponentName" data-eager></div>
 * - Lazy: <div data-vue-component="ComponentName"></div>
 * - With props: <div data-vue-component="ComponentName" data-props='{"key": "value"}'></div>
 *
 * Component structure:
 * components/ComponentName/ComponentName.vue
 *
 * @module vue
 */

import { debugLog } from '../config';
import { ComponentRegistry } from './ComponentRegistry';
import { ComponentMounter } from './ComponentMounter';
import { LazyLoader } from './LazyLoader';
import { MountPointDiscovery } from './MountPointDiscovery';
import type { MountStats } from './types';

/**
 * Auto-mount all discovered Vue components
 *
 * Called automatically on page load via lib/main.ts
 * Components are mounted based on:
 * - Eager loading (data-eager): Load immediately
 * - Lazy loading (default): Load when visible
 *
 * @example
 * // In your main.ts
 * import { autoMountVueComponents } from './vue';
 * autoMountVueComponents();
 */
export function autoMountVueComponents(): void {
  const mountPoints = MountPointDiscovery.findAll();

  if (mountPoints.length === 0) {
    debugLog('No Vue component mount points found');
    return;
  }

  debugLog(`Found ${mountPoints.length} Vue component mount point(s)`);

  const stats: MountStats = {
    eager: 0,
    lazy: 0,
    notFound: 0,
    total: mountPoints.length,
  };

  for (const { element, componentName, eager, props } of mountPoints) {
    const modulePath = ComponentRegistry.findModulePath(componentName);

    if (!modulePath) {
      handleMissingComponent(componentName, stats);
      continue;
    }

    if (eager) {
      mountEagerComponent(element, componentName, modulePath, props, stats);
    } else {
      mountLazyComponent(element, componentName, modulePath, props, stats);
    }
  }

  debugLog('Vue component auto-mount complete', stats);
}

/**
 * Handle missing component error
 */
function handleMissingComponent(componentName: string, stats: MountStats): void {
  console.warn(`[Vue] Component not found: ${componentName}`, {
    availableComponents: ComponentRegistry.getAvailableComponents(),
  });
  stats.notFound++;
}

/**
 * Mount component eagerly (immediately)
 */
function mountEagerComponent(
  element: HTMLElement,
  componentName: string,
  modulePath: string,
  props: Record<string, unknown>,
  stats: MountStats
): void {
  const loader = ComponentRegistry.getModuleLoader(modulePath);

  loader()
    .then(module => {
      const success = ComponentMounter.mount(module.default, element, props, componentName);
      if (success) {
        stats.eager++;
      }
    })
    .catch(() => {
      // Error already handled by ComponentMounter
    });
}

/**
 * Mount component lazily (when visible)
 */
function mountLazyComponent(
  element: HTMLElement,
  componentName: string,
  modulePath: string,
  props: Record<string, unknown>,
  stats: MountStats
): void {
  LazyLoader.whenVisible(element, componentName, modulePath, props);
  stats.lazy++;
}

/**
 * Get list of available components for debugging
 *
 * @returns Array of component names
 *
 * @example
 * const components = getAvailableComponents();
 * console.log('Available components:', components);
 */
export function getAvailableComponents(): string[] {
  return ComponentRegistry.getAvailableComponents();
}

// Re-export types for external use
export type { MountPoint, MountStats, ComponentModule } from './types';
