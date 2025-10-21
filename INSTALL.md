# Core Theme - Installation Guide

This guide will walk you through the installation process for the Core Theme WordPress theme.

## Prerequisites

Before installing the theme, ensure your WordPress installation meets the following requirements:

- **WordPress Version**: 5.9 or higher
- **PHP Version**: 8.0 or higher
- **Composer**: Required for dependency management (Timber library)
- **Server Access**: SSH or FTP access to run Composer commands

## Installation Steps

### Step 1: Install Composer Dependencies

The Core Theme uses Composer to manage its PHP dependencies, including the Timber library. You have two options:

**Option A: Install Dependencies After Upload (Recommended)**

If you have SSH access to your server:

1. First, upload the theme (see Step 2)
2. SSH into your server
3. Navigate to the theme directory:
   ```bash
   cd /path/to/wp-content/themes/core-theme
   ```
4. Install production dependencies:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

**Option B: Pre-Install Dependencies Locally**

If you don't have Composer on your server or prefer to prepare the theme locally:

1. Extract the theme ZIP on your local machine
2. Open a terminal in the extracted `core-theme` directory
3. Run Composer:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```
4. Re-zip the entire `core-theme` folder (now including the `vendor` directory)
5. Upload this complete package to your server

**Note**: The `vendor` directory contains all PHP dependencies including Timber and is required for the theme to function.

### Step 2: Upload the Theme

**Option A: Upload via WordPress Admin Panel**
1. Log in to your WordPress admin panel
2. Navigate to **Appearance** → **Themes**
3. Click **Add New** at the top
4. Click **Upload Theme**
5. Click **Choose File** and select the `core-theme_XXXXXXXX_XXXXXX.zip` file
6. Click **Install Now**
7. Wait for the upload and installation to complete

**Option B: Upload via FTP/SFTP**
1. Unzip the `core-theme_XXXXXXXX_XXXXXX.zip` file on your local computer
2. Connect to your server via FTP/SFTP
3. Navigate to `/wp-content/themes/`
4. Upload the entire `core-theme` folder to this directory

**Option C: Upload via WP-CLI**
```bash
wp theme install /path/to/core-theme_XXXXXXXX_XXXXXX.zip
```

### Step 3: Activate the Theme

**Before activating**, ensure that:
- ✅ Composer dependencies are installed (including Timber library)
- ✅ The `vendor` directory exists in the theme folder
- ✅ Your WordPress version meets the minimum requirements
- ✅ Your PHP version is 8.0 or higher

**Option A: Activate via WordPress Admin Panel**
1. Navigate to **Appearance** → **Themes**
2. Find the "Core Theme" theme
3. Click **Activate**

**Option B: Activate via WP-CLI**
```bash
wp theme activate core-theme
```

### Step 4: Verify Installation

After activation, verify the theme is working correctly:

1. Visit your website's homepage
2. Check that the site loads without errors
3. Verify that the theme's styles are applied correctly
4. Check the browser console for any JavaScript errors

## Post-Installation Configuration

### Recommended Settings

1. **Permalinks**: Navigate to **Settings** → **Permalinks** and select a SEO-friendly structure (recommended: "Post name")
2. **Reading Settings**: Configure your homepage display preferences at **Settings** → **Reading**

### Theme Features

The Core Theme includes:
- Modern asset pipeline with Vite
- Vue 3 components support
- Timber/Twig templating
- Security hardening features
- Built-in performance optimizations

## Troubleshooting

### White Screen or Fatal Error

If you encounter a white screen or fatal error after activation:

1. **Check Composer Dependencies**: The most common issue is missing dependencies
   - Verify the `vendor` directory exists in the theme folder
   - Check that `vendor/autoload.php` file exists
   - If missing, run: `composer install --no-dev --optimize-autoloader`
2. **Check Timber Installation**: Ensure Timber library is in `vendor/timber/timber`
3. **Check PHP Version**: Verify your server is running PHP 8.0 or higher
4. **Enable Debug Mode**: Add these lines to `wp-config.php`:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```
5. **Check Error Logs**: Review `/wp-content/debug.log` for specific error messages

### Theme Not Displaying Correctly

1. **Clear Cache**: Clear your browser cache and any WordPress caching plugins
2. **Check File Permissions**: Ensure proper file permissions (644 for files, 755 for directories)
3. **Regenerate Assets**: If you have access to the source files, run `npm run build`

### Need Help?

If you continue to experience issues:
- Check the WordPress error logs
- Verify all prerequisites are met
- Ensure no plugin conflicts exist (temporarily disable other plugins to test)
- Contact your hosting provider to confirm server requirements

## Uninstallation

To remove the theme:

1. **Activate a Different Theme**: You cannot delete an active theme
   - Navigate to **Appearance** → **Themes**
   - Activate a different theme (e.g., a default WordPress theme)

2. **Delete the Theme**:
   - Navigate to **Appearance** → **Themes**
   - Find "Core Theme"
   - Click **Theme Details** → **Delete**
   - Confirm the deletion

## Additional Resources

- [Timber Documentation](https://timber.github.io/docs/)
- [WordPress Theme Development](https://developer.wordpress.org/themes/)
- [Twig Template Documentation](https://twig.symfony.com/doc/)

---

**Version**: 1.0.0
**Last Updated**: October 2025
