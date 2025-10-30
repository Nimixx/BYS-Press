# Security Features

BYS Press includes enterprise-grade security features built-in. This guide explains what they do and how to configure them.

## Overview

Security features are automatically enabled in **production mode** and disabled in **development mode** for easier debugging.

**Production Mode**: Security headers enabled
**Development Mode**: Security headers disabled

## Environment Detection

The theme detects environment automatically:

```php
// inc/Security.php
public function isProduction(): bool
{
    // 1. Check WP_ENVIRONMENT_TYPE
    if (wp_get_environment_type() === 'production') {
        return true;
    }

    // 2. Check domain
    $localDomains = ['localhost', '127.0.0.1', '.local', '.test', '.dev'];
    // If matches, it's development

    // 3. Check WP_DEBUG
    if (defined('WP_DEBUG') && WP_DEBUG) {
        return false;
    }

    return true;
}
```

## Security Components

### 1. Content Security Policy (CSP)

**What it does**: Prevents XSS attacks by controlling what resources can load.

**Class**: `BYSPress\Security\ContentSecurityPolicy`

**Default Policy**:
```
script-src 'self' 'nonce-{random}';
style-src 'self' 'nonce-{random}';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

**Add Allowed Domains**:

```php
add_action('bys_press_booted', function($theme) {
    $security = $theme->getSecurity();

    // Allow scripts from CDN
    $security->addAllowedScriptDomain('https://cdn.example.com');

    // Allow styles from CDN
    $security->addAllowedStyleDomain('https://fonts.googleapis.com');
});
```

**Customize Policy**:

```php
add_filter('bys_press_csp_directives', function($directives, $nonce) {
    // Add image source
    $directives['img-src'][] = 'https://images.example.com';

    // Allow YouTube embeds
    $directives['frame-src'][] = 'https://www.youtube.com';

    return $directives;
}, 10, 2);
```

### 2. CSP Nonce

**What it does**: Allows specific inline scripts/styles via nonce.

**Class**: `BYSPress\Security\NonceManager`

**Usage in Twig**:
```twig
<script nonce="{{ nonce }}">
    console.log('This inline script is allowed');
</script>

<style nonce="{{ nonce }}">
    .custom { color: red; }
</style>
```

**Usage in PHP**:
```php
$nonce = bys_press()->getSecurity()->getNonce();
echo '<script nonce="' . esc_attr($nonce) . '">alert("Hello");</script>';
```

### 3. Security Headers

**What it does**: Basic security headers for browser protection.

**Class**: `BYSPress\Security\HeaderSecurity`

**Headers Set**:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Customize**:

```php
// Remove X-Frame-Options to allow iframes
remove_action('send_headers', [
    bys_press()->getSecurity()->getHeaderSecurity(),
    'sendSecurityHeaders'
]);

// Or send custom headers
add_action('send_headers', function() {
    header('X-Frame-Options: SAMEORIGIN');
});
```

### 4. Permissions Policy

**What it does**: Controls browser features like geolocation, camera, etc.

**Class**: `BYSPress\Security\PermissionsPolicy`

**Default Policy**:
```
geolocation=(),
microphone=(),
camera=(),
payment=(),
usb=(),
```

**Customize**:

```php
add_filter('bys_press_permissions_policy', function($permissions) {
    // Allow geolocation for your domain
    $permissions['geolocation'] = 'self';

    // Allow payment API
    $permissions['payment'] = 'self https://checkout.stripe.com';

    return $permissions;
});
```

### 5. WordPress Security

**What it does**: Hardens WordPress core features.

**Class**: `BYSPress\Security\WordPressSecurity`

**Features**:
- Disable XML-RPC
- Disable file editing
- Secure REST API
- Hide WordPress version
- Remove generator meta tag
- Disable user enumeration

**Customize**:

```php
// Allow XML-RPC if needed
add_filter('xmlrpc_enabled', '__return_true');

// Allow file editing
define('DISALLOW_FILE_EDIT', false);
```

## Security Utilities

The theme includes 24 security/optimization utilities in `inc/utilities/`:

### Critical Security

**fixLoginSecurity.php**:
- Prevents user enumeration
- Obscures login errors
- Adds security question to login

**disableXmlRpc.php**:
- Disables XML-RPC completely
- Prevents brute force attacks

**blockSensitiveFiles.php**:
- Blocks access to sensitive files
- Protects .env, logs, etc.

**disableFileEditors.php**:
- Disables theme/plugin file editors
- Prevents code injection

### WordPress Hardening

**cleanWpHead.php**:
- Removes unnecessary meta tags
- Cleaner HTML output

**disableApplicationPasswords.php**:
- Disables application passwords
- Prevents unauthorized access

**additionalSecurityHeaders.php**:
- Additional HTTP security headers
- Further browser protection

## REST API Security

**Restrict Endpoints**:

```php
add_filter('rest_authentication_errors', function($result) {
    if (!is_user_logged_in()) {
        return new WP_Error(
            'rest_forbidden',
            'REST API restricted',
            ['status' => 403]
        );
    }
    return $result;
});
```

**Or allow specific endpoints**:

```php
add_filter('rest_pre_dispatch', function($result, $server, $request) {
    $route = $request->get_route();

    // Allow public endpoints
    $public = ['/wp/v2/posts', '/wp/v2/pages'];
    if (in_array($route, $public)) {
        return $result;
    }

    // Require authentication for others
    if (!is_user_logged_in()) {
        return new WP_Error('rest_forbidden', 'Unauthorized', ['status' => 403]);
    }

    return $result;
}, 10, 3);
```

## Login Security

**Limit Login Attempts**:

```php
// inc/utilities/custom/limitLogins.php
add_action('wp_login_failed', function($username) {
    $attempts = get_transient('login_attempts_' . $username) ?: 0;
    $attempts++;

    if ($attempts >= 3) {
        // Block for 15 minutes
        set_transient('login_blocked_' . $username, true, 15 * MINUTE_IN_SECONDS);
    }

    set_transient('login_attempts_' . $username, $attempts, 15 * MINUTE_IN_SECONDS);
});

add_filter('authenticate', function($user, $username, $password) {
    if (get_transient('login_blocked_' . $username)) {
        return new WP_Error('login_blocked', 'Too many failed attempts. Try again in 15 minutes.');
    }
    return $user;
}, 30, 3);
```

**Two-Factor Authentication**:

Install a plugin like [Two-Factor](https://wordpress.org/plugins/two-factor/) or implement custom:

```php
// After successful login
add_action('wp_login', function($username, $user) {
    // Generate and send code
    $code = wp_generate_password(6, false);
    update_user_meta($user->ID, '2fa_code', $code);
    wp_mail($user->user_email, '2FA Code', "Your code: $code");

    // Require code verification
    wp_logout();
    wp_redirect('/2fa-verify?user=' . $user->ID);
    exit;
}, 10, 2);
```

## File Upload Security

**Restrict File Types**:

```php
add_filter('upload_mimes', function($mimes) {
    // Remove potentially dangerous types
    unset($mimes['exe']);
    unset($mimes['php']);

    // Add allowed types
    $mimes['svg'] = 'image/svg+xml';

    return $mimes;
});
```

**Scan Uploads**:

```php
add_filter('wp_handle_upload_prefilter', function($file) {
    // Check file size
    if ($file['size'] > 5 * MB_IN_BYTES) {
        $file['error'] = 'File too large. Maximum: 5MB';
        return $file;
    }

    // Check file type
    $allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!in_array($file['type'], $allowed)) {
        $file['error'] = 'File type not allowed';
        return $file;
    }

    return $file;
});
```

## Database Security

**Prepared Statements** (Always use):

```php
global $wpdb;

// ✅ Good - Using prepared statement
$results = $wpdb->get_results($wpdb->prepare(
    "SELECT * FROM {$wpdb->posts} WHERE ID = %d",
    $post_id
));

// ❌ Bad - SQL injection vulnerability
$results = $wpdb->get_results(
    "SELECT * FROM {$wpdb->posts} WHERE ID = $post_id"
);
```

**Escape Output**:

```php
// ✅ Good - Escaped
echo '<h1>' . esc_html($title) . '</h1>';
echo '<a href="' . esc_url($url) . '">Link</a>';
echo '<div data-id="' . esc_attr($id) . '">Content</div>';

// ❌ Bad - Not escaped (XSS vulnerability)
echo '<h1>' . $title . '</h1>';
```

## HTTPS Enforcement

**In wp-config.php**:

```php
// Force HTTPS
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
    $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

define('FORCE_SSL_ADMIN', true);
```

**In .htaccess**:

```apache
# Redirect HTTP to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Security Checklist

### Production Deployment

- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set `WP_ENVIRONMENT_TYPE` to 'production'
- [ ] Disable `WP_DEBUG`
- [ ] Use strong admin passwords
- [ ] Change database table prefix
- [ ] Update salts and keys in wp-config.php
- [ ] Disable file editing: `DISALLOW_FILE_EDIT`
- [ ] Limit login attempts
- [ ] Install security plugin (optional)
- [ ] Set up regular backups
- [ ] Keep WordPress/plugins updated
- [ ] Configure CSP appropriately
- [ ] Test security headers
- [ ] Review file permissions (644 for files, 755 for directories)

### Regular Maintenance

- [ ] Update WordPress core
- [ ] Update plugins and themes
- [ ] Review user accounts
- [ ] Check security logs
- [ ] Test backup restoration
- [ ] Review file changes
- [ ] Scan for malware
- [ ] Update dependencies (`composer update`, `npm update`)

## Testing Security

### Check Security Headers

Visit [Security Headers](https://securityheaders.com/) and enter your URL.

### Test CSP

1. Open browser DevTools → Console
2. Look for CSP violations
3. Adjust policy as needed

### Scan for Vulnerabilities

```bash
# Check PHP dependencies
composer audit

# Check npm dependencies
npm audit

# Fix automatically
npm audit fix
```

### Manual Testing

- [ ] Try accessing wp-admin without login
- [ ] Test login with wrong password (should not reveal user exists)
- [ ] Try accessing sensitive files (/.env, /wp-config.php)
- [ ] Test forms for XSS
- [ ] Test SQL injection in URLs
- [ ] Check REST API is properly restricted

## Security Best Practices

1. **Never trust user input** - Always validate and sanitize
2. **Use prepared statements** - Prevent SQL injection
3. **Escape output** - Prevent XSS
4. **Use nonces** - Prevent CSRF
5. **Check capabilities** - Verify user permissions
6. **HTTPS only** - Encrypt all traffic
7. **Strong passwords** - Enforce minimum requirements
8. **Regular updates** - Keep everything current
9. **Principle of least privilege** - Minimal permissions
10. **Security through obscurity is not security** - Don't rely on hiding things

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [WordPress Security Whitepaper](https://wordpress.org/about/security/)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Security Headers Reference](https://securityheaders.com/)

---

**Next**: Learn about [Assets Management](./assets.md) for handling scripts and styles.
