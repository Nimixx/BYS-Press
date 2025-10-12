/// <reference types="vite/client" />
/// <reference types="svelte" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
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
}
