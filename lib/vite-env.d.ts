/// <reference types="vite/client" />
/// <reference types="vue/ref-macros" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<Record<string, never>, Record<string, never>, any>;
  export default component;
}

/**
 * Environment Variables Type Definitions
 *
 * Add your VITE_ prefixed environment variables here for TypeScript autocomplete
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_VERSION?: string;
  readonly VITE_ENABLE_DEBUG: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_THEME_VERSION: string;
  readonly VITE_CDN_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  /**
   * Vite's import.meta.glob for dynamic imports
   * @see https://vitejs.dev/guide/features.html#glob-import
   */
  readonly glob: <T = unknown>(
    pattern: string | string[],
    options?: {
      /** Load modules eagerly (default: false) */
      eager?: boolean;
      /** Import specific export (default: '*') */
      import?: string;
      /** Import as type: 'raw' | 'url' | 'worker' */
      as?: string;
      /** Query parameters to append */
      query?: string | Record<string, string | number | boolean>;
      /** Include/exclude patterns */
      exhaustive?: boolean;
    }
  ) => Record<string, T>;

  /**
   * Vite's hot module replacement API
   */
  readonly hot?: {
    readonly data: Record<string, unknown>;
    accept(): void;
    accept(cb: (mod: unknown) => void): void;
    accept(dep: string, cb: (mod: unknown) => void): void;
    accept(deps: readonly string[], cb: (mods: unknown[]) => void): void;
    dispose(cb: (data: Record<string, unknown>) => void): void;
    prune(cb: () => void): void;
    invalidate(): void;
    on(event: string, cb: (...args: unknown[]) => void): void;
  };
}
