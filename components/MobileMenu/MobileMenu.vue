<template>
  <!-- Overlay -->
  <Transition name="overlay">
    <div v-if="isOpen" class="mobile-menu-overlay" @click="closeMenu"></div>
  </Transition>

  <!-- Sidebar Menu -->
  <Transition name="slide">
    <aside
      v-if="isOpen"
      ref="menuRef"
      class="mobile-menu"
      role="navigation"
      aria-label="Mobile Navigation"
      aria-modal="true"
    >
      <nav class="mobile-menu__nav">
        <ul class="mobile-menu__list">
          <li
            v-for="(item, index) in sanitizedItems"
            :key="index"
            :class="[
              'mobile-menu__item',
              { 'mobile-menu__item--active': item.current || item.has_active_child },
              { 'mobile-menu__item--has-children': item.children && item.children.length > 0 },
            ]"
          >
            <a
              :href="item.url"
              class="mobile-menu__link"
              :aria-current="item.current ? 'page' : undefined"
              @click="handleNavigation($event, item.url, item.title)"
            >
              {{ item.title }}
            </a>

            <!-- Submenu -->
            <ul v-if="item.children && item.children.length > 0" class="mobile-menu__submenu">
              <li
                v-for="(child, childIndex) in item.children"
                :key="childIndex"
                :class="['mobile-menu__submenu-item', { 'mobile-menu__submenu-item--active': child.current }]"
              >
                <a
                  :href="child.url"
                  class="mobile-menu__submenu-link"
                  :aria-current="child.current ? 'page' : undefined"
                  @click="handleNavigation($event, child.url, child.title)"
                >
                  {{ child.title }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
/**
 * MobileMenu Component
 *
 * Slide-in sidebar menu for mobile devices.
 * Includes overlay backdrop, Vue transitions, and focus trap for accessibility.
 * All business logic is handled by the useMobileMenu composable.
 * URLs are validated for security using client-side validation.
 *
 * @component MobileMenu
 */
import { computed } from 'vue';
import { useMobileMenu } from '../../composables/useMobileMenu';
import { sanitizeUrl, validateMenuUrl } from '../../lib/security/urlValidator';
import type { MobileMenuProps, MenuItem } from './MobileMenu.types';

const props = withDefaults(defineProps<MobileMenuProps>(), {
  isOpen: false,
  items: () => [],
});

/**
 * Sanitize menu items recursively
 * Validates and sanitizes all URLs for security
 */
const sanitizedItems = computed<MenuItem[]>(() => {
  const sanitizeMenuItem = (item: MenuItem): MenuItem => {
    // Validate URL with context for logging
    validateMenuUrl(item.url, item.title);

    return {
      ...item,
      url: sanitizeUrl(item.url),
      children: item.children?.map(sanitizeMenuItem),
    };
  };

  return props.items.map(sanitizeMenuItem);
});

// Use composable for all business logic (including focus trap and navigation)
const { isOpen, menuRef, closeMenu, handleNavigation } = useMobileMenu({
  initialOpen: props.isOpen,
  lockBodyScroll: true,
  enableFocusTrap: true,
});

// Expose methods
defineExpose({
  closeMenu,
  isOpen,
});
</script>

<style src="./MobileMenu.css" scoped></style>
<style src="./MobileMenu.responsive.css" scoped></style>
