# Utilities Reference

BYS Press includes 24 modular utilities for WordPress optimization and security hardening.

## Overview

**Location**: `inc/utilities/`

**How It Works**:
- Utilities are PHP files automatically loaded by `UtilitiesManager`
- Each utility is independent and can be removed if not needed
- No configuration required - works out of the box

## Security Utilities

### fixLoginSecurity.php
**Purpose**: Prevent user enumeration and secure login

**Features**:
- Obscures login error messages
- Prevents username discovery
- Blocks REST API user endpoints
- Removes author archives

**Disable**:
```php
// Delete file or:
remove_action('wp_login_failed', 'bys_press_obscure_login_errors');
```

### disableXmlRpc.php
**Purpose**: Disable XML-RPC completely

**Why**: XML-RPC is often targeted for brute force attacks

**Disable**: Delete file if you need XML-RPC

### blockSensitiveFiles.php
**Purpose**: Block access to sensitive files

**Files Protected**:
- `.env`
- `.git/`
- `wp-config.php`
- `error_log`
- `debug.log`

### disableFileEditors.php
**Purpose**: Disable theme/plugin file editors

**Sets**: `DISALLOW_FILE_EDIT` constant

**Benefit**: Prevents code injection if admin account compromised

## Performance Utilities

### disableEmojis.php
**Purpose**: Remove WordPress emoji scripts

**Saves**: ~12KB JavaScript + DNS prefetch

**Impact**: Faster page load, cleaner HTML

### disableEmbeds.php
**Purpose**: Remove oEmbed JavaScript

**Saves**: ~10KB JavaScript

**When to keep**: If you embed YouTube, Twitter, etc. in posts

### removeJqueryMigrate.php
**Purpose**: Remove jQuery Migrate script

**Saves**: ~10KB JavaScript

**Warning**: May break old plugins relying on deprecated jQuery features

### optimizeHeartbeat.php
**Purpose**: Reduce WordPress Heartbeat API frequency

**Default**: 15 seconds → 60 seconds

**Benefit**: Reduces server load

**Customize**:
```php
// inc/utilities/optimizeHeartbeat.php
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 120; // 2 minutes
    return $settings;
});
```

### disableAutosave.php
**Purpose**: Disable post autosave

**Benefit**: Reduces AJAX requests

**Warning**: Users lose autosave feature

### limitPostRevisions.php
**Purpose**: Limit post revisions

**Default**: Unlimited → 5 revisions

**Customize**:
```php
// wp-config.php
define('WP_POST_REVISIONS', 10);
```

## UI Cleanup Utilities

### cleanWpHead.php
**Purpose**: Remove unnecessary meta tags from `<head>`

**Removes**:
- WordPress generator tag
- WLW Manifest link
- RSD link
- Shortlink
- Adjacent posts links
- REST API link from head (still accessible)

**Benefit**: Cleaner HTML, slightly faster load

### disableDashiconsFrontend.php
**Purpose**: Remove Dashicons from frontend

**Saves**: ~28KB CSS

**Impact**: Only loads for logged-in users viewing admin bar

### hideAdminNotices.php
**Purpose**: Hide admin notices on dashboard

**Why**: Cleaner admin interface

**Customize**:
```php
// Show on specific pages
add_filter('bys_press_hide_admin_notices', function($hide) {
    if (isset($_GET['page']) && $_GET['page'] === 'my-settings') {
        return false;
    }
    return $hide;
});
```

### simplifyAdminMenu.php
**Purpose**: Remove unnecessary admin menu items

**Removes**: Comments, Tools (for non-admins)

**Customize**:
```php
// Remove more items
add_action('admin_menu', function() {
    remove_menu_page('edit.php'); // Posts
    remove_menu_page('upload.php'); // Media
}, 999);
```

### removeDashboardWidgets.php
**Purpose**: Remove default dashboard widgets

**Removes**:
- Quick Draft
- WordPress Events
- Activity
- Primary/Secondary widgets

**Benefit**: Faster dashboard load, cleaner interface

### disableAdminBarFrontend.php
**Purpose**: Hide admin bar on frontend

**Applies To**: All users (keeps in admin)

**Disable**: Delete file to keep admin bar on frontend

### removeAdminFooter.php
**Purpose**: Remove WordPress version from admin footer

**Benefit**: Security through obscurity (minor)

## Feature Management

### disableComments.php
**Purpose**: Completely disable comments

**Actions**:
- Removes comment forms
- Hides admin menu
- Closes existing comments
- Removes REST API endpoints

**Re-enable**: Delete file

### disableGutenberg.php
**Purpose**: Disable Gutenberg editor

**Replaces With**: Classic editor

**Use Case**: If you prefer classic editor

**Selectively disable**:
```php
// Only disable for certain post types
add_filter('use_block_editor_for_post_type', function($enabled, $post_type) {
    if ($post_type === 'page') {
        return false; // Disable for pages
    }
    return $enabled;
}, 10, 2);
```

### disableScreenOptions.php
**Purpose**: Hide screen options tab

**Use Case**: Simplify admin for clients

### disableApplicationPasswords.php
**Purpose**: Disable application passwords feature

**Benefit**: Reduces attack surface

**When to keep**: If using REST API authentication

### disableWpCron.php
**Purpose**: Disable WP-Cron (use system cron instead)

**Setup**:
1. Add to wp-config.php: `define('DISABLE_WP_CRON', true);`
2. Add to system crontab: `*/15 * * * * curl https://yoursite.com/wp-cron.php`

**Benefit**: Better performance, reliable scheduling

## Advanced Utilities

### additionalSecurityHeaders.php
**Purpose**: Additional HTTP security headers

**Headers Added**:
- X-Powered-By: (removed)
- Server: (obscured)

### disablePingbacks.php
**Purpose**: Disable pingbacks and trackbacks

**Benefit**: Reduces spam, improves performance

## Managing Utilities

### Disable a Utility

**Method 1**: Delete the file
```bash
rm inc/utilities/disableEmojis.php
```

**Method 2**: Conditionally load
```php
// inc/UtilitiesManager.php
private function loadUtility(string $file): void
{
    $basename = basename($file, '.php');

    // Skip specific utilities
    if (in_array($basename, ['disableEmojis', 'disableEmbeds'])) {
        return;
    }

    require_once $file;
}
```

### Add Custom Utility

Create file in `inc/utilities/`:

```php
<?php
/**
 * My Custom Utility
 *
 * @package BYSPress
 */

if (!defined('ABSPATH')) {
    exit();
}

add_action('init', function() {
    // Your code here
});
```

File is automatically loaded on next page load.

### Check Loaded Utilities

```php
add_action('bys_press_utilities_loaded', function($utilities) {
    error_log('Loaded utilities: ' . print_r($utilities, true));
});
```

## Utility Best Practices

1. **Test before deploying** - Some utilities may conflict with plugins
2. **Document changes** - Note which utilities you've modified
3. **Check plugin compatibility** - Some plugins may rely on disabled features
4. **Measure impact** - Use performance tools to verify improvements
5. **Keep backups** - Before removing utilities

## Performance Impact

**Estimated Savings** (typical):
- JavaScript: ~60KB
- CSS: ~28KB
- HTTP Requests: ~6 fewer
- Server Load: ~30% reduction in AJAX

**Actual Results Vary** based on:
- Plugins installed
- Theme complexity
- Server configuration
- Traffic patterns

## Security Impact

**Risk Reduction**:
- XML-RPC attacks: Eliminated
- User enumeration: Prevented
- File editing exploits: Blocked
- Login brute force: Harder

## Compatibility

Most utilities are compatible with:
- All major WordPress versions (6.0+)
- Most popular plugins
- Standard hosting environments

**Known Conflicts**:
- `disableEmbeds.php` conflicts with embed-heavy sites
- `disableComments.php` conflicts with comment plugins
- `disableGutenberg.php` conflicts with block-based themes

## Troubleshooting

### Feature Stopped Working

1. Check if utility disabled it
2. Look for relevant utility file
3. Delete or modify utility
4. Clear caches

### Plugin Conflict

1. Disable utilities one by one
2. Identify conflicting utility
3. Remove or modify it
4. Report compatibility issue

### Performance Not Improved

1. Clear all caches
2. Test with tools (GTmetrix, PageSpeed Insights)
3. Check other plugins aren't loading removed assets
4. Verify utilities are loading

## Resources

- **WordPress Performance**: [WP Rocket Blog](https://wp-rocket.me/blog/)
- **Security Best Practices**: [WordPress Security](https://wordpress.org/about/security/)

---

**Next**: Learn about [Configuration](./configuration.md) for theme settings.
