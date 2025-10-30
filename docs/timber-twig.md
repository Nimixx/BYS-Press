# Timber & Twig Templating

BYS Press uses Timber to bring the power of Twig templating to WordPress. This guide explains how to work with Timber and Twig effectively.

## What is Timber?

**Timber** is a WordPress plugin that integrates the **Twig** templating engine, providing:

- **Clean separation** between PHP logic and HTML presentation
- **Reusable components** with includes and macros
- **Template inheritance** with extends and blocks
- **Powerful filters** for data manipulation
- **Better syntax** than PHP templates

## Basic Concept

### Traditional WordPress

```php
<!-- header.php -->
<h1><?php echo get_bloginfo('name'); ?></h1>
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <article>
        <h2><?php the_title(); ?></h2>
        <div><?php the_content(); ?></div>
    </article>
<?php endwhile; endif; ?>
```

### With Timber/Twig

**PHP** (logic):
```php
// index.php
$context = Timber::context();
$context['posts'] = Timber::get_posts();
Timber::render('pages/Index/Index.twig', $context);
```

**Twig** (presentation):
```twig
{# pages/Index/Index.twig #}
<h1>{{ site.name }}</h1>
{% for post in posts %}
    <article>
        <h2>{{ post.title }}</h2>
        <div>{{ post.content }}</div>
    </article>
{% endfor %}
```

**Benefits**:
- Cleaner, more readable code
- Automatic escaping (security)
- Better IDE support
- Reusable components

## Timber Context

### What is Context?

The **context** is a data array passed to Twig templates:

```php
$context = Timber::context();
// Default contains: site, request, theme, user, etc.

$context['my_var'] = 'value';
Timber::render('MyTemplate.twig', $context);
```

### Default Context

Timber provides these automatically:

```twig
{{ site.name }}          {# Site title #}
{{ site.url }}           {# Site URL #}
{{ site.description }}   {# Tagline #}
{{ theme.link }}         {# Theme directory URL #}
{{ request.path }}       {# Current URL path #}
```

### Global Context Providers

BYS Press automatically adds data via context providers:

```php
// inc/Context/Providers/MenuContextProvider.php
$context['menus'] = [
    'primary' => MenuItem[],
    'footer' => MenuItem[]
];

// inc/Context/Providers/SecurityContextProvider.php
$context['nonce'] = 'abc123...';

// inc/Context/Providers/AssetsContextProvider.php
$context['theme_logo'] = [...];
```

**Usage in Twig**:
```twig
{# Navigation menu #}
{% for item in menus.primary %}
    <a href="{{ item.url }}">{{ item.title }}</a>
{% endfor %}

{# Security nonce #}
<script nonce="{{ nonce }}">
    console.log('Secure inline script');
</script>
```

## Twig Syntax Basics

### Variables

```twig
{# Output variable #}
{{ variable }}

{# Access properties #}
{{ post.title }}
{{ post.author.name }}

{# Array access #}
{{ items[0] }}
{{ data['key'] }}
```

### Filters

```twig
{# Transform data #}
{{ post.title|upper }}
{{ post.date|date('F j, Y') }}
{{ post.content|length }}
{{ text|default('No text') }}

{# WordPress filters #}
{{ post.content|wpautop }}
{{ text|esc_html }}
{{ url|esc_url }}
```

### Control Structures

```twig
{# If statement #}
{% if post.thumbnail %}
    <img src="{{ post.thumbnail.src }}" alt="{{ post.title }}">
{% else %}
    <div class="no-image">No image available</div>
{% endif %}

{# For loop #}
{% for post in posts %}
    <article>{{ post.title }}</article>
{% endfor %}

{# Check if empty #}
{% if posts is empty %}
    <p>No posts found</p>
{% endif %}
```

### Comments

```twig
{# Single line comment #}

{#
    Multi-line comment
    Not output in HTML
#}
```

## Template Structure

### Directory Organization

```
bys-press/
├── layouts/          # Base layouts
│   └── Base.twig    # Main HTML structure
├── pages/           # Full page templates
│   ├── Index/
│   │   └── Index.twig
│   └── FrontPage/
│       └── FrontPage.twig
└── components/      # Reusable components
    ├── Button/
    │   └── Button.twig
    └── Card/
        └── Card.twig
```

### Template Inheritance

**Base Layout** (`layouts/Base.twig`):
```twig
<!DOCTYPE html>
<html {{ site.language_attributes }}>
<head>
    <meta charset="{{ site.charset }}">
    <title>{% block title %}{{ site.name }}{% endblock %}</title>
    {{ function('wp_head') }}
</head>
<body class="{{ body_class }}">

    {% block header %}
        {# Default header #}
        <header>{{ site.name }}</header>
    {% endblock %}

    <main>
        {% block content %}
            {# Child templates override this #}
        {% endblock %}
    </main>

    {% block footer %}
        {# Default footer #}
        <footer>© {{ "now"|date("Y") }}</footer>
    {% endblock %}

    {{ function('wp_footer') }}
</body>
</html>
```

**Child Template** (`pages/Index/Index.twig`):
```twig
{% extends "layouts/Base.twig" %}

{% block title %}Blog - {{ site.name }}{% endblock %}

{% block content %}
    <h1>Recent Posts</h1>
    {% for post in posts %}
        <article>
            <h2>{{ post.title }}</h2>
            <div>{{ post.content }}</div>
        </article>
    {% endfor %}
{% endblock %}
```

**Result**: Child template inherits Base layout and overrides blocks.

## Including Components

### Basic Include

```twig
{# Include a component #}
{% include 'Button/Button.twig' %}

{# Pass variables #}
{% include 'Button/Button.twig' with {
    label: 'Click Me',
    url: '/contact',
    variant: 'primary'
} %}

{# Include only (no parent scope) #}
{% include 'Button/Button.twig' with { label: 'Click' } only %}
```

### Component Pattern

**Component Template** (`components/Button/Button.twig`):
```twig
<a
    href="{{ url|default('#') }}"
    class="button button--{{ variant|default('primary') }}"
>
    {{ label|default('Button') }}
</a>
```

**Usage**:
```twig
{# In your template #}
{% include 'Button/Button.twig' with {
    label: 'Learn More',
    url: '/about',
    variant: 'secondary'
} %}
```

## Working with WordPress Data

### Posts

```php
// PHP
$context['posts'] = Timber::get_posts();
```

```twig
{# Twig #}
{% for post in posts %}
    <article>
        <h2><a href="{{ post.link }}">{{ post.title }}</a></h2>
        <time>{{ post.date }}</time>
        <div>{{ post.preview(50) }}</div>

        {% if post.thumbnail %}
            <img src="{{ post.thumbnail.src }}" alt="{{ post.title }}">
        {% endif %}

        <a href="{{ post.link }}">Read more</a>
    </article>
{% endfor %}
```

### Single Post

```php
// single.php
$context = Timber::context();
$context['post'] = Timber::get_post();
Timber::render('pages/Single.twig', $context);
```

```twig
{# pages/Single.twig #}
<article>
    <h1>{{ post.title }}</h1>
    <time>{{ post.date|date('F j, Y') }}</time>
    <div>{{ post.content }}</div>

    {# Custom fields #}
    {% if post.meta('subtitle') %}
        <p class="subtitle">{{ post.meta('subtitle') }}</p>
    {% endif %}
</article>
```

### Menus

```twig
{# Navigation menu #}
<nav>
    {% for item in menus.primary %}
        <a href="{{ item.url }}"
           {% if item.current %}class="active"{% endif %}>
            {{ item.title }}
        </a>

        {# Sub-menu #}
        {% if item.children %}
            <ul>
                {% for child in item.children %}
                    <li><a href="{{ child.url }}">{{ child.title }}</a></li>
                {% endfor %}
            </ul>
        {% endif %}
    {% endfor %}
</nav>
```

### Sidebar Widgets

```php
// PHP
$context['sidebar'] = Timber::get_widgets('sidebar-1');
```

```twig
{# Twig #}
{% if sidebar %}
    <aside>
        {% for widget in sidebar %}
            {{ widget }}
        {% endfor %}
    </aside>
{% endif %}
```

## Advanced Techniques

### Macros (Reusable Functions)

```twig
{# macros.twig #}
{% macro button(label, url, variant) %}
    <a href="{{ url }}" class="button button--{{ variant }}">
        {{ label }}
    </a>
{% endmacro %}

{# Usage #}
{% import 'macros.twig' as macros %}
{{ macros.button('Click Me', '/contact', 'primary') }}
```

### Filters Chain

```twig
{# Chain multiple filters #}
{{ post.content|striptags|truncate(100)|raw }}

{# WordPress + Twig filters #}
{{ post.content|wpautop|raw }}
```

### Custom Filters

Add custom filters in PHP:

```php
// inc/TimberConfig.php or functions.php
add_filter('timber/twig', function($twig) {
    $twig->addFilter(new \Twig\TwigFilter('rot13', 'str_rot13'));
    return $twig;
});
```

```twig
{# Use custom filter #}
{{ 'Hello'|rot13 }}
```

### Conditional Classes

```twig
<div class="
    card
    {% if post.thumbnail %}card--has-image{% endif %}
    {% if post.is_sticky %}card--sticky{% endif %}
">
    ...
</div>
```

### Set Variables

```twig
{% set postCount = posts|length %}
{% set hasImage = post.thumbnail ? true : false %}

<p>Showing {{ postCount }} posts</p>
```

## Timber Functions

### Common Timber Objects

```php
// Get posts
Timber::get_posts()             // Current query
Timber::get_posts(['post_type' => 'page'])

// Get single post
Timber::get_post()              // Current post
Timber::get_post(123)           // By ID

// Get terms
Timber::get_terms('category')

// Get menu
Timber::get_menu('primary')

// Get user
Timber::get_user(1)
```

### In Templates

```twig
{# Call WordPress functions #}
{{ function('get_option', 'my_option') }}
{{ function('wp_get_attachment_image', post.thumbnail.id, 'large') }}

{# Do action #}
{{ action('my_custom_action') }}
```

## Debugging

### Dump Variables

```twig
{# Dump variable contents #}
{{ dump(post) }}
{{ dump(posts) }}
{{ dump() }}  {# Dump all context #}
```

### Check Variable Type

```twig
{% if post is defined %}
    {{ post.title }}
{% endif %}

{% if posts is iterable %}
    {% for post in posts %}...{% endfor %}
{% endif %}

{% if post.thumbnail is null %}
    No thumbnail
{% endif %}
```

### Enable Twig Debug

```php
// wp-config.php
define('WP_DEBUG', true);

// Timber will show detailed errors
```

## Best Practices

### 1. Keep Logic in PHP

**❌ Don't**:
```twig
{# Complex logic in template #}
{% set recentPosts = [] %}
{% for post in posts %}
    {% if post.date|date('U') > "now"|date('U') - 86400 %}
        {% set recentPosts = recentPosts|merge([post]) %}
    {% endif %}
{% endfor %}
```

**✅ Do**:
```php
// PHP
$context['recent_posts'] = array_filter($posts, function($post) {
    return $post->date('U') > time() - 86400;
});
```

```twig
{# Twig #}
{% for post in recent_posts %}
    {{ post.title }}
{% endfor %}
```

### 2. Use Context Providers

**❌ Don't**:
```php
// In every template file
$context['logo'] = get_theme_mod('custom_logo');
$context['social'] = get_option('social_links');
```

**✅ Do**:
```php
// Create context provider
class SiteContextProvider implements ContextProviderInterface {
    public function addToContext(array $context): array {
        $context['logo'] = get_theme_mod('custom_logo');
        $context['social'] = get_option('social_links');
        return $context;
    }
}
```

### 3. Component Reusability

```twig
{# Reusable component with defaults #}
<button
    class="button button--{{ variant|default('primary') }}"
    type="{{ type|default('button') }}"
    {% if disabled %}disabled{% endif %}
>
    {{ label|default('Button') }}
</button>
```

### 4. Auto-escaping

Twig auto-escapes by default. Use `|raw` only when necessary:

```twig
{# Auto-escaped (safe) #}
{{ post.title }}

{# Raw HTML (use with caution) #}
{{ post.content|raw }}
{{ post.content|wpautop|raw }}
```

## Common Patterns

### Pagination

```twig
{% if posts.pagination.pages %}
    <nav class="pagination">
        {% if posts.pagination.prev %}
            <a href="{{ posts.pagination.prev.link }}">Previous</a>
        {% endif %}

        <span>Page {{ posts.pagination.current }} of {{ posts.pagination.total }}</span>

        {% if posts.pagination.next %}
            <a href="{{ posts.pagination.next.link }}">Next</a>
        {% endif %}
    </nav>
{% endif %}
```

### No Results

```twig
{% if posts is not empty %}
    {% for post in posts %}
        {# Display post #}
    {% endfor %}
{% else %}
    <p>No posts found</p>
{% endif %}
```

### Featured Image

```twig
{% if post.thumbnail %}
    <img
        src="{{ post.thumbnail.src('large') }}"
        srcset="{{ post.thumbnail.srcset }}"
        alt="{{ post.title }}"
        loading="lazy"
    >
{% endif %}
```

## Resources

- **[Timber Documentation](https://timber.github.io/docs/)** - Official Timber docs
- **[Twig Documentation](https://twig.symfony.com/doc/)** - Twig syntax reference
- **[Timber Cheatsheet](https://timber.github.io/docs/reference/timber-post/)** - Quick reference

---

**Next**: Learn about [Components](./components.md) for building reusable UI elements.
