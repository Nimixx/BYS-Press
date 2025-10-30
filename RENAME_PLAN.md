# BYS Press Theme Rename Plan

## Overview
Complete rename of the WordPress theme from "Core Theme" to "BYS Press"

## Naming Conventions

### Current → New
| Type | Current | New |
|------|---------|-----|
| **Namespace** | `CoreTheme` | `BYSPress` |
| **Text Domain** | `core-theme` | `bys-press` |
| **Function Prefix** | `core_theme()` | `bys_press()` |
| **Variable Prefix** | `$coreTheme` | `$bysPress` |
| **Package Name** | `core-theme/wordpress-theme` | `bys-press/wordpress-theme` |
| **NPM Package** | `core-theme` | `bys-press` |

## Detailed Rename Steps

### 1. PHP Namespaces (54 files)
**Pattern**: `namespace CoreTheme` → `namespace BYSPress`

**Files to update**:
- `/inc/*.php` (main classes)
- `/inc/Assets/*.php` (asset management)
- `/inc/Security/*.php` (security classes)
- `/inc/Context/**/*.php` (context providers)
- `/components/**/*.php` (component classes)

**Subnamespaces to update**:
- `CoreTheme\Security` → `BYSPress\Security`
- `CoreTheme\Assets` → `BYSPress\Assets`
- `CoreTheme\Context` → `BYSPress\Context`
- `CoreTheme\Context\Processors` → `BYSPress\Context\Processors`
- `CoreTheme\Context\Providers` → `BYSPress\Context\Providers`
- `CoreTheme\Components` → `BYSPress\Components`
- `CoreTheme\Tests` → `BYSPress\Tests`

### 2. Text Domain Updates
**Pattern**: `'core-theme'` → `'bys-press'`

**Translation functions to check**:
- `__('text', 'core-theme')`
- `_e('text', 'core-theme')`
- `esc_html__('text', 'core-theme')`
- `esc_attr__('text', 'core-theme')`

**Key files**:
- `inc/ThemeSetup.php:87-88` (menu registrations)

### 3. Function Names
**Pattern**: `core_theme()` → `bys_press()`

**Files**:
- `functions.php:30` (main theme function)

### 4. Variable Names
**Pattern**: `$coreTheme` → `$bysPress`

**Files**:
- `functions.php:19,32` (global variable and return)

### 5. Composer Configuration
**File**: `composer.json`

**Updates**:
```json
{
  "name": "bys-press/wordpress-theme",
  "description": "BYS Press - Modern WordPress theme with Timber and Vite",
  "autoload": {
    "psr-4": {
      "BYSPress\\": "inc/"
    }
  },
  "autoload-dev": {
    "psr-4": {
      "BYSPress\\Tests\\": "tests/"
    }
  }
}
```

### 6. NPM Configuration
**File**: `package.json`

**Updates**:
```json
{
  "name": "bys-press",
  "author": "BYS Press Contributors",
  "description": "BYS Press - Modern WordPress theme with Timber, Vite, TypeScript, and Vue 3"
}
```

### 7. Theme Header (style.css)
**File**: `style.css`

**Updates**:
- Line 2: `Theme Name: BYS Press`
- Line 3: `Theme URI: [update to your URL]`
- Line 4: `Author: BYS Press Contributors`
- Line 5: `Author URI: [update to your URL]`
- Line 7: `Description: [update description]`
- Line 13: `Text Domain: bys-press`
- Line 17: `BYS Press - A modern WordPress development foundation`
- Line 53: `Documentation: [update to your URL]`

### 8. Documentation Files
**Files to update**:
- `README.md` (main documentation)
- `inc/utilities/README.md` (utilities documentation)

**Search and replace**:
- "Core Theme" → "BYS Press"
- "core-theme" → "bys-press"
- GitHub URLs and repository references

### 9. Docblocks and Comments
**Pattern**: `@package CoreTheme` → `@package BYSPress`

**All PHP files** containing docblocks need updating

### 10. Test Files
**File**: `tests/bootstrap.php`

**Updates**:
- Line 24: Update mock `__()` function if needed
- Update any test namespace references

## Execution Order

1. ✅ **Backup** - Commit current state or create backup
2. **PHP Namespaces** - Update all namespace declarations
3. **Use Statements** - Update all `use CoreTheme\...` statements
4. **Function Names** - Update function definitions and calls
5. **Variable Names** - Update variable names
6. **Text Domain** - Update all translation function calls
7. **Composer Config** - Update composer.json
8. **NPM Config** - Update package.json
9. **Theme Header** - Update style.css
10. **Docblocks** - Update @package tags
11. **Documentation** - Update README files
12. **Regenerate Autoloader** - Run `composer dump-autoload`
13. **Test** - Verify theme loads and functions correctly

## Post-Rename Tasks

### Required
- [ ] Run `composer dump-autoload` to regenerate autoloader
- [ ] Clear WordPress theme cache
- [ ] Test theme activation in WordPress
- [ ] Test all major functionality
- [ ] Check for PHP errors in debug.log
- [ ] Verify translations work correctly

### Optional
- [ ] Update .git repository URLs (if applicable)
- [ ] Update CI/CD configuration
- [ ] Update deployment scripts
- [ ] Update local development documentation

## Files Count Summary
- **PHP files with namespaces**: 54 files
- **Translation strings**: ~11 instances
- **Configuration files**: 2 (composer.json, package.json)
- **Documentation files**: 2+ (README.md, utilities/README.md)
- **Theme header**: 1 (style.css)

## Search Patterns for Verification

After rename, search for these patterns to ensure nothing was missed:

```bash
# Should return NO results after rename:
grep -r "CoreTheme" --include="*.php" .
grep -r "core_theme" --include="*.php" .
grep -r "'core-theme'" --include="*.php" .
grep -r "core-theme/wordpress-theme" .

# Should return results after rename:
grep -r "BYSPress" --include="*.php" .
grep -r "bys_press" --include="*.php" .
grep -r "'bys-press'" --include="*.php" .
```

## Notes
- **Case sensitivity**: Pay attention to PascalCase (BYSPress), kebab-case (bys-press), snake_case (bys_press)
- **Regex safe**: The rename is safe to do with find/replace as the names are unique
- **No conflicts**: No WordPress core or common plugin names conflict with "BYS Press"
- **URL safe**: "bys-press" works well for slugs, URLs, and file paths
