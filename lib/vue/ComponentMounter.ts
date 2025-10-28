/**
 * Component Mounter
 *
 * Handles mounting Vue components to DOM elements.
 * Manages Vue app creation and error handling.
 *
 * @module vue/ComponentMounter
 */

import { createApp, type Component as VueComponent } from 'vue';
import { debugLog, isDevelopment } from '../config';
import { handleComponentError, ErrorSeverity } from '../utils/errorHandler';
import type { ComponentErrorContext } from './types';

/**
 * Component Mounter class
 * Handles Vue component mounting logic
 */
export class ComponentMounter {
  /**
   * Mount a Vue component to a DOM element
   *
   * @param component - Vue component to mount
   * @param element - DOM element to mount to
   * @param props - Props to pass to component
   * @param componentName - Component name for debugging
   * @returns True if mount succeeded, false otherwise
   *
   * @example
   * const Counter = await import('./Counter.vue').then(m => m.default);
   * ComponentMounter.mount(Counter, element, { initialValue: 0 }, 'Counter');
   */
  static mount(
    component: VueComponent,
    element: HTMLElement,
    props: Record<string, unknown>,
    componentName: string
  ): boolean {
    try {
      const app = createApp(component, props);
      app.mount(element);
      debugLog(`${componentName} mounted successfully`);
      return true;
    } catch (error) {
      this.handleMountError(error as Error, {
        componentName,
        action: 'Mount Vue Component',
        metadata: { elementId: element.id, props },
      }, element);
      return false;
    }
  }

  /**
   * Handle mount errors with appropriate logging and user feedback
   *
   * @param error - Error that occurred
   * @param context - Error context information
   * @param element - DOM element where error occurred
   */
  private static handleMountError(
    error: Error,
    context: ComponentErrorContext,
    element: HTMLElement
  ): void {
    handleComponentError(error, context, ErrorSeverity.HIGH);

    // Show error feedback only in development
    if (isDevelopment) {
      element.className = 'component-error';
      element.style.padding = 'var(--space-4)';
      element.style.color = 'var(--color-error)';
      element.style.border = '1px solid var(--color-error)';
      element.style.borderRadius = 'var(--radius-sm)';
      element.textContent = `Failed to load ${context.componentName}. Check console for details.`;
    }
  }
}
