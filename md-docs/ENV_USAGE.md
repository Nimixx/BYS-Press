# Environment Variables in Core Theme

This document explains how to use `.env` files with Vite in this WordPress theme.

## Overview

Vite natively supports environment variables through `.env` files. However, **there are critical security considerations** when using `.env` in WordPress themes.

---

## How Vite Environment Variables Work

### 1. Variable Prefixing (Security Feature)

**Only variables prefixed with `VITE_` are exposed to your client-side code.**

```bash
# ✅ Exposed to browser (use import.meta.env.VITE_API_URL)
VITE_API_URL=https://api.example.com

# ❌ NOT exposed to browser (only available in vite.config.js)
DATABASE_PASSWORD=secret123
```

### 2. Built-in Variables

Vite provides these automatically:

```typescript
import.meta.env.MODE        // 'development' or 'production'
import.meta.env.DEV         // boolean - true in development
import.meta.env.PROD        // boolean - true in production
import.meta.env.BASE_URL    // base URL the app is served from
import.meta.env.SSR         // boolean - server-side rendering
```

---

## File Priority

Vite loads `.env` files in this order (later files override earlier):

```
.env                # Loaded in all cases
.env.local          # Loaded in all cases, ignored by git
.env.[mode]         # Loaded for specific mode (development/production)
.env.[mode].local   # Loaded for specific mode, ignored by git
```

Example:
```
.env                    # Base variables
.env.local              # Local overrides (git-ignored)
.env.development        # Development-specific
.env.development.local  # Local dev overrides (git-ignored)
.env.production         # Production-specific
.env.production.local   # Local prod overrides (git-ignored)
```

---

## Setup Instructions

### 1. Copy the Example File

```bash
cp .env.example .env
```

### 2. Edit `.env` with Your Values

```bash
# .env
VITE_API_URL=https://core-theme.test/wp-json
VITE_ENABLE_DEBUG=true
VITE_THEME_VERSION=1.0.0
```

### 3. Use in TypeScript/JavaScript

```typescript
// Import from config (recommended)
import { API_CONFIG, FEATURES } from './config';

console.log(API_CONFIG.baseUrl);  // Uses VITE_API_URL

// Or use directly
const apiUrl = import.meta.env.VITE_API_URL;
const isDebug = import.meta.env.VITE_ENABLE_DEBUG === 'true';
```

### 4. TypeScript Autocomplete

Add type definitions in `src/vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_MY_NEW_VAR: string;
}
```

---

## Security Best Practices

### ⚠️ CRITICAL: What NOT to Put in .env

**NEVER put sensitive data in `VITE_` prefixed variables:**

```bash
# ❌ DANGEROUS - These will be visible in browser!
VITE_DATABASE_PASSWORD=secret123
VITE_API_SECRET_KEY=sk_live_abc123
VITE_STRIPE_SECRET_KEY=sk_test_xyz789
VITE_JWT_SECRET=supersecret
```

### ✅ Safe to Use

```bash
# ✅ Safe - Public configuration
VITE_API_URL=https://api.example.com
VITE_GOOGLE_MAPS_API_KEY=AIzaSyB...  # Public client-side key
VITE_RECAPTCHA_SITE_KEY=6LcX...      # Public site key
VITE_ENABLE_ANALYTICS=true
VITE_THEME_VERSION=1.0.0
```

### 🔐 For Sensitive Data: Use WordPress Constants

Store sensitive data in `wp-config.php` instead:

```php
// wp-config.php (WordPress root, not theme)
define('MY_API_SECRET', 'secret123');
define('STRIPE_SECRET_KEY', 'sk_live_abc123');
```

Then use in PHP:

```php
// functions.php
$secret = defined('MY_API_SECRET') ? MY_API_SECRET : '';
```

---

## Usage Examples

### Example 1: API Configuration

```typescript
// src/js/api.ts
import { API_CONFIG } from './config';

async function fetchPosts() {
  const response = await fetch(`${API_CONFIG.baseUrl}/wp/v2/posts`);
  return response.json();
}
```

### Example 2: Feature Flags

```typescript
// src/js/analytics.ts
import { FEATURES } from './config';

if (FEATURES.analytics) {
  // Initialize analytics
  console.log('Analytics enabled');
}
```

### Example 3: Conditional Logging

```typescript
// src/js/main.ts
import { debugLog, isDevelopment } from './config';

if (isDevelopment) {
  debugLog('App started in development mode');
}
```

### Example 4: Using in Vue Components

```vue
<script setup lang="ts">
import { THEME_CONFIG } from '../js/config';

console.log('Theme version:', THEME_CONFIG.version);
</script>
```

### Example 5: Environment-Specific Behavior

```typescript
const apiUrl = import.meta.env.PROD
  ? 'https://api.production.com'
  : 'https://api.dev.com';
```

---

## Production Deployment

### Before Deploying

1. **Create `.env.production`**:
   ```bash
   VITE_API_URL=https://yoursite.com/wp-json
   VITE_ENABLE_DEBUG=false
   VITE_ENABLE_ANALYTICS=true
   ```

2. **Build for Production**:
   ```bash
   npm run build
   ```

3. **Verify Build Output**:
   - Check `dist/js/main.js` - your env vars will be replaced with actual values
   - Example: `import.meta.env.VITE_API_URL` becomes `"https://yoursite.com/wp-json"`

4. **Deploy**:
   - Upload the `dist/` directory
   - Upload `.env.production` (if needed on server)
   - **Never upload `.env.local` or `.env.development`**

### Server Environment Variables

For production servers, you can also set variables via:

- **cPanel**: Environment Variables section
- **WP Engine**: Environment Variables in dashboard
- **VPS/Dedicated**: Add to `.bashrc` or use systemd
- **Docker**: Use `docker-compose.yml` env section

---

## Troubleshooting

### Variables Not Working?

1. **Check prefix**: Must start with `VITE_`
   ```bash
   VITE_API_URL=...  # ✅ Works
   API_URL=...       # ❌ Doesn't work
   ```

2. **Restart dev server**: Changes to `.env` require restart
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

3. **Check file location**: `.env` must be in theme root
   ```
   wp-content/themes/core-theme/.env  ✅
   wp-content/themes/core-theme/src/.env  ❌
   ```

4. **No quotes needed**:
   ```bash
   VITE_API_URL=https://api.com  # ✅ Correct
   VITE_API_URL="https://api.com"  # Also works but not needed
   ```

5. **Boolean values are strings**:
   ```typescript
   // ❌ Wrong
   if (import.meta.env.VITE_ENABLE_DEBUG) { ... }

   // ✅ Correct
   if (import.meta.env.VITE_ENABLE_DEBUG === 'true') { ... }
   ```

### Variables Showing as Undefined?

```typescript
// Check if variable exists
console.log(import.meta.env.VITE_API_URL);

// Provide fallback
const apiUrl = import.meta.env.VITE_API_URL || 'default-value';
```

### Can't Access in PHP?

You can't! `.env` files are only for Vite/JavaScript. For PHP, use:
- WordPress constants in `wp-config.php`
- PHP's `getenv()` with server environment variables
- WordPress options via `get_option()`

---

## Common Patterns

### Pattern 1: Environment-Specific Endpoints

```bash
# .env.development
VITE_API_URL=https://localhost:3000/wp-json

# .env.production
VITE_API_URL=https://yoursite.com/wp-json
```

### Pattern 2: Feature Flags

```bash
# .env.development
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK_API=true

# .env.production
VITE_ENABLE_DEBUG=false
VITE_ENABLE_MOCK_API=false
```

### Pattern 3: API Keys (Public Only!)

```bash
# Public keys only - these are safe to expose
VITE_GOOGLE_MAPS_API_KEY=AIzaSyB...
VITE_RECAPTCHA_SITE_KEY=6LcX...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## WordPress Integration

### Passing PHP Data to JavaScript

Instead of using `.env`, you can pass data from WordPress to JavaScript:

```php
// functions.php
function core_theme_localize_scripts() {
    wp_localize_script('core-theme-main', 'coreThemeData', [
        'apiUrl' => rest_url(),
        'nonce' => wp_create_nonce('wp_rest'),
        'userId' => get_current_user_id(),
    ]);
}
add_action('wp_enqueue_scripts', 'core_theme_localize_scripts');
```

```typescript
// main.ts
declare global {
  interface Window {
    coreThemeData: {
      apiUrl: string;
      nonce: string;
      userId: number;
    };
  }
}

const wpData = window.coreThemeData;
console.log(wpData.apiUrl);
```

---

## Summary

✅ **DO:**
- Use `VITE_` prefix for all client-side variables
- Put public configuration in `.env` files
- Use `.env.example` for documentation
- Restart dev server after changes
- Use TypeScript types for autocomplete

❌ **DON'T:**
- Put secrets in `VITE_` prefixed variables
- Commit `.env` or `.env.local` to git
- Store passwords or API secrets in `.env`
- Use `.env` for PHP configuration
- Forget to restart dev server after changes

🔐 **For Sensitive Data:**
- Use `wp-config.php` constants
- Use server environment variables
- Use WordPress options/transients
- Use a secrets management service

---

## Resources

- [Vite Env Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [TypeScript Environment Variables](https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript)

---

**Last Updated:** October 12, 2025
