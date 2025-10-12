/**
 * Component Registry
 *
 * Central configuration for all Svelte components and their mount points.
 * Add new components here to automatically mount them on the appropriate pages.
 *
 * @module config/components
 */

import type { ComponentConfig } from '../utils/componentMount';
import Counter from '../../components/Counter.svelte';

/**
 * Page condition helpers
 *
 * Reusable functions to check page context
 */
export const pageConditions = {
  /**
   * Check if current page is the front page
   */
  isFrontPage: (): boolean => {
    return document.body.classList.contains('page-template-front-page') ||
           document.body.classList.contains('home');
  },

  /**
   * Check if current page is a single post
   */
  isSinglePost: (): boolean => {
    return document.body.classList.contains('single-post');
  },

  /**
   * Check if current page is an archive
   */
  isArchive: (): boolean => {
    return document.body.classList.contains('archive') ||
           document.body.classList.contains('category') ||
           document.body.classList.contains('tag');
  },

  /**
   * Check if element exists in DOM
   */
  elementExists: (id: string): boolean => {
    return document.getElementById(id) !== null;
  },

  /**
   * Custom condition: Check for specific body class
   */
  hasBodyClass: (className: string): boolean => {
    return document.body.classList.contains(className);
  },
};

/**
 * Component registry
 *
 * Define all your Svelte components here with their mount configurations.
 *
 * Example configurations:
 *
 * 1. Basic component (always tries to mount):
 *    {
 *      component: MyComponent,
 *      elementId: 'my-component',
 *      name: 'MyComponent',
 *    }
 *
 * 2. Required component (warns if mount point missing):
 *    {
 *      component: Header,
 *      elementId: 'site-header',
 *      name: 'Header',
 *      required: true,
 *    }
 *
 * 3. Conditional component (only mounts if condition met):
 *    {
 *      component: BlogSidebar,
 *      elementId: 'blog-sidebar',
 *      name: 'BlogSidebar',
 *      condition: () => pageConditions.isSinglePost(),
 *    }
 *
 * 4. Component with props:
 *    {
 *      component: ProductCard,
 *      elementId: 'product-card',
 *      name: 'ProductCard',
 *      props: { productId: 123, theme: 'dark' },
 *    }
 */
export const componentRegistry: ComponentConfig[] = [
  // Counter Component (Front Page)
  {
    component: Counter,
    elementId: 'svelte-counter',
    name: 'Counter',
    required: false, // Only warn if on front page (handled in componentMount.ts)
    condition: () => pageConditions.elementExists('svelte-counter'),
  },

  // Add more components here as your theme grows
  // Example:
  // {
  //   component: Navigation,
  //   elementId: 'main-navigation',
  //   name: 'Navigation',
  //   required: true,
  // },
  //
  // {
  //   component: ContactForm,
  //   elementId: 'contact-form',
  //   name: 'ContactForm',
  //   condition: () => pageConditions.hasBodyClass('page-template-contact'),
  // },
];

/**
 * Lazy-loaded component registry
 *
 * For larger components that should only be loaded when needed.
 * These components are not bundled in the main JS file.
 *
 * Example:
 * {
 *   elementId: 'heavy-chart',
 *   name: 'ChartComponent',
 *   loader: () => import('../../components/Chart.svelte'),
 *   condition: () => pageConditions.hasBodyClass('page-analytics'),
 * }
 */
export const lazyComponentRegistry: Array<{
  elementId: string;
  name: string;
  loader: () => Promise<any>;
  condition?: () => boolean;
  required?: boolean;
  props?: Record<string, any>;
}> = [
  // Add lazy-loaded components here
  // Example:
  // {
  //   elementId: 'data-visualization',
  //   name: 'DataVisualization',
  //   loader: () => import('../../components/DataVisualization.svelte'),
  //   condition: () => pageConditions.hasBodyClass('page-dashboard'),
  // },
];
