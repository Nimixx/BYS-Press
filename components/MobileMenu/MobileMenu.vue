<template>
  <!-- Overlay -->
  <Transition name="overlay">
    <div v-if="isOpen" class="mobile-menu-overlay" @click="closeMenu"></div>
  </Transition>

  <!-- Sidebar Menu -->
  <Transition name="slide">
    <aside v-if="isOpen" class="mobile-menu" role="navigation" aria-label="Mobile Navigation">
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
 * Includes overlay backdrop and Vue transitions.
 * Communicates with MenuToggle via custom DOM events.
 *
 * @component MobileMenu
 */
import { ref, watch, onMounted, onUnmounted } from 'vue';
import type { MobileMenuProps } from './MobileMenu.types';

const props = withDefaults(defineProps<MobileMenuProps>(), {
  isOpen: false,
  items: () => [],
});

const isOpen = ref(props.isOpen);

/**
 * Handle toggle event from MenuToggle
 */
const handleToggle = (event: Event) => {
  const customEvent = event as CustomEvent<{ isOpen: boolean }>;
  isOpen.value = customEvent.detail.isOpen;

  // Lock/unlock body scroll
  document.body.style.overflow = isOpen.value ? 'hidden' : '';
};

/**
 * Close menu and notify MenuToggle
 */
const closeMenu = () => {
  isOpen.value = false;
  document.body.style.overflow = '';

  // Dispatch close event for MenuToggle to listen
  const event = new CustomEvent('mobile-menu-close');
  window.dispatchEvent(event);
};

// Watch for prop changes (if parent controls state)
watch(
  () => props.isOpen,
  (newValue) => {
    isOpen.value = newValue;
    document.body.style.overflow = newValue ? 'hidden' : '';
  }
);

onMounted(() => {
  window.addEventListener('mobile-menu-toggle', handleToggle);
});

onUnmounted(() => {
  window.removeEventListener('mobile-menu-toggle', handleToggle);
  // Clean up body scroll on unmount
  document.body.style.overflow = '';
});

// Expose methods
defineExpose({
  closeMenu,
});
</script>

<style scoped>
/* Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal);
}

/* Overlay transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity var(--transition-base);
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Mobile Menu Sidebar */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 280px;
  max-width: 85vw;
  background: var(--color-bg);
  border-left: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
  z-index: calc(var(--z-modal) + 1);
  padding: var(--space-16) var(--space-4) var(--space-4);
}

/* Slide transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform var(--transition-base) ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Menu Navigation */
.mobile-menu__nav {
  width: 100%;
}

.mobile-menu__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Menu Items */
.mobile-menu__item {
  width: 100%;
  margin: 0;
  border-bottom: 1px solid var(--color-border);
}

.mobile-menu__item:last-child {
  border-bottom: none;
}

/* Menu Links */
.mobile-menu__link {
  display: block;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  color: var(--color-text);
  text-decoration: none;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.mobile-menu__link:hover,
.mobile-menu__link:focus {
  background-color: var(--color-surface);
}

/* Active Menu Item */
.mobile-menu__item--active > .mobile-menu__link,
.mobile-menu__link[aria-current='page'] {
  color: var(--color-text);
  background-color: var(--color-neutral-100);
}

/* Submenu */
.mobile-menu__submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  background: var(--color-surface);
}

.mobile-menu__submenu-item {
  margin: 0;
}

/* Submenu Links */
.mobile-menu__submenu-link {
  display: block;
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-sm);
  color: var(--color-text);
  text-decoration: none;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.mobile-menu__submenu-link:hover,
.mobile-menu__submenu-link:focus {
  background-color: var(--color-neutral-100);
}

/* Active Submenu Item */
.mobile-menu__submenu-item--active > .mobile-menu__submenu-link,
.mobile-menu__submenu-link[aria-current='page'] {
  color: var(--color-text);
  background-color: var(--color-neutral-100);
}

/* Hide on desktop */
@media (min-width: 769px) {
  .mobile-menu,
  .mobile-menu-overlay {
    display: none;
  }
}
</style>
