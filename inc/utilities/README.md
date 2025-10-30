# WordPress Utilities Documentation

This folder contains lightweight utilities that optimize, secure, and clean up your WordPress installation.

## 📋 How It Works

All PHP files in this folder are **automatically loaded** by the UtilitiesManager. To enable/disable features:
- ✅ **Enable**: Keep the file in this folder
- ❌ **Disable**: Delete or move the file out of this folder

---

## 🔒 Security Utilities

### disableXmlRpc.php
**Disables XML-RPC completely**
- Blocks XML-RPC endpoints
- Prevents brute force attacks via XML-RPC
- Removes X-Pingback header
- **Benefit**: Closes common attack vector

### disableFileEditors.php
**Disables theme and plugin file editors in admin**
- Sets `DISALLOW_FILE_EDIT` constant
- Removes "Edit" option from Appearance and Plugins menus
- **Benefit**: Prevents code injection if admin account is compromised

### fixLoginSecurity.php
**Prevents user enumeration attacks**
- Generic login error messages (doesn't reveal if username exists)
- Blocks REST API user endpoint
- Blocks author archive pages
- **Benefit**: Attackers can't discover valid usernames

### disablePingbacks.php
**Disables pingback functionality**
- Removes pingback methods from XML-RPC
- Prevents DDoS attacks via pingback
- **Benefit**: Closes pingback attack vector

### blockSensitiveFiles.php
**Blocks access to sensitive files**
- Blocks: readme.html, license.txt, wp-config.php, error logs, backups
- Prevents version disclosure
- **Benefit**: Hides WordPress version and sensitive information

### additionalSecurityHeaders.php
**Adds modern security headers**
- X-Download-Options: noopen
- X-Permitted-Cross-Domain-Policies: none
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Resource-Policy: same-origin
- Feature-Policy restrictions
- Secure cookie flags (HttpOnly, Secure, SameSite=Strict)
- **Benefit**: Defense-in-depth protection against XSS, clickjacking, CSRF

### disableApplicationPasswords.php
**Disables WordPress Application Passwords**
- Removes application password authentication
- Removes REST API endpoints for app passwords
- **Benefit**: Reduces attack surface, simplifies authentication

---

## ⚡ Performance Utilities

### optimizeHeartbeat.php
**Slows down WordPress Heartbeat API**
- Changes interval from 15s to 60s
- Disables on frontend
- **Benefit**: Reduces server load, fewer AJAX requests
- **Savings**: ~75% reduction in heartbeat requests

### disableEmojis.php
**Removes WordPress emoji scripts and styles**
- Removes wp-emoji-release.min.js
- Removes emoji detection script
- **Benefit**: Faster page load
- **Savings**: ~15KB + 2 HTTP requests

### disableEmbeds.php
**Removes WordPress oEmbed functionality**
- Removes wp-embed.js
- Removes oEmbed discovery links
- **Benefit**: Faster page load if you don't use embeds
- **Savings**: ~7KB + 1 HTTP request

### removeJqueryMigrate.php
**Removes jQuery Migrate script**
- Removes jquery-migrate.min.js dependency
- **Benefit**: Faster page load
- **Savings**: ~10KB + 1 HTTP request
- **Note**: Only enable if your scripts work without jQuery Migrate

### limitPostRevisions.php
**Limits post revisions to 2**
- Sets WP_POST_REVISIONS to 2
- Auto-deletes old revisions beyond limit
- **Benefit**: Smaller database, faster queries
- **Savings**: Reduces database bloat

### disableDashiconsFrontend.php
**Removes Dashicons CSS from frontend**
- Only loads Dashicons for logged-in users
- **Benefit**: Faster page load for visitors
- **Savings**: ~50KB + 1 HTTP request

### disableWpCron.php
**Disables WP-Cron in favor of system cron**
- Sets DISABLE_WP_CRON constant
- Adds Site Health check
- **Benefit**: Faster page loads, more reliable scheduled tasks
- **⚠️ IMPORTANT**: You must set up system cron (see setup instructions below)

### disableAutosave.php
**Disables post autosave**
- Removes autosave functionality in editor
- **Benefit**: Reduces AJAX requests while editing
- **Note**: Use "Save Draft" manually

---

## 🎨 Admin Cleanup Utilities

### disableGutenberg.php
**Disables Gutenberg block editor**
- Reverts to Classic Editor
- Disables block-based widgets editor
- **Benefit**: Cleaner, faster admin for classic editor users

### removeDashboardWidgets.php
**Removes default WordPress dashboard widgets**
- Removes: Quick Draft, Activity, WordPress News, At a Glance, etc.
- **Benefit**: Cleaner, faster-loading dashboard

### disableComments.php
**Disables comments system completely**
- Removes comments from all post types
- Hides comments menu
- Removes comments from admin bar
- **Benefit**: Cleaner admin if you don't use comments

### hideAdminNotices.php
**Hides admin update notices for non-admins**
- Hides plugin update notices
- Hides theme update notices
- Only shows to administrators
- **Benefit**: Cleaner admin interface for editors/authors

### disableScreenOptions.php
**Removes Screen Options and Help tabs**
- Hides "Screen Options" tab
- Removes help tabs from all admin pages
- **Benefit**: Cleaner, simpler admin interface

### removeAdminFooter.php
**Removes WordPress version from admin footer**
- Cleans up admin footer text
- **Benefit**: Cleaner admin, minor security (hides version)

### disableAdminBarFrontend.php
**Removes admin bar from frontend**
- Hides admin bar for all users on frontend
- Still visible in admin area
- **Benefit**: Cleaner frontend for logged-in users

### simplifyAdminMenu.php
**Removes unused admin menu items**
- Easy-to-edit configuration array
- Customize which menu items to show/hide
- **Benefit**: Cleaner navigation, faster admin
- **Configuration**: Edit array at top of file

### cleanWpHead.php
**Removes unnecessary meta tags from &lt;head&gt;**
- Removes: wp_generator, wlwmanifest_link, shortlink, REST API links, etc.
- **Benefit**: Cleaner HTML, minor security (hides version)

---

## 🚀 Total Performance Impact

With all performance utilities enabled:

| Metric | Improvement |
|--------|-------------|
| **Frontend page load** | ~100KB lighter, 6 fewer HTTP requests |
| **Admin page load** | ~50% faster dashboard loading |
| **Database size** | Significantly smaller (revisions limited) |
| **Server load** | Reduced AJAX requests (heartbeat, autosave, cron) |

---

## ⚠️ Important Setup Instructions

### System Cron Setup (Required if using disableWpCron.php)

WP-Cron has been disabled for better performance. You **must** set up system cron!

#### Linux/Unix Server (via cPanel or SSH)

**Using wget:**
```bash
*/15 * * * * wget -q -O - https://your-site.com/wp-cron.php &>/dev/null
```

**Using curl:**
```bash
*/15 * * * * curl -s https://your-site.com/wp-cron.php &>/dev/null
```

#### cPanel Setup

1. Log into cPanel
2. Go to **Advanced** → **Cron Jobs**
3. Click **Add New Cron Job**
4. Set interval: **Every 15 minutes**
5. Enter command:
   ```bash
   wget -q -O - https://your-site.com/wp-cron.php &>/dev/null
   ```
6. Click **Add New Cron Job**

#### WP-CLI Alternative (Recommended for VPS/Dedicated)

```bash
*/15 * * * * cd /path/to/wordpress && wp cron event run --due-now &>/dev/null
```

#### Recommended Intervals

| Interval | Cron Syntax | Use Case |
|----------|-------------|----------|
| Every 5 minutes | `*/5 * * * *` | High-frequency sites |
| Every 15 minutes | `*/15 * * * *` | **Recommended** |
| Every 30 minutes | `*/30 * * * *` | Low-frequency sites |
| Every hour | `0 * * * *` | Minimal tasks |

#### Verify Cron is Working

1. Install **WP Crontrol** plugin (optional)
2. Or check: **Tools** → **Site Health** → **Info** → **WordPress Constants** → `DISABLE_WP_CRON = true`

---

## 🎯 Recommended Configuration

### For Production Sites
Enable all utilities except:
- `disableGutenberg.php` - Only if you prefer Classic Editor
- `disableComments.php` - Only if you don't use comments

### For High-Performance Sites
Enable all performance utilities + system cron

### For Maximum Security
Enable all security utilities

---

## 📝 Notes

- All utilities follow WordPress coding standards
- All files have ABSPATH protection
- All inputs are sanitized, outputs are escaped
- No database modifications (except limitPostRevisions cleanup)
- Easy to enable/disable - just add/remove files
- Automatically loaded by UtilitiesManager

---

## 🔧 Customization

### simplifyAdminMenu.php
Edit the configuration array at the top of the file:

```php
$menu_items_to_remove = [
    'posts'    => true,   // Set to true to REMOVE
    'media'    => false,  // Set to false to KEEP
    // ...
];
```

### limitPostRevisions.php
Change the revision limit in the constant:

```php
define('WP_POST_REVISIONS', 2); // Change number as needed
```

### optimizeHeartbeat.php
Adjust heartbeat interval:

```php
$settings['interval'] = 60; // Change seconds as needed
```

---

## 📚 Resources

- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/)
- [WordPress Security Best Practices](https://wordpress.org/support/article/hardening-wordpress/)
- [WordPress Performance Optimization](https://developer.wordpress.org/advanced-administration/performance/optimization/)

---

**Questions?** All utilities are well-documented with inline comments. Check individual files for detailed explanations.
