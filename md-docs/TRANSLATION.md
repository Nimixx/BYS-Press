# Translation Guide

This guide explains how to make your theme translatable and how to add new languages.

## Overview

Core Theme is fully translation-ready with:
- ✅ Text domain: `core-theme`
- ✅ Translation files location: `languages/`
- ✅ POT template file included
- ✅ Czech (cs_CZ) translation included as example

## For Developers: Making Strings Translatable

### PHP Files

Use WordPress translation functions to make strings translatable:

```php
// Simple string translation
__('Text to translate', 'core-theme')

// Translation with echo
_e('Text to translate', 'core-theme')

// Translation with variables (sprintf)
sprintf(__('Hello %s', 'core-theme'), $name)

// Plural forms
_n('One item', '%s items', $count, 'core-theme')

// Translation with context (when same word has different meanings)
_x('Post', 'noun', 'core-theme')
_x('Post', 'verb', 'core-theme')

// Escaped translations (safe for attributes)
esc_html__('Text to translate', 'core-theme')
esc_attr__('Text to translate', 'core-theme')
```

**Important:** Always use `'core-theme'` as the text domain (second parameter).

### Twig Templates

In Twig templates, you can use the `__` function:

```twig
{# Simple translation #}
<h1>{{ __('Welcome', 'core-theme') }}</h1>

{# Translation with variables #}
<p>{{ __('Posted by %s', 'core-theme')|format(post.author.name) }}</p>

{# Escaped translation #}
<input placeholder="{{ __('Search...', 'core-theme')|e('html_attr') }}">
```

### JavaScript/TypeScript

For translatable strings in JavaScript, you have two options:

**Option 1: Use `wp_localize_script()` in PHP**

```php
// In inc/Assets.php
wp_localize_script('main-js', 'coreThemeL10n', [
    'searchPlaceholder' => __('Search...', 'core-theme'),
    'loading' => __('Loading...', 'core-theme'),
]);
```

```typescript
// In your TypeScript file
declare global {
    interface Window {
        coreThemeL10n: {
            searchPlaceholder: string;
            loading: string;
        };
    }
}

console.log(window.coreThemeL10n.searchPlaceholder);
```

**Option 2: Use `wp.i18n` (WordPress 5.0+)**

```typescript
import { __ } from '@wordpress/i18n';

const message = __('Hello World', 'core-theme');
```

## Regenerating Translation Files

When you add new translatable strings to your theme, you need to regenerate the POT file:

```bash
# Navigate to theme directory
cd wp-content/themes/core-theme

# Regenerate POT file
wp i18n make-pot . languages/core-theme.pot --domain=core-theme

# Update existing PO files with new strings
wp i18n update-po languages/core-theme.pot languages/

# Compile PO files to MO files
wp i18n make-mo languages/ languages/
```

## For Translators: Adding a New Language

### Method 1: Using Poedit (Recommended)

1. Download [Poedit](https://poedit.net/) (free)
2. Open Poedit → "Create new translation"
3. Select `languages/core-theme.pot`
4. Choose your language
5. Translate all strings
6. Save (creates both `.po` and `.mo` files)
7. Upload files to `wp-content/themes/core-theme/languages/`

### Method 2: Using Loco Translate Plugin

1. Install [Loco Translate](https://wordpress.org/plugins/loco-translate/) plugin
2. Go to **Loco Translate → Themes → Core Theme**
3. Click "New language"
4. Select your language and click "Start translating"
5. Translate strings and click "Save"

### Method 3: Manual (Advanced)

```bash
# Copy POT to new language file
cp languages/core-theme.pot languages/core-theme-de_DE.po

# Edit the PO file and translate strings
# Update header with your language info

# Compile to MO file
wp i18n make-mo languages/ languages/
```

## Testing Translations

1. Upload translation files to `languages/` directory
2. Go to **Settings → General** in WordPress admin
3. Change **Site Language** to your language
4. Visit your site to see translated strings

## Available Translations

- **English** - Default (built into theme)
- **Czech (cs_CZ)** - Included, ready to use
- **Your Language** - Add it using the guide above!

## Translation File Naming

Translation files must follow WordPress naming conventions:

- POT template: `core-theme.pot`
- PO file: `core-theme-{locale}.po`
- MO file: `core-theme-{locale}.mo`

Common locale codes:
- Czech: `cs_CZ`
- German: `de_DE`
- French: `fr_FR`
- Spanish: `es_ES`
- Italian: `it_IT`
- Polish: `pl_PL`
- Dutch: `nl_NL`
- Portuguese (Brazil): `pt_BR`
- Russian: `ru_RU`

[Full list of WordPress locale codes](https://make.wordpress.org/polyglots/teams/)

## Current Translatable Strings

The theme currently has **8 translatable strings**:

1. Theme Name
2. Theme Description
3. Primary Menu
4. Footer Menu
5. Author name
6. Author URL
7. Theme URL
8. (Additional strings as you add them)

## Best Practices

### For Developers

1. **Always use text domain**: Every translation function must include `'core-theme'`
2. **Use placeholders for variables**: `sprintf(__('Posted on %s', 'core-theme'), $date)`
3. **Provide context**: Use `_x()` when the same word has different meanings
4. **Don't translate URLs or code**: Only translate user-facing text
5. **Regenerate POT file**: After adding new strings, update the POT file
6. **Test in multiple languages**: Install Czech translation to verify everything works

### For Translators

1. **Keep the same formatting**: If the original has `%s`, keep it in translation
2. **Preserve HTML tags**: `<strong>Bold</strong>` should stay as tags
3. **Mind the context**: Read code comments (starting with `#.` in PO files)
4. **Use proper grammar**: Translate meaning, not word-by-word
5. **Test your translation**: Change WordPress language to see your work

## Troubleshooting

### Translations not showing

**Check:**
1. WordPress language is set correctly (**Settings → General**)
2. `.mo` file exists in `languages/` directory
3. File is named correctly: `core-theme-cs_CZ.mo` (not just `cs_CZ.mo`)
4. Text domain in code matches: `'core-theme'`
5. Clear all caches (WordPress, browser, server)

### Missing translations

**Solution:**
1. Check if string is using translation function: `__('text', 'core-theme')`
2. Regenerate POT file to include new strings
3. Update your PO file with new strings
4. Recompile MO file

### Wrong language loads

**Check:**
1. WordPress language setting (**Settings → General**)
2. User language preference (**Users → Your Profile**)
3. Language file naming matches WordPress locale exactly

## Resources

- [WordPress i18n Documentation](https://developer.wordpress.org/apis/internationalization/)
- [WordPress Polyglots Handbook](https://make.wordpress.org/polyglots/handbook/)
- [Poedit](https://poedit.net/)
- [Loco Translate Plugin](https://wordpress.org/plugins/loco-translate/)
- [Language Codes List](https://make.wordpress.org/polyglots/teams/)

## Contributing Translations

If you translate Core Theme to your language:

1. Test thoroughly
2. Create a pull request on GitHub with your `.po` file
3. Or email the `.po` file to the theme author
4. Help others by sharing your translation!

---

**Need help?** Check the README.md in the `languages/` directory for quick reference.
