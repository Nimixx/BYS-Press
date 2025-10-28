/**
 * Counter Component Types
 *
 * Type definitions specific to the Counter component.
 *
 * @module components/Counter
 */

/**
 * Counter component props
 */
export interface CounterProps {
  /** Display title */
  title?: string;
  /** Initial counter value */
  initialValue?: number;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step value for increment/decrement */
  step?: number;
}
