# Minimal Scaling Options

If full Component Registry feels like overkill, here are simpler alternatives that still improve client experience.

---

## Option 1: Simple ACF + Twig Partials (No Registry)

**Time to implement:** 1-2 hours
**Complexity:** Low
**Perfect for:** Single projects, technical clients

### How It Works

Just add ACF Flexible Content manually, reference your existing Twig templates.

**File:** `inc/FieldGroups/SimplePageBuilder.php`

```php
<?php
acf_add_local_field_group([
    'key' => 'simple_page_builder',
    'title' => 'Page Sections',
    'fields' => [
        [
            'key' => 'field_sections',
            'name' => 'sections',
            'type' => 'flexible_content',
            'button_label' => 'Add Section',
            'layouts' => [
                // Hero Section
                'hero' => [
                    'key' => 'layout_hero',
                    'name' => 'hero',
                    'label' => 'Hero',
                    'sub_fields' => [
                        [
                            'key' => 'field_hero_title',
                            'name' => 'title',
                            'label' => 'Title',
                            'type' => 'text',
                        ],
                        [
                            'key' => 'field_hero_image',
                            'name' => 'image',
                            'label' => 'Background Image',
                            'type' => 'image',
                        ],
                    ],
                ],
                // Add more layouts manually
            ],
        ],
    ],
    'location' => [
        [['param' => 'post_type', 'operator' => '==', 'value' => 'page']],
    ],
]);
```

**Template:** Just loop and include

```twig
{% for section in sections %}
  {% if section.acf_fc_layout == 'hero' %}
    {% include 'components/Hero/Hero.twig' with section %}
  {% endif %}
{% endfor %}
```

**Pros:**
- Super simple
- No new classes needed
- Works immediately

**Cons:**
- Manual field definitions
- Copy-paste for each component
- No registry benefits

---

## Option 2: Theme Customizer + Config Files

**Time to implement:** 2-4 hours
**Complexity:** Low
**Perfect for:** Global settings, consistent styling

### Extend Current assets.php Pattern

You already have `inc/Config/assets.php`. Just expand it:

```php
<?php
// inc/Config/components.php
return [
    'hero' => [
        'enabled' => true,
        'default_variant' => 'full-height',
        'show_on_homepage' => true,
        'content' => [
            'title' => 'Welcome to Our Site',
            'subtitle' => 'Build amazing things',
        ]
    ],
    'features' => [
        'enabled' => true,
        'columns' => 3,
        'items' => [
            [
                'icon' => '🚀',
                'title' => 'Fast',
                'description' => 'Lightning quick'
            ],
            // ...
        ]
    ],
];
```

Then load in template:

```php
$components = require get_template_directory() . '/inc/Config/components.php';
$context['hero'] = $components['hero'];
Timber::render('page.twig', $context);
```

**Add Theme Customizer Controls:**

```php
// inc/Customizer.php
$wp_customize->add_setting('hero_title');
$wp_customize->add_control('hero_title', [
    'label' => 'Hero Title',
    'section' => 'homepage',
    'type' => 'text',
]);
```

**Pros:**
- Native WordPress
- Live preview
- Easy client interface
- No plugins needed

**Cons:**
- Limited to global settings
- Not per-page
- Less flexible than page builder

---

## Option 3: Pre-built Page Templates

**Time to implement:** 1 hour per template
**Complexity:** Low
**Perfect for:** Common layouts, fast deployment

### Create Named Templates

```php
/**
 * Template Name: Landing Page
 */
```

**File:** `pages/LandingPage/LandingPage.php`

```php
<?php
use Timber\Timber;

$context = Timber::context();
$post = Timber::get_post();

// Pre-defined components with defaults
$context['hero'] = [
    'title' => get_field('hero_title') ?: $post->title,
    'subtitle' => get_field('hero_subtitle'),
    'image' => get_field('hero_image'),
];

$context['features'] = [
    'items' => get_field('features') ?: []
];

Timber::render('pages/LandingPage/LandingPage.twig', $context);
```

**File:** `pages/LandingPage/LandingPage.twig`

```twig
{% extends "layouts/Base/Base.twig" %}

{% block content %}
  {# Pre-defined layout #}
  {% include 'components/Hero/Hero.twig' with hero %}
  {% include 'components/Features/Features.twig' with features %}
  {% include 'components/CTA/CTA.twig' %}
{% endblock %}
```

**Then create simple ACF fields ONLY for content:**

```php
acf_add_local_field_group([
    'title' => 'Landing Page Content',
    'fields' => [
        ['name' => 'hero_title', 'type' => 'text'],
        ['name' => 'hero_subtitle', 'type' => 'text'],
        ['name' => 'features', 'type' => 'repeater', /* ... */],
    ],
    'location' => [
        [['param' => 'page_template', 'operator' => '==', 'value' => 'template-landing.php']]
    ]
]);
```

**Pros:**
- Fast to build
- Easy for clients (just fill in blanks)
- Pre-designed layouts
- Quality control

**Cons:**
- Less flexible
- Need new template for each layout
- Can't reorder sections

---

## Option 4: Documentation + Manual Coding

**Time to implement:** 4-6 hours
**Complexity:** Very Low
**Perfect for:** Developer-focused, complete control

### Just Document Everything

Create a component guide:

**File:** `docs/COMPONENTS.md`

```markdown
# Component Library

## Hero Component

**File:** `components/Hero/Hero.twig`

**Usage:**
```twig
{% include 'components/Hero/Hero.twig' with {
    title: "Welcome",
    subtitle: "Start here",
    image: post.thumbnail,
    variant: "full-height"
} %}
```

**Props:**
- `title` (string, required)
- `subtitle` (string, optional)
- `image` (object, optional)
- `variant` (string, optional): default | minimal | full-height

**Variants:**
![Hero Default](./screenshots/hero-default.png)
![Hero Minimal](./screenshots/hero-minimal.png)

## Features Grid Component
...
```

**Plus Screenshots:**
Take screenshots of each component in different states.

**For Clients:**
Show them the docs, or give them template PHP files they can copy/paste.

**Pros:**
- Zero setup time
- Complete flexibility
- No abstractions
- Works for technical users

**Cons:**
- Requires code knowledge
- Manual work
- Slower for clients

---

## Option 5: Hybrid (Recommended for You)

Combine the best parts:

### For Global Settings:
- Use `assets.php` config files (already have it!)
- Theme Customizer for colors/fonts
- Easy to version control

### For Page Building:
- Start with 3 templates: Default, Landing, Contact
- Add simple ACF fields per template (not flexible content)
- Document components well

### When You Need More:
- Add Component Registry (takes 4 hours)
- Migrate existing components (takes 2 hours)
- Suddenly have full page builder

This lets you **start small** and **grow organically**.

---

## Decision Tree

```
Do you need page-by-page customization?
├─ No → Use Option 2 (Theme Customizer) + Option 3 (Templates)
└─ Yes
    │
    └─ Is client technical?
        ├─ Yes → Use Option 4 (Documentation) + Option 3 (Templates)
        └─ No → Use Option 1 (Simple ACF) or Full Component Registry
```

---

## My Recommendation for You

Based on your situation:

**Phase 1 (This Month):**
- Option 3: Create 5 page templates (Landing, About, Services, Contact, Blog)
- Option 2: Use theme.php config for global settings
- Option 4: Document all components

**Phase 2 (Next Month):**
- If clients struggle → Add simple ACF per template
- If you're building lots of pages → Add Component Registry
- If it's working → Stay where you are!

**Why This Works:**
- Start with zero new complexity
- Test with real projects
- Add tooling only when you feel the pain
- Avoid over-engineering

---

## Implementation Checklist

### This Week
- [ ] Create `docs/COMPONENTS.md` guide
- [ ] Take screenshots of each component
- [ ] Create 1 page template (try Landing Page)
- [ ] Test with a sample page

### Next Week (if needed)
- [ ] Add simple ACF fields for the template
- [ ] Test with non-technical user
- [ ] Decide if you need more automation

### Future (if needed)
- [ ] Implement Component Registry
- [ ] Migrate to flexible content
- [ ] Add visual documentation (Storybook)

---

## Key Principle

> "Build incrementally based on actual pain points, not imagined future needs."

Your current architecture is **excellent**. Don't change it unless you have a **specific problem** that needs solving.

**Add tooling when:**
1. You're copying/pasting code too much
2. Clients can't do something they need to
3. You're spending time on boilerplate
4. Component reuse becomes chaotic

**Don't add tooling when:**
1. It's just "nice to have"
2. You haven't felt the pain yet
3. It adds complexity without clear benefit

---

## Final Thoughts

Your architecture is **production-ready** today. You could deploy client projects right now.

The scaling options here are for **future optimization**, not requirements.

Start simple. Ship fast. Iterate based on real feedback.

That's the path to sustainable, maintainable code that serves clients well.
