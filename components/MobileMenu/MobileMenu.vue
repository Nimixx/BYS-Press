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
            v-for="(item, index) in items"
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
 * Uses useMobileMenu composable for business logic.
 * Uses useFocusTrap for keyboard accessibility.
 *
 * @component MobileMenu
 */
import { ref, watch, nextTick } from 'vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import { useMobileMenu } from '../../composables/useMobileMenu';
import type { MobileMenuProps } from './MobileMenu.types';

const props = withDefaults(defineProps<MobileMenuProps>(), {
  isOpen: false,
  items: () => [],
});

// Use composable for all business logic
const { isOpen, closeMenu } = useMobileMenu({
  initialOpen: props.isOpen,
  lockBodyScroll: true,
});

// Create ref for the menu element
const menuRef = ref<HTMLElement>();

// Setup focus trap for accessibility
const { activate, deactivate } = useFocusTrap(menuRef, {
  // Allow ESC key to close the menu
  escapeDeactivates: true,
  // Allow clicking outside to close (handled by overlay)
  allowOutsideClick: true,
  // Return focus to the toggle button when closing
  returnFocusOnDeactivate: true,
  // Focus the first link when menu opens
  initialFocus: () => menuRef.value?.querySelector('.mobile-menu__link') as HTMLElement,
  // Fallback focus to menu container if no links found
  fallbackFocus: () => menuRef.value as HTMLElement,
  // Handle ESC key to close menu
  onDeactivate: () => {
    closeMenu();
  },
});

// Watch isOpen state to activate/deactivate focus trap
watch(isOpen, async (newValue) => {
  if (newValue) {
    // Wait for the element to be rendered with v-if
    await nextTick();
    // Small delay to ensure transition starts smoothly
    setTimeout(() => {
      activate();
    }, 50);
  } else {
    deactivate();
  }
});

// Expose methods
defineExpose({
  closeMenu,
  isOpen,
});
</script>

<style src="./MobileMenu.css" scoped></style>
<style src="./MobileMenu.responsive.css" scoped></style>
