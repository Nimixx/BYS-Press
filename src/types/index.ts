/**
 * Global Type Definitions
 *
 * Central export point for all TypeScript types used across the application.
 * Import types from here for consistency.
 *
 * @module types
 */

// Counter types
export type {
  CounterOptions,
  CounterReturn,
  CounterProps,
  CounterEmits,
} from './counter';

// Component types
export type {
  ComponentConfig,
  LazyComponentConfig,
  MountResult,
} from './components';

// Add more type exports as your application grows
// Example:
// export type { FormProps, FormEmits } from './form';
// export type { ModalProps, ModalEmits } from './modal';
