/**
 * Props Parser
 *
 * Safely parses JSON props from data attributes.
 * Handles errors gracefully with logging.
 *
 * @module vue/PropsParser
 */

/**
 * Type guard to check if value is a valid props object
 *
 * @param value - Value to check
 * @returns True if value is a plain object (not null, not array)
 */
function isValidPropsObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Props Parser class
 * Handles parsing of component props from JSON strings
 */
export class PropsParser {
  /**
   * Parse JSON props from data attribute safely
   *
   * @param propsString - JSON string from data-props attribute
   * @param componentName - Component name for error reporting
   * @returns Parsed props object or empty object on error
   *
   * @example
   * parseProps('{"count": 5}', 'Counter') // { count: 5 }
   * parseProps('invalid json', 'Counter') // {} (with warning logged)
   */
  static parse(propsString: string, componentName: string): Record<string, unknown> {
    if (!propsString) {
      return {};
    }

    try {
      const parsed: unknown = JSON.parse(propsString);

      // Validate parsed value is a plain object
      if (!isValidPropsObject(parsed)) {
        console.warn(`[Vue] Props must be an object for ${componentName}`, {
          propsString,
          receivedType: Array.isArray(parsed) ? 'array' : typeof parsed,
        });
        return {};
      }

      return parsed;
    } catch (error) {
      console.warn(`[Vue] Failed to parse props for ${componentName}`, {
        propsString,
        error: (error as Error).message,
      });
      return {};
    }
  }

  /**
   * Extract props from HTML element
   *
   * @param element - HTML element with data-props attribute
   * @param componentName - Component name for error reporting
   * @returns Parsed props object
   */
  static extractFromElement(element: HTMLElement, componentName: string): Record<string, unknown> {
    const propsString = element.getAttribute('data-props') || '';
    return this.parse(propsString, componentName);
  }
}
