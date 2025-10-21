/**
 * Vue Component Registry
 *
 * Central configuration for all Vue components and their mount points.
 * Add new Vue components here to automatically mount them on the appropriate pages.
 *
 * Structure:
 * - Eager-loaded components: Imported directly, bundled in main chunk
 * - Lazy-loaded components: Imported via dynamic import(), code-split automatically
 *
 * @module config/vueComponents
 */

import type { ComponentConfig, LazyComponentConfig } from '../../types/components';

// Eager imports - critical components bundled in main chunk
import AdvancedCounter from '../../components/examples/AdvancedCounter.vue';

/**
 * Page condition helpers
 *
 * Reusable functions to check page context and element presence.
 * Used by component registry to determine when to mount components.
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
 * Eager-loaded Vue Component Registry
 *
 * Components that are critical and should be loaded immediately.
 * These are bundled in the main JavaScript chunk.
 *
 * Use for:
 * - Above-the-fold components
 * - Critical UI elements (header, navigation)
 * - Components used on every page
 *
 * Configuration options:
 * - component: The Vue component (imported at top)
 * - elementId: DOM element ID to mount to
 * - name: Component name for debugging
 * - required: Warn if mount point missing (optional)
 * - condition: Function to check if should mount (optional)
 * - props: Props to pass to component (optional)
 */
export const vueComponentRegistry: ComponentConfig[] = [
  // Eager-loaded AdvancedCounter - Loads immediately with main bundle
  {
    component: AdvancedCounter,
    elementId: 'counter-eager',
    name: 'AdvancedCounterEager',
    required: false,
    condition: () => pageConditions.elementExists('counter-eager'),
    props: {
      title: 'Eager Counter (Main Bundle)',
      initialValue: 0,
      min: 0,
      max: 50,
      step: 1,
    },
  },

  // Add more eager-loaded components here
  // Example - Site navigation (critical, always needed):
  // {
  //   component: Navigation,
  //   elementId: 'main-navigation',
  //   name: 'Navigation',
  //   required: true,
  // },
];

/**
 * Lazy-loaded Vue Component Registry
 *
 * Components that are code-split and loaded on-demand.
 * These create separate JavaScript chunks that load only when needed.
 *
 * Use for:
 * - Large, complex components
 * - Components used only on specific pages
 * - Below-the-fold interactive elements
 * - Components with heavy dependencies
 *
 * Benefits:
 * - Smaller initial bundle size
 * - Faster page load
 * - Better performance on pages that don't use these components
 *
 * Configuration options:
 * - elementId: DOM element ID to mount to
 * - name: Component name for debugging
 * - loader: Dynamic import function
 * - condition: Function to check if should mount (optional)
 * - required: Warn if mount point missing (optional)
 * - props: Props to pass to component (optional)
 */
export const lazyVueComponentRegistry: LazyComponentConfig[] = [
  // Lazy-loaded AdvancedCounter - Code-split, loads on demand

  // Add more lazy-loaded components here
  //
  // Example - Contact form (only on contact page):
  // {
  //   elementId: 'contact-form',
  //   name: 'ContactForm',
  //   loader: () => import('../../components/forms/ContactForm.vue'),
  //   condition: () => pageConditions.hasBodyClass('page-template-contact'),
  // },
  //
  // Example - Image gallery (heavy component with dependencies):
  // {
  //   elementId: 'photo-gallery',
  //   name: 'PhotoGallery',
  //   loader: () => import('../../components/gallery/PhotoGallery.vue'),
  //   condition: () => pageConditions.hasBodyClass('page-template-gallery'),
  //   props: { layout: 'masonry', columns: 3 },
  // },
  //
  // Example - Data visualization (complex chart library):
  // {
  //   elementId: 'analytics-dashboard',
  //   name: 'AnalyticsDashboard',
  //   loader: () => import('../../components/analytics/Dashboard.vue'),
  //   condition: () => pageConditions.hasBodyClass('page-analytics'),
  //   required: true,
  // },
];
