/**
 * Component System Types
 *
 * Type definitions for the Vue component mounting system
 *
 * @module types/components
 */

import type { Component as VueComponent } from 'vue';

/**
 * Component mount configuration
 */
export interface ComponentConfig {
  /** Vue component to mount */
  component: VueComponent;
  /** DOM element ID to mount to */
  elementId: string;
  /** Component name for error tracking */
  name: string;
  /** Whether this component is required on the page */
  required?: boolean;
  /** Condition function to check if component should mount */
  condition?: () => boolean;
  /** Custom props to pass to the component */
  props?: Record<string, any>;
}

/**
 * Lazy component configuration
 */
export interface LazyComponentConfig {
  /** DOM element ID to mount to */
  elementId: string;
  /** Component name for error tracking */
  name: string;
  /** Component loader function */
  loader: () => Promise<{ default: VueComponent }>;
  /** Condition function to check if component should mount */
  condition?: () => boolean;
  /** Whether this component is required on the page */
  required?: boolean;
  /** Custom props to pass to the component */
  props?: Record<string, any>;
}

/**
 * Component mount result
 */
export interface MountResult {
  /** Number of successfully mounted components */
  mounted: number;
  /** Number of failed component mounts */
  failed: number;
  /** Number of skipped components (condition not met) */
  skipped: number;
}

/**
 * Page condition helper functions
 */
export interface PageConditions {
  /** Check if current page is the front page */
  isFrontPage: () => boolean;
  /** Check if current page is a single post */
  isSinglePost: () => boolean;
  /** Check if current page is an archive */
  isArchive: () => boolean;
  /** Check if element exists in DOM */
  elementExists: (id: string) => boolean;
  /** Check for specific body class */
  hasBodyClass: (className: string) => boolean;
}
