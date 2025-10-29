/**
 * URL Security Validator
 *
 * Provides client-side URL validation for defense-in-depth security.
 * Prevents potential XSS and injection attacks through menu URLs.
 *
 * @module lib/security/urlValidator
 */

/**
 * List of safe URL protocols
 */
const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'] as const;

/**
 * List of dangerous protocols that should never be allowed
 */
const DANGEROUS_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'file:',
  'about:',
] as const;

/**
 * Validates if a URL is safe to use
 *
 * @param url - URL string to validate
 * @param options - Validation options
 * @returns True if URL is safe, false otherwise
 *
 * @example
 * ```ts
 * isSafeUrl('https://example.com'); // true
 * isSafeUrl('javascript:alert(1)'); // false
 * isSafeUrl('/relative/path'); // true
 * isSafeUrl('mailto:test@example.com'); // true
 * ```
 */
export function isSafeUrl(
  url: string,
  options: {
    /** Allow relative URLs (default: true) */
    allowRelative?: boolean;
    /** Allow protocol-relative URLs like //example.com (default: false) */
    allowProtocolRelative?: boolean;
    /** Allow fragment-only URLs like #section (default: true) */
    allowFragment?: boolean;
  } = {},
): boolean {
  const { allowRelative = true, allowProtocolRelative = false, allowFragment = true } = options;

  // Empty or null URLs are not safe
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  // Empty after trim is not safe
  if (trimmedUrl.length === 0) {
    return false;
  }

  // Check for dangerous patterns first
  const lowerUrl = trimmedUrl.toLowerCase();

  // Block dangerous protocols
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (lowerUrl.startsWith(protocol)) {
      return false;
    }
  }

  // Block encoded dangerous protocols (e.g., %6A%61%76%61%73%63%72%69%70%74)
  try {
    const decoded = decodeURIComponent(lowerUrl);
    for (const protocol of DANGEROUS_PROTOCOLS) {
      if (decoded.startsWith(protocol)) {
        return false;
      }
    }
  } catch {
    // If decoding fails, the URL is likely malformed
    return false;
  }

  // Fragment-only URLs (#section)
  if (trimmedUrl.startsWith('#')) {
    return allowFragment;
  }

  // Relative URLs (/path or ./path or ../path)
  if (
    trimmedUrl.startsWith('/') ||
    trimmedUrl.startsWith('./') ||
    trimmedUrl.startsWith('../')
  ) {
    return allowRelative;
  }

  // Protocol-relative URLs (//example.com)
  if (trimmedUrl.startsWith('//')) {
    return allowProtocolRelative;
  }

  // Try to parse as absolute URL
  try {
    const parsed = new URL(trimmedUrl, window.location.origin);

    // Check if protocol is in safe list
    if (!SAFE_PROTOCOLS.includes(parsed.protocol as (typeof SAFE_PROTOCOLS)[number])) {
      return false;
    }

    // Additional validation for http/https
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      // Block URLs with @ symbol (potential homograph attack)
      if (parsed.href.includes('@') && !parsed.href.includes('mailto:')) {
        return false;
      }
    }

    return true;
  } catch {
    // If URL parsing fails, treat as relative if allowed
    return allowRelative;
  }
}

/**
 * Sanitizes a URL by validating it and returning a safe fallback if invalid
 *
 * @param url - URL to sanitize
 * @param fallback - Fallback URL if validation fails (default: '#')
 * @returns Sanitized URL or fallback
 *
 * @example
 * ```ts
 * sanitizeUrl('https://example.com'); // 'https://example.com'
 * sanitizeUrl('javascript:alert(1)'); // '#'
 * sanitizeUrl('javascript:alert(1)', '/'); // '/'
 * ```
 */
export function sanitizeUrl(url: string, fallback: string = '#'): string {
  return isSafeUrl(url) ? url : fallback;
}

/**
 * Validates a menu item URL with logging
 * Useful for debugging and monitoring potential security issues
 *
 * @param url - URL to validate
 * @param context - Context information for logging (e.g., menu item title)
 * @returns True if valid, false otherwise
 */
export function validateMenuUrl(url: string, context?: string): boolean {
  const isValid = isSafeUrl(url);

  if (!isValid && import.meta.env.DEV) {
    console.warn(
      `[Security] Invalid menu URL detected${context ? ` in "${context}"` : ''}: ${url}`,
    );
  }

  return isValid;
}
