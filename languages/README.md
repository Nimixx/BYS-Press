# Translation Files

This directory contains translation files for the Core Theme.

## Available Translations

- **English (default)** - Built into the theme
- **Czech (cs_CZ)** - Ready to be added

## File Types

- **`.pot`** - Portable Object Template (source template for all translations, tracked in git)
- **`.po`** - Portable Object (human-readable translation file, tracked in git)
- **`.mo`** - Machine Object (compiled translation file, NOT tracked in git, auto-generated)

## Adding a New Translation

### Method 1: Using Poedit (Recommended for non-developers)

1. Download and install [Poedit](https://poedit.net/)
2. Open Poedit and click "Create new translation"
3. Select `core-theme.pot` from this directory
4. Choose your language (e.g., Czech - cs_CZ)
5. Translate the strings
6. Save the file - Poedit will create both `.po` and `.mo` files
7. Upload both files to this directory on your server

### Method 2: Using Loco Translate Plugin

1. Install the [Loco Translate](https://wordpress.org/plugins/loco-translate/) plugin
2. Go to **Loco Translate → Themes** in WordPress admin
3. Select **Core Theme**
4. Click "New language"
5. Choose your language and start translating
6. Click "Save" when done

### Method 3: Manual Translation

1. Copy `core-theme.pot` to `core-theme-cs_CZ.po` (for Czech)
2. Edit the `.po` file with a text editor
3. Update the header information:
   ```
   "Language: cs_CZ\n"
   "Language-Team: Your Team <email@example.com>\n"
   ```
4. Translate each `msgstr ""` line
5. Compile to `.mo` file using:
   ```bash
   wp i18n make-mo languages/ languages/
   ```

## Czech Translation Example

To create a Czech translation:

```bash
# Copy the POT file to create a Czech PO file
cp core-theme.pot core-theme-cs_CZ.po

# Edit core-theme-cs_CZ.po and translate the strings
# Then compile to MO file
wp i18n make-mo languages/ languages/
```

Example translations for Czech:
- "Primary Menu" → "Hlavní menu"
- "Footer Menu" → "Menu v patičce"

## Testing Translations

1. Upload the `.po` and `.mo` files to this directory
2. Go to **Settings → General** in WordPress admin
3. Change **Site Language** to your language
4. Visit your site to see the translated strings

## Updating Translations

When the theme is updated with new translatable strings:

```bash
# Regenerate the POT file
wp i18n make-pot . languages/core-theme.pot --domain=core-theme

# Update existing PO files with new strings
wp i18n update-po languages/core-theme.pot languages/
```

## File Naming Convention

Translation files must follow this naming pattern:
- `core-theme-{locale}.po` - e.g., `core-theme-cs_CZ.po` for Czech
- `core-theme-{locale}.mo` - e.g., `core-theme-cs_CZ.mo` for Czech

Common locale codes:
- Czech: `cs_CZ`
- German: `de_DE`
- French: `fr_FR`
- Spanish: `es_ES`
- Italian: `it_IT`

## Resources

- [WordPress i18n Documentation](https://developer.wordpress.org/apis/internationalization/)
- [List of Language Codes](https://make.wordpress.org/polyglots/teams/)
- [Poedit](https://poedit.net/)
- [Loco Translate Plugin](https://wordpress.org/plugins/loco-translate/)
