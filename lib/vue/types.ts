/**
 * Vue Component Types
 *
 * Shared TypeScript interfaces for Vue component system
 *
 * @module vue/types
 */

import type { Component as VueComponent } from 'vue';

/**
 * Component module type from Vite glob import
 */
export interface ComponentModule {
  default: VueComponent;
}

/**
 * Mount point configuration
 */
export interface MountPoint {
  element: HTMLElement;
  componentName: string;
  eager: boolean;
  props: Record<string, unknown>;
}

/**
 * Component mount statistics
 */
export interface MountStats {
  eager: number;
  lazy: number;
  notFound: number;
  total: number;
}

/**
 * Component error context
 */
export interface ComponentErrorContext {
  componentName: string;
  action: string;
  metadata?: Record<string, unknown>;
}
