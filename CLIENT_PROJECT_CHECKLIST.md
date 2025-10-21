# Client Project Checklist

**Using Core Theme as Your Foundation**

This checklist guides you through adapting Core Theme for a real-world client project. Follow these steps to ensure a professional, secure, and maintainable WordPress theme.

---

## 📋 Table of Contents

1. [Pre-Project Setup](#1-pre-project-setup)
2. [Initial Configuration](#2-initial-configuration)
3. [Branding & Identity](#3-branding--identity)
4. [Content & Templates](#4-content--templates)
5. [Components & Functionality](#5-components--functionality)
6. [Security Hardening](#6-security-hardening)
7. [Performance Optimization](#7-performance-optimization)
8. [Testing & QA](#8-testing--qa)
9. [Pre-Launch](#9-pre-launch)
10. [Deployment](#10-deployment)
11. [Post-Launch](#11-post-launch)

---

## 1. Pre-Project Setup

### Repository & Version Control

- [ ] **Clone Core Theme**
  ```bash
  git clone https://github.com/tadeasthelen/core-theme.git client-theme-name
  cd client-theme-name
  ```

- [ ] **Remove Original Git History**
  ```bash
  rm -rf .git
  git init
  git add .
  git commit -m "Initial commit: Core Theme foundation"
  ```

- [ ] **Create New Repository**
  - [ ] Create private repo on GitHub/GitLab/Bitbucket
  - [ ] Add remote: `git remote add origin <your-repo-url>`
  - [ ] Push: `git push -u origin main`
  - [ ] Invite client to repo (if applicable)

- [ ] **Set Up Branch Strategy**
  - [ ] Create `develop` branch
  - [ ] Create `staging` branch (optional)
  - [ ] Configure branch protection rules
  - [ ] Document workflow in README

### Development Environment

- [ ] **Verify Requirements**
  - [ ] PHP 8.1+ installed
  - [ ] Node.js 18+ installed
  - [ ] Composer 2.x installed
  - [ ] Local WordPress environment (MAMP, Local, Docker, etc.)

- [ ] **Install Dependencies**
  ```bash
  composer install
  npm install
  ```

- [ ] **Configure Environment**
  ```bash
  cp .env.example .env
  # Edit .env with local WordPress URL
  ```

- [ ] **Test Build Process**
  ```bash
  npm run dev        # Verify Vite works
  npm run build      # Verify production build
  npm run test:all   # Run all tests
  ```

### Documentation

- [ ] **Update README.md**
  - [ ] Project name and description
  - [ ] Client information
  - [ ] Setup instructions
  - [ ] Team member list
  - [ ] Project-specific notes

- [ ] **Create Project Documentation**
  - [ ] `PROJECT_NOTES.md` - Client requirements, decisions
  - [ ] `CHANGELOG.md` - Track major changes
  - [ ] `DEPLOYMENT.md` - Deployment instructions

---

## 2. Initial Configuration

### Theme Information

- [ ] **Update style.css**
  ```css
  Theme Name: [Client Name] Theme
  Theme URI: [Client Website or Your Agency Site]
  Author: [Your Name/Agency]
  Author URI: [Your Website]
  Description: [Custom description for client]
  Version: 0.1.0
  Text Domain: [client-slug]
  ```

- [ ] **Update package.json**
  ```json
  {
    "name": "client-theme-name",
    "version": "0.1.0",
    "description": "Custom WordPress theme for [Client]",
    "author": "Your Name/Agency",
  }
  ```

- [ ] **Update composer.json**
  ```json
  {
    "name": "yourname/client-theme",
    "description": "Custom WordPress theme for [Client]"
  }
  ```

### Namespace & Text Domain

- [ ] **Update PHP Namespace** (if renaming)
  - [ ] Find/replace `CoreTheme\` → `YourNamespace\`
  - [ ] Update `composer.json` autoload section
  - [ ] Run `composer dump-autoload`

- [ ] **Update Text Domain**
  - [ ] Find/replace `'core-theme'` → `'client-slug'`
  - [ ] Update in `style.css`
  - [ ] Update in `inc/ThemeSetup.php` (menu registration)
  - [ ] Update in all translation functions

- [ ] **Generate Translation File**
  ```bash
  wp i18n make-pot . languages/client-slug.pot
  ```

### Clean Up Example Code

- [ ] **Remove Example Components**
  - [ ] Delete `src/components/Counter.vue` (or keep as reference)
  - [ ] Clear `vueComponentRegistry` in `src/js/config/vueComponents.ts`
  - [ ] Remove example tests if not needed

- [ ] **Clean Documentation References**
  - [ ] Update CLAUDE.md with project specifics
  - [ ] Remove references to "Core Theme" where inappropriate
  - [ ] Update all example code snippets

---

## 3. Branding & Identity

### Visual Identity

- [ ] **Add Theme Screenshot**
  - [ ] Create `screenshot.png` (1200x900px)
  - [ ] Use client's homepage design or mockup
  - [ ] Optimize image size (<500KB)

- [ ] **Favicon & Icons**
  - [ ] Add favicon.ico (via WordPress Customizer or plugin)
  - [ ] Add Apple touch icon
  - [ ] Add PWA icons (if applicable)

- [ ] **Logo Implementation**
  - [ ] Configure custom logo support (already in ThemeSetup)
  - [ ] Create Twig partial for logo display
  - [ ] Add logo upload in WordPress Customizer
  - [ ] Implement SVG logo support if needed

### Colors & Typography

- [ ] **Define Color System**
  - [ ] Update `src/css/abstracts/tokens.css` with client colors
  ```css
  :root {
    --color-primary: #your-brand-color;
    --color-secondary: #secondary-color;
    --color-accent: #accent-color;
    /* etc. */
  }
  ```

- [ ] **Typography Setup**
  - [ ] Choose fonts (Google Fonts, Adobe Fonts, or self-hosted)
  - [ ] Update `src/css/base/typography.css`
  - [ ] Add font preload if using web fonts
  - [ ] Configure font fallback stack

- [ ] **Dark Mode** (if required)
  - [ ] Create dark mode color tokens
  - [ ] Implement theme switcher component
  - [ ] Add user preference detection
  - [ ] Test all components in dark mode

### WordPress Customizer

- [ ] **Add Customizer Options**
  - [ ] Create `inc/Customizer.php` class
  - [ ] Add sections for:
    - [ ] Site identity (logo, tagline)
    - [ ] Colors (primary, secondary, etc.)
    - [ ] Typography (font choices, sizes)
    - [ ] Layout options
    - [ ] Social media links
  - [ ] Register customizer in `Theme->boot()`

---

## 4. Content & Templates

### Template Planning

- [ ] **Map Out Required Templates**
  - [ ] Homepage (front-page.twig)
  - [ ] About page
  - [ ] Services/Products pages
  - [ ] Blog archive (archive.twig)
  - [ ] Single post (single.twig)
  - [ ] Single page (page.twig)
  - [ ] 404 page (404.twig)
  - [ ] Search results (search.twig)
  - [ ] Custom post type templates (if needed)

- [ ] **Create PHP Template Files**
  ```bash
  # Example: Create single.php
  touch single.php
  ```
  ```php
  <?php
  // single.php
  $context = Timber::context();
  $context['post'] = Timber::get_post();
  Timber::render('pages/single.twig', $context);
  ```

- [ ] **Create Twig Templates**
  - [ ] Create in `views/pages/`
  - [ ] Extend `layouts/base.twig`
  - [ ] Use `partials/` for reusable components

### Layouts

- [ ] **Update Base Layout**
  - [ ] Modify `views/layouts/base.twig`
  - [ ] Add client-specific meta tags
  - [ ] Update Open Graph tags
  - [ ] Add structured data (JSON-LD)

- [ ] **Create Additional Layouts** (if needed)
  - [ ] Full-width layout
  - [ ] Sidebar layout
  - [ ] Landing page layout

### Partials

- [ ] **Header Component**
  - [ ] Update `views/partials/header.twig`
  - [ ] Implement navigation menu
  - [ ] Add search (if needed)
  - [ ] Implement mobile menu

- [ ] **Footer Component**
  - [ ] Update `views/partials/footer.twig`
  - [ ] Add footer menu
  - [ ] Add social links
  - [ ] Add copyright info
  - [ ] Newsletter signup (if needed)

- [ ] **Additional Partials**
  - [ ] Breadcrumbs
  - [ ] Pagination
  - [ ] Post meta
  - [ ] Author bio
  - [ ] Related posts
  - [ ] Call-to-action sections

### Custom Post Types & Taxonomies

- [ ] **Define Custom Post Types**
  - [ ] Create `inc/PostTypes.php`
  - [ ] Register CPTs (portfolio, testimonials, etc.)
  - [ ] Add to `Theme->boot()`

- [ ] **Define Custom Taxonomies**
  - [ ] Create taxonomy registration
  - [ ] Associate with post types

- [ ] **Create CPT Templates**
  - [ ] Archive templates
  - [ ] Single templates
  - [ ] Taxonomy templates

### Menus & Navigation

- [ ] **Configure Navigation Menus**
  - [ ] Register additional menus if needed (already has primary/footer)
  - [ ] Create menu walker (if custom markup needed)
  - [ ] Style navigation in CSS

- [ ] **Implement Mobile Navigation**
  - [ ] Create Vue component for mobile menu
  - [ ] Add hamburger icon
  - [ ] Implement accessibility features
  - [ ] Test on various devices

### Widgets & Sidebars

- [ ] **Register Widget Areas**
  - [ ] Create `inc/Widgets.php`
  - [ ] Register sidebars
  - [ ] Create widget templates
  - [ ] Add to `Theme->boot()`

---

## 5. Components & Functionality

### Vue Components Development

- [ ] **Plan Component Architecture**
  - [ ] List all interactive components needed
  - [ ] Identify lazy-loadable components
  - [ ] Plan component props and events

- [ ] **Create Vue Components**
  ```
  Example components:
  - [ ] Navigation.vue (mobile menu)
  - [ ] SearchForm.vue
  - [ ] Newsletter.vue
  - [ ] ContactForm.vue
  - [ ] ImageGallery.vue
  - [ ] Tabs.vue
  - [ ] Accordion.vue
  - [ ] Modal.vue
  ```

- [ ] **Register Components**
  - [ ] Update `src/js/config/vueComponents.ts`
  - [ ] Configure page conditions
  - [ ] Set lazy loading where appropriate

- [ ] **Add Component Tests**
  - [ ] Create `.test.ts` files for each component
  - [ ] Test component mounting
  - [ ] Test user interactions
  - [ ] Test edge cases

### Forms

- [ ] **Contact Forms**
  - [ ] Choose form solution (Contact Form 7, Gravity Forms, custom)
  - [ ] Create form templates
  - [ ] Style forms to match design
  - [ ] Add validation
  - [ ] Configure email notifications
  - [ ] Add spam protection (reCAPTCHA, honeypot)

- [ ] **Search Form**
  - [ ] Create custom search component
  - [ ] Style search results
  - [ ] Consider Ajax search
  - [ ] Add search filters (if needed)

### Third-Party Integrations

- [ ] **Analytics**
  - [ ] Google Analytics 4
  - [ ] Configure events tracking
  - [ ] Add privacy-compliant cookie notice

- [ ] **Social Media**
  - [ ] Add social sharing buttons
  - [ ] Configure Open Graph tags
  - [ ] Add Twitter Card tags
  - [ ] Social media feed integration (if needed)

- [ ] **Email Marketing**
  - [ ] Mailchimp/ConvertKit integration
  - [ ] Newsletter signup forms
  - [ ] Configure API keys

- [ ] **E-commerce** (if applicable)
  - [ ] WooCommerce compatibility
  - [ ] Custom product templates
  - [ ] Cart/checkout styling
  - [ ] Payment gateway setup

- [ ] **Other Integrations**
  - [ ] Maps (Google Maps, Mapbox)
  - [ ] Video (YouTube, Vimeo embeds)
  - [ ] Calendars/Booking systems
  - [ ] CRM integration

### WordPress Plugins Configuration

- [ ] **Essential Plugins**
  - [ ] Yoast SEO or Rank Math
  - [ ] Contact form plugin
  - [ ] Backup solution (UpdraftPlus, BackupBuddy)
  - [ ] Security plugin (Wordfence, Sucuri)
  - [ ] Caching plugin (WP Rocket, W3 Total Cache)
  - [ ] Image optimization (ShortPixel, Imagify)

- [ ] **Document Plugin Dependencies**
  - [ ] Create `REQUIRED_PLUGINS.md`
  - [ ] List required vs optional plugins
  - [ ] Document configuration steps

---

## 6. Security Hardening

### Review Security Implementation

- [ ] **Verify Security Headers**
  - [ ] Test CSP on staging server
  - [ ] Adjust CSP for third-party scripts
  - [ ] Add domains to `addAllowedScriptDomain()` as needed
  - [ ] Test security headers with [SecurityHeaders.com](https://securityheaders.com)

- [ ] **Enable Additional Security**
  - [ ] Enable XML-RPC blocking if not needed:
    ```php
    // In Theme->boot()
    $this->security->disableXmlRpc();
    ```
  - [ ] Review REST API restrictions
  - [ ] Verify file editing is disabled

### WordPress Security

- [ ] **Secure wp-config.php**
  - [ ] Move outside web root (if possible)
  - [ ] Set security keys (use [WordPress salt generator](https://api.wordpress.org/secret-key/1.1/salt/))
  - [ ] Disable file editing: `define('DISALLOW_FILE_EDIT', true);`
  - [ ] Limit post revisions: `define('WP_POST_REVISIONS', 5);`

- [ ] **User Security**
  - [ ] Enforce strong passwords
  - [ ] Limit login attempts (plugin)
  - [ ] Two-factor authentication (plugin)
  - [ ] Review user roles and capabilities

- [ ] **File Permissions**
  - [ ] Directories: 755
  - [ ] Files: 644
  - [ ] wp-config.php: 600

- [ ] **Database Security**
  - [ ] Use unique database table prefix
  - [ ] Regular backups configured
  - [ ] Database user has minimal privileges

### SSL/HTTPS

- [ ] **Configure SSL**
  - [ ] Install SSL certificate
  - [ ] Update WordPress URL to https://
  - [ ] Configure HSTS (already in Security.php)
  - [ ] Test with [SSL Labs](https://www.ssllabs.com/ssltest/)

### Security Checklist

- [ ] **Run Security Scans**
  - [ ] [WPScan](https://wpscan.com)
  - [ ] [Sucuri SiteCheck](https://sitecheck.sucuri.net)
  - [ ] [Mozilla Observatory](https://observatory.mozilla.org)

- [ ] **Vulnerability Check**
  - [ ] Update all dependencies: `npm audit fix`
  - [ ] Update Composer packages: `composer update`
  - [ ] Check for WordPress plugin vulnerabilities

---

## 7. Performance Optimization

### Images

- [ ] **Image Optimization**
  - [ ] Install image optimization plugin
  - [ ] Configure WebP conversion
  - [ ] Set up lazy loading:
    ```php
    // Add to ThemeSetup->addThemeSupports()
    add_filter('wp_get_attachment_image_attributes', function($attr) {
        $attr['loading'] = 'lazy';
        return $attr;
    });
    ```

- [ ] **Responsive Images**
  - [ ] Define custom image sizes:
    ```php
    add_image_size('hero', 1920, 1080, true);
    add_image_size('card', 600, 400, true);
    add_image_size('thumbnail-large', 400, 400, true);
    ```
  - [ ] Use `srcset` in templates
  - [ ] Test on various screen sizes

### Critical CSS

- [ ] **Generate Critical CSS**
  ```bash
  # Install critical CSS tool
  npm install --save-dev critical

  # Add to package.json scripts
  "critical": "critical dist/css/main.css --base dist --inline > dist/critical.css"
  ```

- [ ] **Verify Inline Critical CSS**
  - [ ] Test above-the-fold rendering
  - [ ] Verify critical.css is inlined

### Caching

- [ ] **WordPress Caching**
  - [ ] Install caching plugin (WP Rocket recommended)
  - [ ] Configure page caching
  - [ ] Configure browser caching
  - [ ] Enable Gzip compression

- [ ] **Object Caching** (Advanced)
  - [ ] Set up Redis or Memcached (if available)
  - [ ] Install WordPress object cache plugin
  - [ ] Configure Timber to use object cache

- [ ] **CDN Setup** (Optional)
  - [ ] Choose CDN provider (Cloudflare, BunnyCDN, etc.)
  - [ ] Configure CDN
  - [ ] Update asset URLs
  - [ ] Test CDN delivery

### Database Optimization

- [ ] **Optimize Database**
  - [ ] Remove post revisions (or limit)
  - [ ] Clean up auto-drafts
  - [ ] Optimize tables (WP-Optimize plugin)
  - [ ] Remove unused plugins/themes

### Performance Testing

- [ ] **Run Performance Tests**
  - [ ] [Google PageSpeed Insights](https://pagespeed.web.dev/)
  - [ ] [WebPageTest](https://webpagetest.org)
  - [ ] [GTmetrix](https://gtmetrix.com)

- [ ] **Meet Performance Targets**
  - [ ] First Contentful Paint < 1.8s
  - [ ] Largest Contentful Paint < 2.5s
  - [ ] Time to Interactive < 3.8s
  - [ ] Cumulative Layout Shift < 0.1
  - [ ] Total Blocking Time < 300ms

- [ ] **Bundle Size Check**
  ```bash
  npm install --save-dev rollup-plugin-visualizer
  npm run build
  # Check bundle size report
  ```

### Performance Checklist

- [ ] Minified CSS/JS (Vite handles this) ✅
- [ ] Images optimized and lazy loaded
- [ ] Critical CSS inlined
- [ ] Browser caching configured
- [ ] Gzip/Brotli compression enabled
- [ ] Database optimized
- [ ] HTTP/2 enabled on server
- [ ] CDN configured (if applicable)
- [ ] Fonts optimized (display=swap) ✅
- [ ] Remove unused CSS/JS

---

## 8. Testing & QA

### Functional Testing

- [ ] **Test All Pages**
  - [ ] Homepage
  - [ ] All template types
  - [ ] Forms submit correctly
  - [ ] Navigation works
  - [ ] Search functionality
  - [ ] 404 page displays

- [ ] **Test WordPress Features**
  - [ ] Post creation and editing
  - [ ] Image uploads
  - [ ] Menu management
  - [ ] Widget areas
  - [ ] Customizer options save
  - [ ] Custom post types (if any)

### Cross-Browser Testing

- [ ] **Desktop Browsers**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)

- [ ] **Mobile Browsers**
  - [ ] Safari iOS
  - [ ] Chrome Android
  - [ ] Samsung Internet

### Responsive Testing

- [ ] **Test Breakpoints**
  - [ ] Mobile (320px, 375px, 414px)
  - [ ] Tablet (768px, 1024px)
  - [ ] Desktop (1280px, 1440px, 1920px)

- [ ] **Device Testing**
  - [ ] iPhone (Safari)
  - [ ] Android phone (Chrome)
  - [ ] iPad (Safari)
  - [ ] Test landscape and portrait

### Accessibility Testing

- [ ] **Automated Testing**
  - [ ] [WAVE Browser Extension](https://wave.webaim.org/extension/)
  - [ ] [axe DevTools](https://www.deque.com/axe/devtools/)
  - [ ] Lighthouse accessibility audit

- [ ] **Manual Testing**
  - [ ] Keyboard navigation works
  - [ ] Skip links function
  - [ ] Focus visible on interactive elements
  - [ ] Proper heading hierarchy
  - [ ] Alt text on images
  - [ ] Form labels associated
  - [ ] Color contrast meets WCAG AA

- [ ] **Screen Reader Testing**
  - [ ] NVDA (Windows)
  - [ ] JAWS (Windows)
  - [ ] VoiceOver (macOS/iOS)

### Code Quality

- [ ] **Run All Tests**
  ```bash
  npm run test:all      # PHP + JS tests
  npm run lint          # Linting check
  npm run format:check  # Code formatting
  ```

- [ ] **Fix All Warnings**
  - [ ] No ESLint warnings
  - [ ] No PHP warnings
  - [ ] No console errors
  - [ ] No 404s in network tab

### SEO Audit

- [ ] **Technical SEO**
  - [ ] XML sitemap generated
  - [ ] Robots.txt configured
  - [ ] Meta descriptions on all pages
  - [ ] Open Graph tags working
  - [ ] Schema.org markup added
  - [ ] Canonical URLs set

- [ ] **Content SEO**
  - [ ] Page titles optimized
  - [ ] Headings properly structured
  - [ ] Images have alt text
  - [ ] Internal linking structure
  - [ ] 301 redirects configured (if applicable)

---

## 9. Pre-Launch

### Content Review

- [ ] **Content Complete**
  - [ ] All pages have final content
  - [ ] Images optimized and uploaded
  - [ ] Placeholder content removed
  - [ ] Typos and grammar checked

- [ ] **Legal Pages**
  - [ ] Privacy Policy
  - [ ] Terms of Service
  - [ ] Cookie Policy (if EU traffic)
  - [ ] Accessibility Statement

### Configuration

- [ ] **WordPress Settings**
  - [ ] Site title and tagline
  - [ ] Permalink structure
  - [ ] Timezone
  - [ ] Date/time format
  - [ ] Default post/page settings
  - [ ] Discussion settings (comments)
  - [ ] Media settings

- [ ] **Search Engine Visibility**
  - [ ] Remove "Discourage search engines" (if set during development)
  - [ ] Submit sitemap to Google Search Console
  - [ ] Submit sitemap to Bing Webmaster Tools

### Email Configuration

- [ ] **Email Delivery**
  - [ ] Configure SMTP (WP Mail SMTP plugin)
  - [ ] Test all form submissions
  - [ ] Test WordPress notification emails
  - [ ] Check spam folders

### Analytics & Tracking

- [ ] **Install Analytics**
  - [ ] Google Analytics 4
  - [ ] Google Tag Manager (optional)
  - [ ] Facebook Pixel (if needed)
  - [ ] Other tracking codes

- [ ] **Configure Goals/Events**
  - [ ] Form submissions
  - [ ] Button clicks
  - [ ] Downloads
  - [ ] Custom events

### Backup & Disaster Recovery

- [ ] **Backup System**
  - [ ] Automated daily backups configured
  - [ ] Test backup restoration
  - [ ] Off-site backup storage
  - [ ] Document backup procedure

- [ ] **Emergency Contacts**
  - [ ] Create emergency contact list
  - [ ] Document hosting credentials (securely)
  - [ ] DNS provider access
  - [ ] Domain registrar access

### Documentation for Client

- [ ] **Create User Guide**
  - [ ] How to add/edit pages
  - [ ] How to add blog posts
  - [ ] How to manage menus
  - [ ] How to upload images
  - [ ] How to use custom features
  - [ ] Common troubleshooting

- [ ] **Admin Training**
  - [ ] Schedule training session
  - [ ] Record training video (optional)
  - [ ] Provide written instructions

---

## 10. Deployment

### Pre-Deployment Checklist

- [ ] **Code Review**
  - [ ] All git changes committed
  - [ ] No debugging code (console.log, var_dump)
  - [ ] No commented-out code blocks
  - [ ] Version numbers updated

- [ ] **Environment Check**
  - [ ] Production server meets requirements
  - [ ] PHP version compatible (8.1+)
  - [ ] SSL certificate installed
  - [ ] Database created
  - [ ] Server timezone set

### Deployment Process

- [ ] **Database Migration**
  - [ ] Export database from staging
  - [ ] Search-replace URLs (use WP-CLI or plugin)
  - [ ] Import to production database
  - [ ] Verify data integrity

- [ ] **File Upload**
  - [ ] Build production assets: `npm run build`
  - [ ] Upload theme files via FTP/SFTP or Git
  - [ ] Upload WordPress core (if fresh install)
  - [ ] Upload plugins
  - [ ] Upload media files

- [ ] **Configuration**
  - [ ] Update wp-config.php for production
  - [ ] Set database credentials
  - [ ] Regenerate security keys
  - [ ] Disable debugging: `define('WP_DEBUG', false);`
  - [ ] Configure environment type: `define('WP_ENVIRONMENT_TYPE', 'production');`

- [ ] **Activate Theme**
  - [ ] Log in to WordPress admin
  - [ ] Activate theme
  - [ ] Activate required plugins
  - [ ] Verify customizer settings

### Post-Deployment Verification

- [ ] **Smoke Testing**
  - [ ] Homepage loads correctly
  - [ ] All navigation menus work
  - [ ] Forms submit successfully
  - [ ] Images display correctly
  - [ ] No JavaScript errors in console
  - [ ] Admin area accessible

- [ ] **External Services**
  - [ ] Email sending works
  - [ ] Analytics tracking works
  - [ ] Third-party integrations work
  - [ ] CDN serving assets (if applicable)

### DNS & Domain

- [ ] **DNS Configuration**
  - [ ] Point domain to production server
  - [ ] Configure www vs non-www
  - [ ] Set up email MX records
  - [ ] Configure SPF/DKIM for email

- [ ] **Propagation Check**
  - [ ] Wait for DNS propagation (up to 48 hours)
  - [ ] Test from different locations
  - [ ] Verify SSL certificate works on domain

---

## 11. Post-Launch

### Monitoring

- [ ] **Set Up Monitoring**
  - [ ] Uptime monitoring (Pingdom, UptimeRobot)
  - [ ] Error monitoring (Sentry, Rollbar)
  - [ ] Google Search Console
  - [ ] Google Analytics

- [ ] **Performance Monitoring**
  - [ ] Set up performance budget alerts
  - [ ] Monitor Core Web Vitals
  - [ ] Track page load times

### Maintenance Plan

- [ ] **Document Maintenance Tasks**
  - [ ] WordPress core updates
  - [ ] Plugin updates
  - [ ] Theme updates
  - [ ] Database optimization
  - [ ] Backup verification

- [ ] **Create Maintenance Schedule**
  - [ ] Daily: Automated backups
  - [ ] Weekly: Check for updates
  - [ ] Monthly: Security audit, performance review
  - [ ] Quarterly: Content review, analytics review

### Client Handoff

- [ ] **Provide Documentation**
  - [ ] Admin login credentials (securely)
  - [ ] User guide
  - [ ] Maintenance documentation
  - [ ] Support contact information

- [ ] **Training Session**
  - [ ] Conduct admin training
  - [ ] Answer questions
  - [ ] Provide video recordings

- [ ] **Support Agreement**
  - [ ] Define support terms
  - [ ] Set response time expectations
  - [ ] Document covered services
  - [ ] Create ticketing system

### Marketing Launch

- [ ] **Social Media Announcement**
  - [ ] Announce on client's social channels
  - [ ] Share on your portfolio
  - [ ] LinkedIn post (tag client)

- [ ] **SEO Submission**
  - [ ] Submit to search engines
  - [ ] Submit to directories (if applicable)
  - [ ] Create Google My Business listing

### 30-Day Post-Launch Review

- [ ] **Performance Review**
  - [ ] Review analytics data
  - [ ] Check page load speeds
  - [ ] Review error logs
  - [ ] Check broken links

- [ ] **User Feedback**
  - [ ] Gather client feedback
  - [ ] Review user behavior in analytics
  - [ ] Check form submission rates
  - [ ] Review bounce rates

- [ ] **Optimization**
  - [ ] Address any issues found
  - [ ] Implement quick wins
  - [ ] Plan future enhancements

---

## Appendix: Useful Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test:all

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check
```

### WordPress CLI

```bash
# Search-replace URLs
wp search-replace 'http://old-site.com' 'https://new-site.com' --all-tables

# Export database
wp db export backup.sql

# Import database
wp db import backup.sql

# Clear cache
wp cache flush

# Regenerate thumbnails
wp media regenerate
```

### Deployment

```bash
# Create deployment bundle
npm run bundle

# Sync files to server (example)
rsync -avz --exclude 'node_modules' --exclude '.git' . user@server:/path/to/theme/
```

---

## Quick Reference: File Locations

| Task | File Location |
|------|---------------|
| Theme info | `style.css` |
| PHP classes | `inc/` |
| Vue components | `src/components/` |
| Twig templates | `views/` |
| CSS styles | `src/css/` |
| JavaScript/TS | `src/js/` |
| Tests (PHP) | `tests/` |
| Tests (JS) | Co-located with source in `src/` |
| Build output | `dist/` |
| Dependencies | `vendor/`, `node_modules/` |

---

## Support Resources

### Documentation
- [WordPress Developer Resources](https://developer.wordpress.org/)
- [Timber Documentation](https://timber.github.io/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue 3 Documentation](https://vuejs.org/)

### Community
- [WordPress Stack Exchange](https://wordpress.stackexchange.com/)
- [Timber Slack](https://timber.github.io/docs/getting-started/setup/)
- [Vue Discord](https://discord.com/invite/vue)

### Tools
- [WP-CLI](https://wp-cli.org/)
- [Query Monitor Plugin](https://querymonitor.com/)
- [Debug Bar Plugin](https://wordpress.org/plugins/debug-bar/)

---

**Version:** 1.0.0
**Last Updated:** October 20, 2025

**Happy Building! 🚀**

_Remember: This checklist is comprehensive but adapt it to your specific project needs. Not every item will apply to every project._
