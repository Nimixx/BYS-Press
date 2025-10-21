# Security Features

This theme implements modern security best practices, including Content Security Policy (CSP) with nonce-based inline script/style protection.

## Content Security Policy (CSP)

### Overview

The theme uses a **nonce-based CSP** instead of the insecure `unsafe-inline` and `unsafe-eval` directives. This provides strong protection against XSS attacks while allowing controlled inline scripts and styles.

### How It Works

1. A unique nonce (random token) is generated for each page load
2. The nonce is added to the CSP header
3. All inline scripts and styles are automatically tagged with this nonce
4. Browsers only execute inline code that matches the nonce

### Using Nonces in Templates

The CSP nonce is automatically available in all Twig templates via the `csp_nonce` variable:

```twig
{# views/base.twig #}
<script nonce="{{ csp_nonce }}">
  console.log('This inline script will execute!');
</script>

<style nonce="{{ csp_nonce }}">
  .custom-style {
    color: red;
  }
</style>
```

### Adding External Domains

If you need to load scripts or styles from external domains (like Google Analytics, CDNs, etc.), add them to the allowed domains:

```php
// In functions.php or a custom plugin
add_action('core_theme_booted', function($theme) {
    $security = $theme->getSecurity();

    // Allow Google Analytics
    $security->addAllowedScriptDomain('https://www.google-analytics.com');
    $security->addAllowedScriptDomain('https://www.googletagmanager.com');

    // Allow Google Fonts
    $security->addAllowedStyleDomain('https://fonts.googleapis.com');
});
```

### Customizing CSP Directives

You can filter the CSP directives using the `core_theme_csp_directives` filter:

```php
add_filter('core_theme_csp_directives', function($directives, $nonce) {
    // Add custom directive
    $directives[] = "worker-src 'self' blob:";

    // Modify existing directive
    $directives = array_map(function($directive) {
        if (strpos($directive, 'connect-src') === 0) {
            return $directive . ' https://api.example.com';
        }
        return $directive;
    }, $directives);

    return $directives;
}, 10, 2);
```

## Current CSP Configuration

### Default Directives

- **default-src**: `'self'` - Only allow resources from same origin
- **script-src**: `'self' 'nonce-{random}'` - Scripts from same origin + nonce
- **style-src**: `'self' 'nonce-{random}'` - Styles from same origin + nonce
- **img-src**: `'self' data: https:` - Images from same origin, data URIs, and HTTPS
- **font-src**: `'self' data:` - Fonts from same origin and data URIs
- **connect-src**: `'self'` - AJAX/WebSocket/EventSource from same origin
- **media-src**: `'self'` - Audio/video from same origin
- **object-src**: `'none'` - No plugins (Flash, etc.)
- **frame-ancestors**: `'self'` - Can only be embedded by same origin
- **base-uri**: `'self'` - Restrict `<base>` tag URLs
- **form-action**: `'self'` - Forms can only submit to same origin
- **upgrade-insecure-requests** - Automatically upgrade HTTP to HTTPS

## Other Security Headers

### X-Frame-Options
- Value: `SAMEORIGIN`
- Prevents clickjacking attacks

### X-Content-Type-Options
- Value: `nosniff`
- Prevents MIME-sniffing attacks

### X-XSS-Protection
- Value: `1; mode=block`
- Enables browser XSS filter

### Referrer-Policy
- Value: `strict-origin-when-cross-origin`
- Controls referrer information sharing

### Permissions-Policy
Restricts access to sensitive browser APIs:
- geolocation, microphone, camera, payment, usb, magnetometer, gyroscope, accelerometer

### Strict-Transport-Security (HSTS)
- Value: `max-age=31536000; includeSubDomains`
- Forces HTTPS connections (production only)

## Additional Security Features

### REST API Protection
- User enumeration via REST API is blocked for non-logged-in users
- Prevents `/wp/v2/users` endpoint access

### WordPress Version Hiding
- Removes WordPress version from HTML and headers
- Prevents attackers from targeting version-specific vulnerabilities

### File Editing Disabled
- Sets `DISALLOW_FILE_EDIT` constant
- Prevents editing theme/plugin files from WordPress admin
- Reduces attack surface if admin account is compromised

### XML-RPC Protection

XML-RPC is **disabled by default** to prevent:
- Brute force attacks via xmlrpc.php
- DDoS amplification attacks
- Pingback spam

If you need XML-RPC (e.g., for Jetpack, mobile apps, or legacy integrations), you can re-enable it:

```php
// In functions.php or a custom plugin
remove_filter('xmlrpc_enabled', '__return_false');
```

## Environment Detection

Security headers are **only applied in production**. Development environments are detected by:
1. `wp_get_environment_type()` returning 'production'
2. Domain not containing: localhost, 127.0.0.1, .local, .test, .dev
3. `WP_DEBUG` constant is false

## Testing CSP

To test your CSP configuration:

1. Open browser DevTools Console
2. Look for CSP violation reports
3. Adjust allowed domains or directives as needed

### Common Issues

**Issue**: Inline scripts not working
- **Solution**: Make sure to add `nonce="{{ csp_nonce }}"` to your script tags

**Issue**: External resources blocked
- **Solution**: Use `addAllowedScriptDomain()` or `addAllowedStyleDomain()`

**Issue**: WordPress admin not working
- **Solution**: CSP is only active on production. Check your environment detection.

## References

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [OWASP: Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
