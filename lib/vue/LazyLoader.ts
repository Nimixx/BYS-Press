/**
 * Lazy Loader
 *
 * Uses Intersection Observer to lazy load Vue components
 * when they become visible in the viewport.
 *
 * @module vue/LazyLoader
 */

import { debugLog } from '../config';
import { ComponentRegistry } from './ComponentRegistry';
import { ComponentMounter } from './ComponentMounter';

/**
 * Lazy Loader configuration
 */
interface LazyLoaderConfig {
  /** Margin around viewport to trigger loading (default: "100px") */
  rootMargin?: string;
  /** Percentage of element visible to trigger loading (default: 0.1) */
  threshold?: number;
}

/**
 * Lazy Loader class
 * Handles viewport-based lazy loading of components
 */
export class LazyLoader {
  private static readonly DEFAULT_CONFIG: Required<LazyLoaderConfig> = {
    rootMargin: '100px',
    threshold: 0.1,
  };

  /**
   * Lazy load component when element becomes visible
   *
   * @param element - Element to observe
   * @param componentName - Name of component to load
   * @param modulePath - Path to component module
   * @param props - Props to pass to component
   * @param config - Intersection Observer configuration
   *
   * @example
   * LazyLoader.whenVisible(element, 'PhotoGallery', modulePath, { images: [] });
   */
  static whenVisible(
    element: HTMLElement,
    componentName: string,
    modulePath: string,
    props: Record<string, unknown>,
    config: LazyLoaderConfig = {}
  ): void {
    const observerConfig = { ...this.DEFAULT_CONFIG, ...config };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadComponent(element, componentName, modulePath, props, observer);
          }
        });
      },
      {
        rootMargin: observerConfig.rootMargin,
        threshold: observerConfig.threshold,
      }
    );

    observer.observe(element);
    debugLog(`${componentName} lazy-load observer registered`);
  }

  /**
   * Load component module and mount it
   *
   * @param element - Element to mount component to
   * @param componentName - Name of component
   * @param modulePath - Path to component module
   * @param props - Props to pass to component
   * @param observer - Intersection Observer to disconnect after loading
   */
  private static loadComponent(
    element: HTMLElement,
    componentName: string,
    modulePath: string,
    props: Record<string, unknown>,
    observer: IntersectionObserver
  ): void {
    debugLog(`${componentName} entering viewport, loading...`);

    const loader = ComponentRegistry.getModuleLoader(modulePath);

    loader()
      .then((module) => {
        ComponentMounter.mount(module.default, element, props, componentName);
      })
      .catch((error) => {
        console.error(`[Vue] Failed to lazy load ${componentName}:`, error, { modulePath });
      })
      .finally(() => {
        observer.disconnect();
      });
  }
}
