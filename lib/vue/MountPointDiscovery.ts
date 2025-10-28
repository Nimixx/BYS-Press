/**
 * Mount Point Discovery
 *
 * Discovers Vue component mount points in the DOM.
 * Looks for elements with data-vue-component attribute.
 *
 * @module vue/MountPointDiscovery
 */

import type { MountPoint } from './types';
import { PropsParser } from './PropsParser';

/**
 * Mount Point Discovery class
 * Handles DOM querying for Vue components
 */
export class MountPointDiscovery {
  /**
   * Discover all Vue mount points in the DOM
   *
   * Looks for elements with data-vue-component="ComponentName"
   *
   * @returns Array of mount point configurations
   *
   * @example
   * // HTML: <div data-vue-component="Counter" data-eager data-props='{"count": 5}'></div>
   * const points = MountPointDiscovery.findAll();
   * // Returns: [{ element, componentName: "Counter", eager: true, props: { count: 5 } }]
   */
  static findAll(): MountPoint[] {
    const mountPoints: MountPoint[] = [];

    // Find all elements with data-vue-component attribute
    const elements = document.querySelectorAll('[data-vue-component]');

    elements.forEach((element) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      const mountPoint = this.extractMountPoint(element);
      if (mountPoint) {
        mountPoints.push(mountPoint);
      }
    });

    return mountPoints;
  }

  /**
   * Extract mount point configuration from an element
   *
   * @param element - HTML element with data-vue-component attribute
   * @returns Mount point configuration or null if invalid
   */
  private static extractMountPoint(element: HTMLElement): MountPoint | null {
    const componentName = element.getAttribute('data-vue-component');

    if (!componentName) {
      return null;
    }

    const eager = element.hasAttribute('data-eager');
    const props = PropsParser.extractFromElement(element, componentName);

    return {
      element,
      componentName,
      eager,
      props,
    };
  }

  /**
   * Find mount points for a specific component
   *
   * @param componentName - Name of component to find
   * @returns Array of mount points for the component
   */
  static findByComponent(componentName: string): MountPoint[] {
    return this.findAll().filter(point => point.componentName === componentName);
  }

  /**
   * Find eager-loading mount points
   *
   * @returns Array of mount points marked with data-eager
   */
  static findEager(): MountPoint[] {
    return this.findAll().filter(point => point.eager);
  }

  /**
   * Find lazy-loading mount points
   *
   * @returns Array of mount points without data-eager
   */
  static findLazy(): MountPoint[] {
    return this.findAll().filter(point => !point.eager);
  }
}
