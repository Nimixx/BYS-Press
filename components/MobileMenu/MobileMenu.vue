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

<style src="./MobileMenu.css" scoped></style>
