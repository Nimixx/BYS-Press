/**
 * Application Configuration
 *
 * Centralized configuration using Vite environment variables
 *
 * IMPORTANT: All values here are PUBLIC and exposed in the browser.
 * Never store sensitive data in environment variables.
 */

/**
 * Check if we're in development mode
 */
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || '/wp-json',
  version: import.meta.env.VITE_API_VERSION || 'v1',
  timeout: 10000, // 10 seconds
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  debug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;

/**
 * Theme Configuration
 */
export const THEME_CONFIG = {
  version: import.meta.env.VITE_THEME_VERSION || '1.0.0',
  cdnUrl: import.meta.env.VITE_CDN_URL || '',
} as const;

/**
 * Third-party API Keys (Public keys only!)
 */
export const API_KEYS = {
  googleMaps: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '',
} as const;

/**
 * Debug logger that only logs in development or when debug is enabled
 */
export function debugLog(...args: unknown[]): void {
  if (FEATURES.debug || isDevelopment) {
    console.log('[Core Theme]', ...args);
  }
}

/**
 * Get full API endpoint URL
 */
export function getApiEndpoint(path: string): string {
  const baseUrl = API_CONFIG.baseUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Example: Fetch data from WordPress REST API
 *
 * @param endpoint - API endpoint path
 * @returns Promise resolving to typed data
 * @throws Error if fetch fails or response is not ok
 *
 * @example
 * interface Post { id: number; title: string; }
 * const posts = await fetchFromWP<Post[]>('wp/v2/posts');
 */
export async function fetchFromWP<T>(endpoint: string): Promise<T> {
  const url = getApiEndpoint(endpoint);

  debugLog('Fetching from:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    debugLog('Response:', data);

    // Caller is responsible for ensuring T matches the actual response shape
    // This is a limitation of TypeScript with dynamic API responses
    return data as T;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
