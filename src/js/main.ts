// Main TypeScript Entry Point
import '../css/main.css';
import { mount } from 'svelte';
import Counter from '../components/Counter.svelte';
import { debugLog, THEME_CONFIG, isDevelopment } from './config';

// Log theme initialization (only in development)
if (isDevelopment) {
  debugLog('Core Theme loaded!', {
    version: THEME_CONFIG.version,
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
  });
}

// Mount Svelte Counter component
const counterElement = document.getElementById('svelte-counter');
if (counterElement) {
  try {
    mount(Counter, { target: counterElement });
    debugLog('Counter component mounted successfully');
  } catch (error) {
    console.error('Failed to mount Counter component:', error);
  }
} else {
  // Only warn if we expect the element to exist
  if (document.body.classList.contains('page-template-front-page')) {
    console.warn('Expected #svelte-counter mount point not found on front page');
  }
}

