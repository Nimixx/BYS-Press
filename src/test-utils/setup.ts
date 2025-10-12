import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Extend Vitest's expect with jest-dom matchers
// This allows you to use matchers like:
// expect(element).toBeInTheDocument()
// expect(element).toHaveClass('active')
// etc.
