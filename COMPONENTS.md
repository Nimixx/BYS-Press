# Component Guide

Quick reference for using components in Core Theme.

## Creating a Component

1. **Create directory:**
   ```bash
   mkdir -p components/MyComponent
   ```

2. **Add files:**
   ```
   components/MyComponent/
     ├── MyComponent.twig  # Template
     ├── MyComponent.css   # Styles
     └── MyComponent.php   # Helper (optional)
   ```

3. **Build:**
   ```bash
   npm run build
   ```

**Done!** CSS is automatically loaded - no manual imports needed.
The auto-loader in `lib/main.ts` uses `import.meta.glob` to find all component CSS files.

## Using Components

### In PHP
```php
use CoreTheme\Components\Button;

$context['button'] = Button::primary('Click Me', '/page');
Timber::render('FrontPage/FrontPage.twig', $context);
```

### In Twig
```twig
{% include 'Button/Button.twig' with {
    text: 'Click Me',
    url: '/page',
    variant: 'primary'
} %}
```

## Component Reference

### Button

**Variants:** primary, secondary, outline, ghost
**Sizes:** small, base, large

```php
// PHP
Button::primary('Text', '/url', ['size' => 'large']);
Button::secondary('Text', '/url');
Button::outline('Text', '/url', ['full_width' => true]);
Button::ghost('Text', '/url', ['disabled' => true]);
```

```twig
{# Twig #}
{% include 'Button/Button.twig' with {
    text: 'Submit',
    url: '/submit',
    variant: 'primary',
    size: 'large',
    full_width: false,
    disabled: false,
    aria_label: 'Submit form'
} %}
```

### Card

**Variants:** default, featured

```php
// PHP - Manual
Card::context([
    'title' => 'Card Title',
    'description' => 'Description text',
    'image' => '/path/to/image.jpg',
    'url' => '/read-more',
    'cta_text' => 'Read More',
    'variant' => 'featured'
]);

// PHP - From WordPress Post
$post = get_post(123);
Card::fromPost($post, ['variant' => 'featured']);

// PHP - Multiple Posts
$posts = get_posts(['numberposts' => 5]);
$cards = Card::fromPosts($posts);
```

```twig
{# Twig #}
{% include 'Card/Card.twig' with {
    title: 'Amazing Article',
    description: 'Read all about it...',
    image: '/image.jpg',
    url: '/article',
    cta_text: 'Read More',
    variant: 'featured'
} %}

{# Loop multiple cards #}
{% for card in cards %}
    {% include 'Card/Card.twig' with card %}
{% endfor %}
```

### Header

Auto-included in Base layout. Uses WordPress navigation menus.

```php
// Register menu in functions.php
register_nav_menus([
    'primary' => 'Primary Menu'
]);
```

### Footer

Auto-included in Base layout. Shows copyright with current year.

## Design Tokens

Use tokens for consistent styling:

```css
/* Spacing */
padding: var(--space-4);      /* 16px */
margin: var(--space-8);       /* 32px */

/* Colors */
color: var(--color-primary-500);
background: var(--color-bg-secondary);

/* Typography */
font-size: var(--font-size-xl);
font-weight: var(--font-weight-bold);
line-height: var(--line-height-relaxed);

/* Borders */
border-radius: var(--radius-md);

/* Shadows */
box-shadow: var(--shadow-md);

/* Transitions */
transition: var(--transition-base);
```

## Component Template

**components/Example/Example.twig**
```twig
{#
  Example Component

  @param {string} title - Component title
  @param {string} variant - default|special
#}

<div class="{{ classes | default('example') }}">
  <h3>{{ title }}</h3>
</div>
```

**components/Example/Example.css**
```css
.example {
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.example--special {
  border: 2px solid var(--color-primary-500);
}
```

**components/Example/Example.php**
```php
<?php
namespace CoreTheme\Components;

class Example
{
    public static function context(array $args = []): array
    {
        return [
            'title' => $args['title'] ?? '',
            'variant' => $args['variant'] ?? 'default',
            'classes' => self::getClasses($args),
        ];
    }

    private static function getClasses(array $args): string
    {
        $classes = ['example'];

        if (isset($args['variant']) && $args['variant'] !== 'default') {
            $classes[] = "example--{$args['variant']}";
        }

        return implode(' ', $classes);
    }
}
```

## Common Patterns

### Page with Components
```php
// page-template.php
use CoreTheme\Components\Button;
use CoreTheme\Components\Card;

$context = Timber::context();

$context['hero_button'] = Button::primary('Get Started', '/signup', [
    'size' => 'large'
]);

$posts = Timber::get_posts(['numberposts' => 6]);
$context['cards'] = Card::fromPosts($posts);

Timber::render('MyPage/MyPage.twig', $context);
```

```twig
{# pages/MyPage/MyPage.twig #}
{% extends "Base/Base.twig" %}

{% block content %}
  <div class="my-page">
    <section class="hero">
      <h1>Welcome</h1>
      {% include 'Button/Button.twig' with hero_button %}
    </section>

    <section class="cards">
      {% for card in cards %}
        {% include 'Card/Card.twig' with card %}
      {% endfor %}
    </section>
  </div>
{% endblock %}
```

## Tips

1. **Keep components small** - Single responsibility
2. **Use PHP helpers** - Type safety and consistency
3. **Use design tokens** - Maintain visual consistency
4. **Test in isolation** - Components should work anywhere
5. **Document params** - Use Twig comments for API docs

## Build Commands

```bash
npm run dev      # Development with HMR
npm run build    # Production build
npm run test     # Run tests
npm run lint     # Check code quality
```

## Need Help?

- See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed docs
- Check `components/` for examples
- Look at `config/tokens.css` for available tokens
