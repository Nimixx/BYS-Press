# Customization Tutorial

This guide provides step-by-step instructions for customizing Core Theme. Whether you're adding new pages, styling components, adding functionality, or integrating external libraries, this tutorial will walk you through the process.

## Table of Contents

1. [Adding New Pages](#adding-new-pages)
2. [Adding Custom Styles](#adding-custom-styles)
3. [Adding Functionality](#adding-functionality)
4. [Creating Svelte Components](#creating-svelte-components)
5. [Integrating External Libraries](#integrating-external-libraries)
6. [Installing NPM Packages](#installing-npm-packages)
7. [Working with Timber/Twig](#working-with-timbertwig)
8. [Creating Custom Post Types](#creating-custom-post-types)
9. [Adding WordPress Hooks](#adding-wordpress-hooks)
10. [Environment Configuration](#environment-configuration)

---

## Adding New Pages

Core Theme uses WordPress templates combined with Timber/Twig for rendering. Here's how to add new pages:

### Step 1: Create a PHP Template File

Create a new PHP template in the theme root. For example, to create a custom "About" page template:

**File**: `page-about.php`

```php
<?php
/**
 * Template Name: About Page
 * Description: Custom about page template
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

$context = Timber::context();
$context['post'] = Timber::get_post();

// Add custom data to context
$context['team_members'] = get_field('team_members'); // Example ACF field
$context['company_stats'] = [
    'founded' => '2024',
    'employees' => '50+',
    'projects' => '200+',
];

Timber::render('pages/about.twig', $context);
```

### Step 2: Create a Twig Template

Create the corresponding Twig template:

**File**: `views/pages/about.twig`

```twig
{% extends "layouts/base.twig" %}

{% block content %}
    <article class="about-page">
        <header class="about-page__header">
            <h1 class="about-page__title">{{ post.title }}</h1>
        </header>

        <div class="about-page__content">
            {{ post.content }}
        </div>

        {% if company_stats %}
            <section class="about-page__stats">
                <div class="stats">
                    <div class="stats__item">
                        <span class="stats__value">{{ company_stats.founded }}</span>
                        <span class="stats__label">Founded</span>
                    </div>
                    <div class="stats__item">
                        <span class="stats__value">{{ company_stats.employees }}</span>
                        <span class="stats__label">Employees</span>
                    </div>
                    <div class="stats__item">
                        <span class="stats__value">{{ company_stats.projects }}</span>
                        <span class="stats__label">Projects</span>
                    </div>
                </div>
            </section>
        {% endif %}
    </article>
{% endblock %}
```

### Step 3: Create the Page in WordPress

1. Go to WordPress Admin > Pages > Add New
2. Give your page a title (e.g., "About")
3. In the Page Attributes section, select "About Page" from the Template dropdown
4. Publish the page

### Creating Custom Archive Templates

For custom post type archives:

**File**: `archive-project.php`

```php
<?php
$context = Timber::context();
$context['posts'] = Timber::get_posts();
$context['page_title'] = 'Our Projects';

Timber::render('pages/archive-project.twig', $context);
```

**File**: `views/pages/archive-project.twig`

```twig
{% extends "layouts/base.twig" %}

{% block content %}
    <div class="archive archive--projects">
        <header class="archive__header">
            <h1>{{ page_title }}</h1>
        </header>

        <div class="projects-grid">
            {% for post in posts %}
                <article class="project-card">
                    <h2 class="project-card__title">
                        <a href="{{ post.link }}">{{ post.title }}</a>
                    </h2>
                    {{ post.preview }}
                </article>
            {% endfor %}
        </div>
    </div>
{% endblock %}
```

---

## Adding Custom Styles

Core Theme uses a modular CSS architecture with BEM methodology. Here's how to add styles:

### Step 1: Create a New CSS Module

Add your CSS file in the appropriate directory:

**File**: `src/css/components/about-page.css`

```css
/* About Page Component
   ========================================================================== */

.about-page {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

.about-page__header {
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.about-page__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.about-page__content {
  margin-bottom: var(--spacing-xl);
  line-height: var(--line-height-relaxed);
}

/* Stats Section */
.about-page__stats {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stats__value {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.stats__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Step 2: Import the CSS Module

Add the import to your main CSS file:

**File**: `src/css/main.css`

```css
/* ... existing imports ... */

/* Components */
@import './components/about-page.css';
```

### Step 3: Use CSS Custom Properties

Core Theme includes CSS custom properties (CSS variables) for consistency. Use them in your styles:

**Available CSS Custom Properties** (defined in `src/css/base/variables.css`):

```css
/* Colors */
--color-primary: #0073aa;
--color-text-primary: #1a1a1a;
--color-text-secondary: #666;
--color-surface: #f9f9f9;

/* Spacing */
--spacing-xs: 0.5rem;
--spacing-sm: 1rem;
--spacing-md: 1.5rem;
--spacing-lg: 2rem;
--spacing-xl: 3rem;

/* Typography */
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 2rem;
--font-size-4xl: 2.5rem;

/* Other */
--content-width: 1200px;
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
```

### Creating Utility Classes

Add reusable utility classes:

**File**: `src/css/utilities/spacing.css`

```css
/* Spacing Utilities
   ========================================================================== */

.u-mt-0 { margin-top: 0; }
.u-mt-sm { margin-top: var(--spacing-sm); }
.u-mt-md { margin-top: var(--spacing-md); }
.u-mt-lg { margin-top: var(--spacing-lg); }
.u-mt-xl { margin-top: var(--spacing-xl); }

.u-mb-0 { margin-bottom: 0; }
.u-mb-sm { margin-bottom: var(--spacing-sm); }
.u-mb-md { margin-bottom: var(--spacing-md); }
.u-mb-lg { margin-bottom: var(--spacing-lg); }
.u-mb-xl { margin-bottom: var(--spacing-xl); }
```

---

## Adding Functionality

### Step 1: Create a New PHP Class

Create a new PHP class in the `inc/` directory for your functionality:

**File**: `inc/CustomFunctionality.php`

```php
<?php
/**
 * Custom Functionality
 *
 * @package CoreTheme
 */

namespace CoreTheme;

if (!defined('ABSPATH')) {
    exit;
}

class CustomFunctionality
{
    /**
     * Initialize the functionality
     */
    public function __construct()
    {
        $this->initHooks();
    }

    /**
     * Initialize WordPress hooks
     */
    private function initHooks(): void
    {
        add_filter('the_content', [$this, 'addReadingTime']);
        add_action('wp_ajax_custom_action', [$this, 'handleAjaxRequest']);
        add_action('wp_ajax_nopriv_custom_action', [$this, 'handleAjaxRequest']);
    }

    /**
     * Add reading time to content
     *
     * @param string $content Post content
     * @return string Modified content
     */
    public function addReadingTime(string $content): string
    {
        if (!is_single()) {
            return $content;
        }

        $wordCount = str_word_count(strip_tags($content));
        $minutes = ceil($wordCount / 200); // Average reading speed

        $readingTime = sprintf(
            '<div class="reading-time">%d min read</div>',
            $minutes
        );

        return $readingTime . $content;
    }

    /**
     * Handle AJAX request
     */
    public function handleAjaxRequest(): void
    {
        // Verify nonce
        if (!check_ajax_referer('custom_nonce', 'nonce', false)) {
            wp_send_json_error('Invalid nonce');
            return;
        }

        // Sanitize input
        $data = isset($_POST['data']) ? sanitize_text_field($_POST['data']) : '';

        // Process the request
        $result = $this->processData($data);

        // Send response
        wp_send_json_success($result);
    }

    /**
     * Process data
     *
     * @param string $data Input data
     * @return array Processed result
     */
    private function processData(string $data): array
    {
        // Your processing logic here
        return [
            'message' => 'Data processed successfully',
            'data' => $data,
        ];
    }
}
```

### Step 2: Register the Class in Theme.php

Add your new class to the theme initialization:

**File**: `inc/Theme.php`

```php
// Add this to the boot() method
$customFunctionality = new CustomFunctionality();
```

### Step 3: Add JavaScript for AJAX (if needed)

**File**: `src/js/utils/ajax.ts`

```typescript
/**
 * Make AJAX request to WordPress
 */
export async function makeAjaxRequest(action: string, data: Record<string, any>): Promise<any> {
  const formData = new FormData();
  formData.append('action', action);
  formData.append('nonce', window.coreTheme.nonce);

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetch(window.coreTheme.ajaxUrl, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

// Usage example
export async function customAction(data: string) {
  try {
    const result = await makeAjaxRequest('custom_action', { data });
    if (result.success) {
      console.log('Success:', result.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## Creating Svelte Components

Svelte 5 components add reactive functionality to your theme.

### Step 1: Create a Svelte Component

**File**: `src/components/ContactForm.svelte`

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';

  interface FormData {
    name: string;
    email: string;
    message: string;
  }

  let formData = $state<FormData>({
    name: '',
    email: '',
    message: '',
  });

  let loading = $state(false);
  let success = $state(false);
  let error = $state('');

  async function handleSubmit(event: Event) {
    event.preventDefault();
    loading = true;
    error = '';

    try {
      const response = await fetch('/wp-json/custom/v1/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        success = true;
        formData = { name: '', email: '', message: '' };
      } else {
        error = 'Failed to send message. Please try again.';
      }
    } catch (err) {
      error = 'An error occurred. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="contact-form">
  {#if success}
    <div class="contact-form__success">
      Thank you! Your message has been sent.
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="contact-form__form">
      <div class="form-field">
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          bind:value={formData.name}
          required
        />
      </div>

      <div class="form-field">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={formData.email}
          required
        />
      </div>

      <div class="form-field">
        <label for="message">Message</label>
        <textarea
          id="message"
          bind:value={formData.message}
          rows="5"
          required
        ></textarea>
      </div>

      {#if error}
        <div class="contact-form__error">{error}</div>
      {/if}

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  {/if}
</div>

<style>
  .contact-form {
    max-width: 600px;
    margin: 0 auto;
  }

  .form-field {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    background: var(--color-primary);
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .contact-form__success,
  .contact-form__error {
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .contact-form__success {
    background: #d4edda;
    color: #155724;
  }

  .contact-form__error {
    background: #f8d7da;
    color: #721c24;
  }
</style>
```

### Step 2: Register the Component

Core Theme uses a centralized component registry system for better code splitting and maintainability.

**File**: `src/js/config/components.ts`

```typescript
import ContactForm from '../../components/ContactForm.svelte';
import { pageConditions } from './components'; // Import existing helpers

// Add to componentRegistry array
{
  component: ContactForm,
  elementId: 'contact-form-mount',
  name: 'ContactForm',
  condition: () => pageConditions.hasBodyClass('page-template-contact'),
}
```

**That's it!** The component will be automatically mounted when the page loads.

#### Component Configuration Options

```typescript
interface ComponentConfig {
  /** Svelte component to mount */
  component: Component;
  /** DOM element ID to mount to */
  elementId: string;
  /** Component name for error tracking */
  name: string;
  /** Whether this component is required on the page */
  required?: boolean;
  /** Condition function to check if component should mount */
  condition?: () => boolean;
  /** Custom props to pass to the component */
  props?: Record<string, any>;
}
```

#### Examples

**Basic component (always tries to mount):**
```typescript
{
  component: MyComponent,
  elementId: 'my-component',
  name: 'MyComponent',
}
```

**Required component (warns if mount point missing):**
```typescript
{
  component: Header,
  elementId: 'site-header',
  name: 'Header',
  required: true,
}
```

**Conditional component (only mounts if condition met):**
```typescript
{
  component: BlogSidebar,
  elementId: 'blog-sidebar',
  name: 'BlogSidebar',
  condition: () => pageConditions.isSinglePost(),
}
```

**Component with props:**
```typescript
{
  component: ProductCard,
  elementId: 'product-card',
  name: 'ProductCard',
  props: { productId: 123, theme: 'dark' },
}
```

### Step 3: Lazy Loading (Optional)

For larger components that should only be loaded when needed:

**File**: `src/js/config/components.ts`

```typescript
// Add to lazyComponentRegistry array
{
  elementId: 'data-visualization',
  name: 'DataVisualization',
  loader: () => import('../../components/DataVisualization.svelte'),
  condition: () => pageConditions.hasBodyClass('page-dashboard'),
}
```

Lazy-loaded components are not bundled in the main JS file, improving initial page load performance.

### Step 3: Add Mount Point in Twig

**File**: `views/pages/contact.twig`

```twig
{% extends "layouts/base.twig" %}

{% block content %}
    <div class="contact-page">
        <h1>Contact Us</h1>
        <div id="contact-form-mount"></div>
    </div>
{% endblock %}
```

---

## Integrating External Libraries

### JavaScript Libraries

#### Step 1: Install the Library

```bash
npm install gsap
```

#### Step 2: Import and Use

**File**: `src/js/animations/gsap-animations.ts`

```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(): void {
  // Fade in on scroll
  gsap.utils.toArray('.fade-in').forEach((element) => {
    gsap.from(element as HTMLElement, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: element as HTMLElement,
        start: 'top 80%',
        end: 'top 50%',
        scrub: true,
      },
    });
  });
}
```

#### Step 3: Initialize in Main

**File**: `src/js/main.ts`

```typescript
import { initAnimations } from './animations/gsap-animations';

document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
});
```

### CSS Libraries (with Vite)

#### Option 1: Import in JavaScript

```typescript
// src/js/main.ts
import 'normalize.css';
```

#### Option 2: Import in CSS

```css
/* src/css/main.css */
@import 'normalize.css';
```

### PHP Libraries via Composer

#### Step 1: Add to composer.json

```bash
composer require guzzlehttp/guzzle
```

#### Step 2: Use in Your PHP Class

```php
<?php
namespace CoreTheme;

use GuzzleHttp\Client;

class ApiIntegration
{
    private Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://api.example.com',
            'timeout' => 10.0,
        ]);
    }

    public function fetchData(): array
    {
        $response = $this->client->request('GET', '/endpoint');
        return json_decode($response->getBody(), true);
    }
}
```

---

## Installing NPM Packages

### Step-by-Step Process

#### 1. Install the Package

```bash
# Install as a dependency (for production)
npm install package-name

# Install as a dev dependency (for development only)
npm install --save-dev package-name
```

#### 2. Import in TypeScript/JavaScript

```typescript
// Named import
import { specificFunction } from 'package-name';

// Default import
import Package from 'package-name';

// Import all
import * as Package from 'package-name';
```

#### 3. Add Type Definitions (if needed)

```bash
npm install --save-dev @types/package-name
```

### Example: Adding Axios for HTTP Requests

```bash
npm install axios
npm install --save-dev @types/axios
```

**File**: `src/js/utils/http.ts`

```typescript
import axios, { AxiosInstance } from 'axios';

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/wp-json/custom/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get(endpoint: string): Promise<any> {
    const response = await this.client.get(endpoint);
    return response.data;
  }

  async post(endpoint: string, data: any): Promise<any> {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }
}

export const http = new HttpClient();
```

---

## Working with Timber/Twig

### Understanding the Context

Timber passes data to Twig templates via the "context":

```php
$context = Timber::context();
$context['custom_data'] = 'My data';
Timber::render('template.twig', $context);
```

### Creating Reusable Partials

**File**: `views/partials/card.twig`

```twig
{#
  Card Component

  @param string title - Card title
  @param string content - Card content
  @param string link - Optional link URL
  @param string image - Optional image URL
#}

<div class="card">
    {% if image %}
        <div class="card__image">
            <img src="{{ image }}" alt="{{ title }}">
        </div>
    {% endif %}

    <div class="card__content">
        <h3 class="card__title">{{ title }}</h3>
        <div class="card__body">
            {{ content }}
        </div>

        {% if link %}
            <a href="{{ link }}" class="card__link">Read More</a>
        {% endif %}
    </div>
</div>
```

**Usage in another template:**

```twig
{% include 'partials/card.twig' with {
    title: 'My Card Title',
    content: 'Card content here',
    link: '/read-more',
    image: post.thumbnail.src
} %}
```

### Using Timber Filters

```twig
{# Date formatting #}
{{ post.date|date('F j, Y') }}

{# Limit words #}
{{ post.content|excerpt(30) }}

{# Convert to lowercase #}
{{ post.title|lower }}

{# Custom filter #}
{{ post.content|my_custom_filter }}
```

### Adding Custom Twig Filters

**File**: `inc/TimberConfig.php`

```php
public function addCustomFilters(): void
{
    add_filter('timber/twig', function ($twig) {
        // Add custom filter
        $twig->addFilter(new \Twig\TwigFilter('reading_time', function ($text) {
            $wordCount = str_word_count(strip_tags($text));
            $minutes = ceil($wordCount / 200);
            return $minutes . ' min read';
        }));

        return $twig;
    });
}
```

**Usage:**

```twig
<span class="reading-time">{{ post.content|reading_time }}</span>
```

---

## Creating Custom Post Types

### Step 1: Create a Custom Post Type Class

**File**: `inc/PostTypes/Project.php`

```php
<?php

namespace CoreTheme\PostTypes;

if (!defined('ABSPATH')) {
    exit;
}

class Project
{
    public function __construct()
    {
        add_action('init', [$this, 'register']);
    }

    public function register(): void
    {
        $labels = [
            'name' => __('Projects', 'core-theme'),
            'singular_name' => __('Project', 'core-theme'),
            'add_new' => __('Add New', 'core-theme'),
            'add_new_item' => __('Add New Project', 'core-theme'),
            'edit_item' => __('Edit Project', 'core-theme'),
            'new_item' => __('New Project', 'core-theme'),
            'view_item' => __('View Project', 'core-theme'),
            'search_items' => __('Search Projects', 'core-theme'),
            'not_found' => __('No projects found', 'core-theme'),
            'not_found_in_trash' => __('No projects found in Trash', 'core-theme'),
        ];

        $args = [
            'labels' => $labels,
            'public' => true,
            'has_archive' => true,
            'menu_icon' => 'dashicons-portfolio',
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
            'show_in_rest' => true,
            'rewrite' => ['slug' => 'projects'],
        ];

        register_post_type('project', $args);
    }
}
```

### Step 2: Register in Theme.php

```php
// In inc/Theme.php boot() method
use CoreTheme\PostTypes\Project;

$project = new Project();
```

### Step 3: Create Templates

**File**: `single-project.php`

```php
<?php
$context = Timber::context();
$context['post'] = Timber::get_post();
Timber::render('pages/single-project.twig', $context);
```

**File**: `views/pages/single-project.twig`

```twig
{% extends "layouts/base.twig" %}

{% block content %}
    <article class="project">
        <header class="project__header">
            <h1>{{ post.title }}</h1>
        </header>

        {% if post.thumbnail %}
            <div class="project__image">
                <img src="{{ post.thumbnail.src }}" alt="{{ post.title }}">
            </div>
        {% endif %}

        <div class="project__content">
            {{ post.content }}
        </div>
    </article>
{% endblock %}
```

---

## Adding WordPress Hooks

### Action Hooks

```php
// In your class
add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
add_action('init', [$this, 'registerCustomTaxonomy']);
add_action('save_post', [$this, 'saveCustomMeta']);
```

### Filter Hooks

```php
// Modify content
add_filter('the_content', [$this, 'modifyContent']);

// Modify excerpt length
add_filter('excerpt_length', function () {
    return 30;
});

// Add custom body class
add_filter('body_class', function ($classes) {
    $classes[] = 'custom-body-class';
    return $classes;
});
```

---

## Environment Configuration

### Adding New Environment Variables

#### Step 1: Add to .env.example

```env
# Custom API Settings
CUSTOM_API_KEY=your_api_key_here
CUSTOM_API_URL=https://api.example.com
```

#### Step 2: Add to Your .env

```env
CUSTOM_API_KEY=actual_key_here
CUSTOM_API_URL=https://api.example.com
```

#### Step 3: Access in PHP

```php
$apiKey = getenv('CUSTOM_API_KEY');
$apiUrl = getenv('CUSTOM_API_URL');
```

#### Step 4: Access in JavaScript (via wp_localize_script)

**File**: `inc/Assets.php`

```php
wp_localize_script('core-theme-main', 'coreTheme', [
    'ajaxUrl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('core-theme-nonce'),
    'apiUrl' => getenv('CUSTOM_API_URL'),
]);
```

**File**: `src/js/config.ts`

```typescript
interface CoreThemeConfig {
  ajaxUrl: string;
  nonce: string;
  apiUrl: string;
}

declare global {
  interface Window {
    coreTheme: CoreThemeConfig;
  }
}

export const config = window.coreTheme;
```

---

## Best Practices

### 1. Always Follow BEM for CSS

```css
/* Good */
.component__element--modifier {}

/* Bad */
.component .element.modifier {}
```

### 2. Use TypeScript Types

```typescript
// Good
function processData(data: string): number {
  return data.length;
}

// Bad
function processData(data) {
  return data.length;
}
```

### 3. Sanitize Input, Escape Output

```php
// Input sanitization
$input = sanitize_text_field($_POST['input']);

// Output escaping
echo esc_html($data);
echo esc_url($url);
echo esc_attr($attribute);
```

### 4. Write Tests

```typescript
// src/js/utils/helper.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from './helper';

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction('input')).toBe('expected output');
  });
});
```

### 5. Use Meaningful Commit Messages

```bash
git commit -m "feat: add contact form component"
git commit -m "fix: resolve navigation menu bug"
git commit -m "docs: update customization guide"
```

---

## Troubleshooting

### Vite Not Loading Assets

1. Check `.env` file has correct `VITE_DEV_SERVER_URL`
2. Ensure `npm run dev` is running
3. Clear browser cache
4. Check browser console for CORS errors

### Timber Not Finding Templates

1. Check template path in `Timber::render()`
2. Verify file exists in `views/` directory
3. Check file extension is `.twig`
4. Ensure Timber is properly initialized

### Svelte Component Not Mounting

1. Check mount point exists in HTML
2. Verify component import path
3. Check browser console for errors
4. Ensure Vite compiled the component

### PHP Class Not Found

1. Run `composer dump-autoload`
2. Check namespace matches directory structure
3. Verify class is imported/used correctly
4. Check for typos in class name

---

## Additional Resources

- [CSS Framework Documentation](CSS_FRAMEWORK.md)
- [Environment Usage Guide](ENV_USAGE.md)
- [Testing Guide](TESTING.md)
- [Performance Optimization](PERFORMANCE.md)
- [Timber Documentation](https://timber.github.io/docs/)
- [Svelte Documentation](https://svelte.dev/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

---

**Need more help?** Check the [main README](../README.md) or open an issue on GitHub.
