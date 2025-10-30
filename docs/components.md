# Components Guide

Learn how to create and use reusable components in BYS Press theme.

## What are Components?

Components are reusable UI elements that combine:
- **Twig template** (`.twig`) - The HTML structure
- **PHP helper** (`.php`) - Optional data preparation
- **Styles** (`.css`) - Optional component-specific styles

## Component Structure

```
components/
└── ComponentName/
    ├── ComponentName.twig     # Template (required)
    ├── ComponentName.php      # PHP helper (optional)
    └── ComponentName.css      # Styles (optional)
```

## Creating a Component

### Example: Alert Component

**1. Create Directory**

```bash
mkdir -p components/Alert
```

**2. Create Twig Template**

`components/Alert/Alert.twig`:
```twig
<div class="alert alert--{{ type|default('info') }}" role="alert">
    {% if icon %}
        <span class="alert__icon">{{ icon }}</span>
    {% endif %}
    <div class="alert__content">
        {% if title %}
            <h4 class="alert__title">{{ title }}</h4>
        {% endif %}
        <p class="alert__message">{{ message|default('Alert message') }}</p>
    </div>
    {% if dismissible %}
        <button class="alert__close" aria-label="Close">×</button>
    {% endif %}
</div>
```

**3. Create PHP Helper (Optional)**

`components/Alert/Alert.php`:
```php
<?php
namespace BYSPress\Components;

if (!defined('ABSPATH')) {
    exit();
}

class Alert {
    /**
     * Create alert context
     *
     * @param string $message Alert message
     * @param string $type Alert type (info, success, warning, error)
     * @param array $options Additional options
     * @return array
     */
    public static function create(
        string $message,
        string $type = 'info',
        array $options = []
    ): array {
        return array_merge([
            'message' => $message,
            'type' => $type,
            'title' => $options['title'] ?? null,
            'icon' => $options['icon'] ?? self::getIcon($type),
            'dismissible' => $options['dismissible'] ?? true,
        ], $options);
    }

    private static function getIcon(string $type): string {
        $icons = [
            'info' => 'ℹ️',
            'success' => '✓',
            'warning' => '⚠️',
            'error' => '✗',
        ];
        return $icons[$type] ?? $icons['info'];
    }
}
```

**4. Create Styles (Optional)**

`components/Alert/Alert.css`:
```css
.alert {
    padding: 1rem;
    border-radius: 4px;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
}

.alert--info {
    background-color: #e3f2fd;
    color: #1976d2;
}

.alert--success {
    background-color: #e8f5e9;
    color: #388e3c;
}

.alert--warning {
    background-color: #fff3e0;
    color: #f57c00;
}

.alert--error {
    background-color: #ffebee;
    color: #d32f2f;
}

.alert__content {
    flex: 1;
}

.alert__title {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.alert__message {
    margin: 0;
}

.alert__close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}
```

## Using Components

### Method 1: Direct Include

```twig
{# Simple usage #}
{% include 'Alert/Alert.twig' with {
    message: 'Operation completed successfully!',
    type: 'success'
} %}

{# With all options #}
{% include 'Alert/Alert.twig' with {
    message: 'Please review the form',
    type: 'warning',
    title: 'Attention Required',
    icon: '⚠️',
    dismissible: true
} %}
```

### Method 2: Using PHP Helper

```php
// In your template file
use BYSPress\Components\Alert;

$context = Timber::context();
$context['alert'] = Alert::create(
    'Profile updated successfully!',
    'success',
    ['title' => 'Success']
);
Timber::render('pages/Profile.twig', $context);
```

```twig
{# In Twig template #}
{% include 'Alert/Alert.twig' with alert %}
```

### Method 3: Loop Through Components

```php
$context['alerts'] = [
    Alert::create('Info message', 'info'),
    Alert::create('Success message', 'success'),
    Alert::create('Warning message', 'warning'),
];
```

```twig
{% for alert in alerts %}
    {% include 'Alert/Alert.twig' with alert %}
{% endfor %}
```

## Existing Components

### Button Component

**Usage**:
```twig
{% include 'Button/Button.twig' with {
    label: 'Click Me',
    url: '/contact',
    variant: 'primary',
    size: 'medium'
} %}
```

**PHP Helper**:
```php
use BYSPress\Components\Button;

$button = Button::create('Learn More', '/about', [
    'variant' => 'secondary',
    'icon' => '→'
]);
```

### Card Component

**Usage**:
```twig
{% include 'Card/Card.twig' with {
    title: 'Card Title',
    content: 'Card description text',
    image: post.thumbnail.src,
    link: post.link
} %}
```

**PHP Helper**:
```php
use BYSPress\Components\Card;

$card = Card::fromPost($post);
```

## Component Patterns

### Pattern 1: Simple Component

No PHP helper, just template:

```twig
{# components/Badge/Badge.twig #}
<span class="badge badge--{{ color|default('gray') }}">
    {{ text }}
</span>
```

**Usage**:
```twig
{% include 'Badge/Badge.twig' with { text: 'New', color: 'blue' } %}
```

### Pattern 2: Component with Helper

Template + PHP class for data preparation:

```php
// components/UserCard/UserCard.php
class UserCard {
    public static function fromUser($user): array {
        return [
            'name' => $user->name,
            'avatar' => get_avatar_url($user->ID),
            'role' => $user->roles[0] ?? 'subscriber',
            'posts_count' => count_user_posts($user->ID),
        ];
    }
}
```

```twig
{# components/UserCard/UserCard.twig #}
<div class="user-card">
    <img src="{{ avatar }}" alt="{{ name }}">
    <h3>{{ name }}</h3>
    <p>{{ role }} • {{ posts_count }} posts</p>
</div>
```

**Usage**:
```php
$context['user_card'] = UserCard::fromUser($user);
```

### Pattern 3: Nested Components

Components can include other components:

```twig
{# components/PostCard/PostCard.twig #}
<article class="post-card">
    <h2>{{ post.title }}</h2>
    <div>{{ post.excerpt }}</div>

    {% include 'Button/Button.twig' with {
        label: 'Read More',
        url: post.link
    } %}
</article>
```

### Pattern 4: Slot Pattern

Parent component with dynamic content:

```twig
{# components/Modal/Modal.twig #}
<div class="modal" id="{{ id }}">
    <div class="modal__overlay"></div>
    <div class="modal__content">
        <header class="modal__header">
            <h2>{{ title }}</h2>
            <button class="modal__close">×</button>
        </header>
        <div class="modal__body">
            {{ content|raw }}
        </div>
        {% if actions %}
            <footer class="modal__actions">
                {{ actions|raw }}
            </footer>
        {% endif %}
    </div>
</div>
```

## Component Best Practices

### 1. Provide Defaults

```twig
{# Always provide sensible defaults #}
<button
    class="button button--{{ variant|default('primary') }}"
    type="{{ type|default('button') }}"
>
    {{ label|default('Button') }}
</button>
```

### 2. Use Semantic HTML

```twig
{# ✅ Good - Semantic #}
<article class="card">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
</article>

{# ❌ Bad - Div soup #}
<div class="card">
    <div>{{ title }}</div>
    <div>{{ description }}</div>
</div>
```

### 3. Accessible Components

```twig
{# Include ARIA attributes #}
<button
    class="button"
    aria-label="{{ ariaLabel|default(label) }}"
    {% if disabled %}aria-disabled="true"{% endif %}
>
    {{ label }}
</button>
```

### 4. BEM Naming

```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__body { }

/* Modifier */
.card--featured { }
.card--horizontal { }
```

```twig
<div class="card {{ modifier ? 'card--' ~ modifier : '' }}">
    <h2 class="card__title">{{ title }}</h2>
    <div class="card__body">{{ content }}</div>
</div>
```

### 5. Document Components

Add comments to templates:

```twig
{#
    Button Component

    A reusable button component with variants.

    Props:
    - label (string, required): Button text
    - url (string): Link URL
    - variant (string): 'primary'|'secondary'|'tertiary'
    - size (string): 'small'|'medium'|'large'
    - icon (string): Optional icon
    - disabled (bool): Disabled state

    Example:
    {% include 'Button/Button.twig' with {
        label: 'Click Me',
        variant: 'primary'
    } %}
#}
```

## Component State

### Conditional Rendering

```twig
{% if show %}
    <div class="notification">{{ message }}</div>
{% endif %}
```

### Dynamic Classes

```twig
<div class="
    card
    {% if featured %}card--featured{% endif %}
    {% if hasImage %}card--has-image{% endif %}
    {% if theme %}card--{{ theme }}{% endif %}
">
    ...
</div>
```

### Active States

```twig
<nav>
    {% for item in menus.primary %}
        <a
            href="{{ item.url }}"
            class="nav-link {{ item.current ? 'nav-link--active' : '' }}"
        >
            {{ item.title }}
        </a>
    {% endfor %}
</nav>
```

## Loading Styles

### Option 1: Import in main.css

```css
/* src/main.css */
@import '../components/Alert/Alert.css';
@import '../components/Button/Button.css';
@import '../components/Card/Card.css';
```

### Option 2: Component-specific Entry

```typescript
// src/main.ts
import '../components/Alert/Alert.css';
```

### Option 3: Dynamic Import

```typescript
// Load only when needed
if (document.querySelector('.alert')) {
    import('../components/Alert/Alert.css');
}
```

## Testing Components

### Visual Testing

Create a components showcase page:

```php
// components-demo.php
$context = Timber::context();
$context['components'] = [
    'alert' => Alert::create('Test alert', 'info'),
    'button' => Button::create('Test Button', '#'),
];
Timber::render('pages/ComponentsDemo.twig', $context);
```

```twig
{# pages/ComponentsDemo.twig #}
<h1>Component Library</h1>

<section>
    <h2>Alerts</h2>
    {% for type in ['info', 'success', 'warning', 'error'] %}
        {% include 'Alert/Alert.twig' with {
            message: 'This is a ' ~ type ~ ' alert',
            type: type
        } %}
    {% endfor %}
</section>

<section>
    <h2>Buttons</h2>
    {% for variant in ['primary', 'secondary', 'tertiary'] %}
        {% include 'Button/Button.twig' with {
            label: variant|capitalize ~ ' Button',
            variant: variant
        } %}
    {% endfor %}
</section>
```

## Advanced Techniques

### Component Composition

```twig
{# components/ProductCard/ProductCard.twig #}
<div class="product-card">
    {% if product.images[0] %}
        {% include 'Image/Image.twig' with {
            src: product.images[0],
            alt: product.name
        } %}
    {% endif %}

    <h3>{{ product.name }}</h3>
    <p>{{ product.price }}</p>

    {% include 'Button/Button.twig' with {
        label: 'Add to Cart',
        variant: 'primary'
    } %}
</div>
```

### Component Variants

```php
class Button {
    const VARIANT_PRIMARY = 'primary';
    const VARIANT_SECONDARY = 'secondary';
    const VARIANT_DANGER = 'danger';

    public static function create(
        string $label,
        string $url,
        string $variant = self::VARIANT_PRIMARY
    ): array {
        return compact('label', 'url', 'variant');
    }
}
```

### Component Factory

```php
class ComponentFactory {
    public static function card($type, $data): array {
        return match($type) {
            'post' => CardFromPost::create($data),
            'product' => CardFromProduct::create($data),
            'user' => CardFromUser::create($data),
            default => Card::create($data),
        };
    }
}
```

## Real-World Example

### Blog Post Card

**PHP**:
```php
// components/PostCard/PostCard.php
namespace BYSPress\Components;

use Timber\Post;

class PostCard {
    public static function fromPost(Post $post): array {
        return [
            'title' => $post->title,
            'excerpt' => $post->excerpt(),
            'link' => $post->link,
            'date' => $post->date('F j, Y'),
            'author' => $post->author()->name,
            'thumbnail' => $post->thumbnail() ? $post->thumbnail()->src('medium') : null,
            'categories' => array_map(fn($cat) => $cat->name, $post->categories()),
        ];
    }
}
```

**Twig**:
```twig
{# components/PostCard/PostCard.twig #}
<article class="post-card">
    {% if thumbnail %}
        <img src="{{ thumbnail }}" alt="{{ title }}" class="post-card__image">
    {% endif %}

    <div class="post-card__content">
        <div class="post-card__meta">
            <time>{{ date }}</time>
            <span>by {{ author }}</span>
        </div>

        <h2 class="post-card__title">
            <a href="{{ link }}">{{ title }}</a>
        </h2>

        <p class="post-card__excerpt">{{ excerpt }}</p>

        <div class="post-card__categories">
            {% for category in categories %}
                {% include 'Badge/Badge.twig' with {
                    text: category,
                    color: 'blue'
                } %}
            {% endfor %}
        </div>

        {% include 'Button/Button.twig' with {
            label: 'Read More',
            url: link,
            variant: 'secondary'
        } %}
    </div>
</article>
```

**Usage**:
```php
$context['post_cards'] = array_map(
    [PostCard::class, 'fromPost'],
    Timber::get_posts()
);
```

```twig
<div class="posts-grid">
    {% for card in post_cards %}
        {% include 'PostCard/PostCard.twig' with card %}
    {% endfor %}
</div>
```

---

**Next**: Learn about [Development Workflow](./development.md) for daily tasks.
