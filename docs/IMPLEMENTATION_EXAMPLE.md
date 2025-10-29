# Component Registry - Implementation Example

This document shows **exactly how** to add client-friendly page building to your current architecture without breaking anything.

---

## Quick Start: Add Your First Flexible Component

### Step 1: Install ACF Pro (if not already)

```bash
composer require wpengine/advanced-custom-fields-pro
```

### Step 2: Create Component Registry Class

**File:** `inc/ComponentRegistry.php`

```php
<?php
/**
 * Component Registry
 *
 * Central registry for all page builder components
 * Maps ACF flexible content to Twig templates
 *
 * @package CoreTheme
 * @since 2.0.0
 */

namespace CoreTheme;

class ComponentRegistry
{
    /**
     * Registered components
     */
    private static array $components = [];

    /**
     * Register a component
     *
     * @param string $key Unique component key
     * @param array $config Component configuration
     */
    public static function register(string $key, array $config): void
    {
        self::$components[$key] = array_merge([
            'name' => '',
            'category' => 'content',
            'icon' => 'layout',
            'template' => '',
            'fields' => [],
            'preview' => null,
        ], $config);
    }

    /**
     * Get all registered components
     */
    public static function all(): array
    {
        return self::$components;
    }

    /**
     * Get component by key
     */
    public static function get(string $key): ?array
    {
        return self::$components[$key] ?? null;
    }

    /**
     * Generate ACF flexible content layouts
     */
    public static function getAcfLayouts(): array
    {
        $layouts = [];

        foreach (self::$components as $key => $component) {
            $layouts[$key] = [
                'key' => 'layout_' . $key,
                'name' => $key,
                'label' => $component['name'],
                'display' => 'block',
                'sub_fields' => self::convertFieldsToAcf($component['fields'], $key),
            ];
        }

        return $layouts;
    }

    /**
     * Convert field config to ACF format
     */
    private static function convertFieldsToAcf(array $fields, string $parentKey): array
    {
        $acfFields = [];

        foreach ($fields as $fieldKey => $config) {
            $acfFields[] = array_merge([
                'key' => "field_{$parentKey}_{$fieldKey}",
                'name' => $fieldKey,
                'label' => $config['label'] ?? ucfirst(str_replace('_', ' ', $fieldKey)),
                'type' => $config['type'] ?? 'text',
            ], $config['acf'] ?? []);
        }

        return $acfFields;
    }
}
```

### Step 3: Create Component Definition

**File:** `inc/Components/HeroComponent.php`

```php
<?php
/**
 * Hero Component Definition
 *
 * Registers Hero component for page builder
 *
 * @package CoreTheme\Components
 * @since 2.0.0
 */

namespace CoreTheme\Components;

use CoreTheme\ComponentRegistry;

class HeroComponent
{
    /**
     * Initialize component
     */
    public static function init(): void
    {
        ComponentRegistry::register('hero', [
            'name' => 'Hero Section',
            'category' => 'layout',
            'icon' => 'cover-image',
            'template' => 'components/Hero/Hero.twig',

            'fields' => [
                'title' => [
                    'label' => 'Title',
                    'type' => 'text',
                    'acf' => [
                        'required' => true,
                        'default_value' => 'Welcome to Our Site'
                    ]
                ],
                'subtitle' => [
                    'label' => 'Subtitle',
                    'type' => 'textarea',
                    'acf' => [
                        'rows' => 3,
                    ]
                ],
                'background_image' => [
                    'label' => 'Background Image',
                    'type' => 'image',
                    'acf' => [
                        'return_format' => 'array',
                        'preview_size' => 'medium',
                    ]
                ],
                'variant' => [
                    'label' => 'Style Variant',
                    'type' => 'select',
                    'acf' => [
                        'choices' => [
                            'default' => 'Default',
                            'minimal' => 'Minimal',
                            'full-height' => 'Full Height',
                        ],
                        'default_value' => 'default'
                    ]
                ],
                'cta_button' => [
                    'label' => 'Call to Action',
                    'type' => 'group',
                    'acf' => [
                        'sub_fields' => [
                            [
                                'key' => 'field_hero_cta_text',
                                'name' => 'text',
                                'label' => 'Button Text',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_hero_cta_url',
                                'name' => 'url',
                                'label' => 'Button URL',
                                'type' => 'url',
                            ],
                        ]
                    ]
                ],
            ],
        ]);
    }
}
```

### Step 4: Create the Twig Template

**File:** `components/Hero/Hero.twig`

```twig
{#
  Hero Component

  Full-width hero section with title, subtitle, background, and CTA
  Supports multiple style variants

  @param {string} title - Main heading
  @param {string} subtitle - Optional subtitle text
  @param {object} background_image - Background image object
  @param {string} variant - Style variant: default, minimal, full-height
  @param {object} cta_button - Call to action button data
#}

<section class="hero hero--{{ variant|default('default') }}">
  {% if background_image %}
    <div class="hero__background">
      <img
        src="{{ background_image.sizes.large|default(background_image.url) }}"
        alt="{{ background_image.alt }}"
        class="hero__background-image"
      >
    </div>
  {% endif %}

  <div class="hero__container">
    <div class="hero__content">
      {% if title %}
        <h1 class="hero__title">{{ title }}</h1>
      {% endif %}

      {% if subtitle %}
        <p class="hero__subtitle">{{ subtitle }}</p>
      {% endif %}

      {% if cta_button and cta_button.text and cta_button.url %}
        <div class="hero__actions">
          <a href="{{ cta_button.url }}" class="button button--primary button--large">
            {{ cta_button.text }}
          </a>
        </div>
      {% endif %}
    </div>
  </div>
</section>
```

### Step 5: Create Component CSS

**File:** `components/Hero/Hero.css`

```css
/**
 * Hero Component
 *
 * Full-width hero section with background and content
 */

.hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* Full height variant */
.hero--full-height {
  min-height: 100vh;
}

/* Minimal variant */
.hero--minimal {
  min-height: 400px;
}

.hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: var(--space-16) var(--space-4);
  position: relative;
  z-index: 1;
}

.hero__content {
  max-width: 700px;
}

.hero__title {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  color: var(--color-text);
  margin: 0 0 var(--space-4);
  line-height: var(--leading-tight);
}

.hero__subtitle {
  font-size: var(--text-xl);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-8);
  line-height: var(--leading-relaxed);
}

.hero__actions {
  display: flex;
  gap: var(--space-4);
}

/* Button styles */
.button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.button--primary {
  background: var(--color-primary-600);
  color: white;
}

.button--primary:hover {
  background: var(--color-primary-700);
}

.button--large {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
}
```

### Step 6: Register ACF Fields

**File:** `inc/FieldGroups/PageBuilderFieldGroup.php`

```php
<?php
/**
 * Page Builder Field Group
 *
 * Registers ACF flexible content field for page building
 *
 * @package CoreTheme\FieldGroups
 * @since 2.0.0
 */

namespace CoreTheme\FieldGroups;

use CoreTheme\ComponentRegistry;

class PageBuilderFieldGroup
{
    /**
     * Initialize field group
     */
    public static function init(): void
    {
        if (!function_exists('acf_add_local_field_group')) {
            return;
        }

        acf_add_local_field_group([
            'key' => 'group_page_builder',
            'title' => 'Page Builder',
            'fields' => [
                [
                    'key' => 'field_page_components',
                    'label' => 'Page Components',
                    'name' => 'page_components',
                    'type' => 'flexible_content',
                    'instructions' => 'Add and arrange components to build your page.',
                    'button_label' => 'Add Component',
                    'layouts' => ComponentRegistry::getAcfLayouts(),
                ],
            ],
            'location' => [
                [
                    [
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'page',
                    ],
                ],
            ],
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
        ]);
    }
}
```

### Step 7: Initialize Everything

**File:** `inc/Theme.php` (update boot method)

```php
public function boot(): void
{
    // ... existing code ...

    // Initialize component registry
    $this->initializeComponents();

    // Initialize ACF field groups
    add_action('acf/init', [$this, 'initializeFieldGroups']);
}

/**
 * Initialize all components
 */
private function initializeComponents(): void
{
    // Register components
    \CoreTheme\Components\HeroComponent::init();
    // Add more components here as you build them
}

/**
 * Initialize ACF field groups
 */
public function initializeFieldGroups(): void
{
    \CoreTheme\FieldGroups\PageBuilderFieldGroup::init();
}
```

### Step 8: Create Page Template

**File:** `pages/PageBuilder/PageBuilder.php`

```php
<?php
/**
 * Template Name: Page Builder
 *
 * Flexible page builder template
 *
 * @package CoreTheme\Pages
 */

use Timber\Timber;
use CoreTheme\ComponentRegistry;

$context = Timber::context();
$post = Timber::get_post();
$context['post'] = $post;

// Get page components from ACF
$page_components = get_field('page_components', $post->ID);

if ($page_components) {
    $components = [];

    foreach ($page_components as $component_data) {
        $component_type = $component_data['acf_fc_layout'];
        $component_config = ComponentRegistry::get($component_type);

        if ($component_config) {
            $components[] = [
                'template' => $component_config['template'],
                'data' => $component_data,
            ];
        }
    }

    $context['components'] = $components;
}

Timber::render('pages/PageBuilder/PageBuilder.twig', $context);
```

**File:** `pages/PageBuilder/PageBuilder.twig`

```twig
{% extends "layouts/Base/Base.twig" %}

{% block content %}
  {# Render each component #}
  {% if components %}
    {% for component in components %}
      {% include component.template with component.data %}
    {% endfor %}
  {% else %}
    <div class="container">
      <p>No components added yet. Edit this page to start building!</p>
    </div>
  {% endif %}
{% endblock %}
```

---

## Usage Example

### For Developers

1. Create new component:
```bash
# Create folder
mkdir -p components/Features

# Create files
touch components/Features/Features.twig
touch components/Features/Features.css
```

2. Define component:
```php
// inc/Components/FeaturesComponent.php
ComponentRegistry::register('features', [
    'name' => 'Features Grid',
    'template' => 'components/Features/Features.twig',
    'fields' => [
        'title' => ['type' => 'text'],
        'features' => [
            'type' => 'repeater',
            'acf' => [
                'sub_fields' => [
                    ['name' => 'icon', 'type' => 'image'],
                    ['name' => 'title', 'type' => 'text'],
                    ['name' => 'description', 'type' => 'textarea'],
                ]
            ]
        ]
    ]
]);
```

3. That's it! Component appears in page builder automatically.

### For Clients

1. Edit page in WordPress
2. Click "Add Component"
3. Choose "Hero Section"
4. Fill in title, subtitle, etc.
5. Click "Add Component" again
6. Choose "Features Grid"
7. Add features
8. Publish!

---

## Benefits of This Approach

✅ **Developer-Friendly**
- Work in code with Twig/CSS
- Auto-loading works
- Version control friendly
- Type-safe with validation

✅ **Client-Friendly**
- Visual interface
- No code knowledge needed
- Live preview available
- Can't break things

✅ **Maintainable**
- Components in one place
- Easy to update
- Registry keeps it organized
- Documentation auto-generated

✅ **Flexible**
- Start with 1 component
- Add more as needed
- Remove Gutenberg completely
- Keep your architecture

---

## Next Steps

1. **Week 1:** Implement ComponentRegistry + HeroComponent
2. **Week 2:** Add 3 more components (Features, CTA, Testimonials)
3. **Week 3:** Create page template + test with client
4. **Week 4:** Add documentation + refine based on feedback

---

## FAQs

**Q: Do I have to use ACF?**
A: No, but it's the easiest. You could use Gutenberg, but it's more complex.

**Q: Can I still edit templates directly?**
A: Yes! Page builder is optional. Keep building custom pages.

**Q: What about existing pages?**
A: They work as-is. Only new pages use page builder.

**Q: How do I version control ACF fields?**
A: Use ACF Local JSON (it auto-syncs to git).

**Q: Can I have multiple page builder templates?**
A: Yes! Create PageBuilderLanding.php, PageBuilderSales.php, etc.

---

This is a **starting point**. Build incrementally based on what you actually need. Don't over-engineer!
