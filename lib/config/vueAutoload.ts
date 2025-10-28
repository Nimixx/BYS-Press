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
 * @module config/vueAutoload
 */

import { createApp, type Component as VueComponent } from 'vue';
import { debugLog, isDevelopment } from '../config';
import { handleComponentError, logWarning, ErrorSeverity } from '../utils/errorHandler';

/**
 * Component module type from Vite glob import
 */
interface ComponentModule {
  default: VueComponent;
}

/**
 * Auto-discover all Vue components using Vite's glob import
 * Lazy loading by default - components load only when needed
 */
const componentModules = import.meta.glob<ComponentModule>(
  '../../components/**/*.vue',
  { eager: false }
);

/**
 * Mount point configuration
 */
interface MountPoint {
  element: HTMLElement;
  componentName: string;
  eager: boolean;
  props: Record<string, unknown>;
}

/**
 * Extract component name from file path
 *
 * @param path - File path from glob (e.g., "../../components/Counter/Counter.vue")
 * @returns Component name (e.g., "Counter") or empty string if pattern doesn't match
 *
 * @example
 * getComponentName("../../components/Counter/Counter.vue") // "Counter"
 * getComponentName("../../components/PhotoGallery/PhotoGallery.vue") // "PhotoGallery"
 */
function getComponentName(path: string): string {
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
function findComponentModule(componentName: string): string | undefined {
  return Object.keys(componentModules).find(path =>
    getComponentName(path) === componentName
  );
}

/**
 * Parse JSON props from data attribute safely
 *
 * @param propsString - JSON string from data-props attribute
 * @param componentName - Component name for error reporting
 * @returns Parsed props object or empty object on error
 */
function parseProps(propsString: string, componentName: string): Record<string, unknown> {
  if (!propsString) return {};

  try {
    return JSON.parse(propsString) as Record<string, unknown>;
  } catch (error) {
    logWarning(`Failed to parse props for ${componentName}`, {
      action: 'Parse Component Props',
      metadata: { propsString, error: (error as Error).message },
    });
    return {};
  }
}

/**
 * Mount a Vue component to a DOM element
 *
 * @param component - Vue component to mount
 * @param element - DOM element to mount to
 * @param props - Props to pass to component
 * @param componentName - Component name for debugging
 */
function mountComponent(
  component: VueComponent,
  element: HTMLElement,
  props: Record<string, unknown>,
  componentName: string
): void {
  try {
    const app = createApp(component, props);
    app.mount(element);
    debugLog(`${componentName} mounted successfully (auto-discovered)`);
  } catch (error) {
    handleComponentError(
      error as Error,
      {
        componentName,
        action: 'Auto-Mount Vue Component',
        metadata: { elementId: element.id, props },
      },
      ErrorSeverity.HIGH,
    );

    // Show error only in development
    if (isDevelopment) {
      element.className = 'component-error';
      element.textContent = `Failed to load ${componentName}. Check console for details.`;
    }
  }
}

/**
 * Lazy load component when element becomes visible
 * Uses Intersection Observer for optimal performance
 *
 * @param element - Element to observe
 * @param componentName - Name of component to load
 * @param modulePath - Path to component module
 * @param props - Props to pass to component
 */
function lazyLoadWhenVisible(
  element: HTMLElement,
  componentName: string,
  modulePath: string,
  props: Record<string, unknown>
): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          debugLog(`${componentName} entering viewport, loading...`);

          // Load component module
          componentModules[modulePath]()
            .then(module => {
              mountComponent(module.default, element, props, componentName);
            })
            .catch(error => {
              handleComponentError(
                error as Error,
                {
                  componentName,
                  action: 'Lazy Load Vue Component',
                  metadata: { modulePath },
                },
                ErrorSeverity.HIGH,
              );
            })
            .finally(() => {
              observer.disconnect();
            });
        }
      });
    },
    {
      // Load 100px before element enters viewport
      rootMargin: '100px',
      // Trigger when at least 10% of element is visible
      threshold: 0.1,
    }
  );

  observer.observe(element);
  debugLog(`${componentName} lazy-load observer registered`);
}

/**
 * Discover all Vue mount points in the DOM
 *
 * Looks for elements with data-vue-component="ComponentName"
 *
 * @returns Array of mount point configurations
 */
function discoverMountPoints(): MountPoint[] {
  const mountPoints: MountPoint[] = [];

  // Find all elements with data-vue-component attribute
  document.querySelectorAll('[data-vue-component]').forEach((element) => {
    if (!(element instanceof HTMLElement)) return;

    const componentName = element.getAttribute('data-vue-component');
    if (!componentName) return;

    const eager = element.hasAttribute('data-eager');
    const propsString = element.getAttribute('data-props') || '';
    const props = parseProps(propsString, componentName);

    mountPoints.push({
      element,
      componentName,
      eager,
      props,
    });
  });

  return mountPoints;
}

/**
 * Auto-mount all discovered Vue components
 *
 * Called automatically on page load via lib/main.ts
 * Components are mounted based on:
 * - Eager loading (data-eager): Load immediately
 * - Lazy loading (default): Load when visible
 */
export function autoMountVueComponents(): void {
  const mountPoints = discoverMountPoints();

  if (mountPoints.length === 0) {
    debugLog('No Vue component mount points found');
    return;
  }

  debugLog(`Found ${mountPoints.length} Vue component mount point(s)`);

  let mounted = 0;
  let lazy = 0;
  let notFound = 0;

  for (const { element, componentName, eager, props } of mountPoints) {
    const modulePath = findComponentModule(componentName);

    if (!modulePath) {
      logWarning(`Component not found: ${componentName}`, {
        action: 'Auto-Mount Vue Components',
        metadata: {
          element: element.tagName,
          availableComponents: Object.keys(componentModules).map(getComponentName).filter(Boolean),
        },
      });
      notFound++;
      continue;
    }

    if (eager) {
      // Eager load immediately
      componentModules[modulePath]()
        .then(module => {
          mountComponent(module.default, element, props, componentName);
          mounted++;
        })
        .catch(error => {
          handleComponentError(
            error as Error,
            {
              componentName,
              action: 'Eager Load Vue Component',
              metadata: { modulePath },
            },
            ErrorSeverity.HIGH,
          );
        });
    } else {
      // Lazy load when visible
      lazyLoadWhenVisible(element, componentName, modulePath, props);
      lazy++;
    }
  }

  debugLog('Vue component auto-mount complete', {
    eager: mounted,
    lazy,
    notFound,
    total: mountPoints.length,
  });
}

/**
 * Get list of available components for debugging
 *
 * @returns Array of component names
 */
export function getAvailableComponents(): string[] {
  return Object.keys(componentModules)
    .map(getComponentName)
    .filter(Boolean)
    .sort();
}
