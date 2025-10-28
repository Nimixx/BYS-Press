<template>
  <button
    class="menu-toggle"
    type="button"
    :aria-label="isOpen ? 'Close menu' : 'Open menu'"
    :aria-expanded="isOpen"
    @click="handleClick"
  >
    <span class="menu-toggle__bar"></span>
    <span class="menu-toggle__bar"></span>
    <span class="menu-toggle__bar"></span>
  </button>
</template>

<script setup lang="ts">
/**
 * MenuToggle Component
 *
 * Hamburger button that toggles the mobile menu.
 * Animates from 3 bars to X when open.
 * Communicates with MobileMenu via custom DOM events.
 *
 * @component MenuToggle
 */
import { ref, onMounted, onUnmounted } from 'vue';
import type { MenuToggleProps } from './MenuToggle.types';

const props = withDefaults(defineProps<MenuToggleProps>(), {
  isOpen: false,
});

const isOpen = ref(props.isOpen);

/**
 * Toggle menu and dispatch custom event
 */
const handleClick = () => {
  isOpen.value = !isOpen.value;

  // Dispatch custom DOM event for MobileMenu to listen
  const event = new CustomEvent('mobile-menu-toggle', {
    detail: { isOpen: isOpen.value },
  });
  window.dispatchEvent(event);
};

/**
 * Listen for menu close events from MobileMenu
 */
const handleMenuClose = () => {
  isOpen.value = false;
};

onMounted(() => {
  window.addEventListener('mobile-menu-close', handleMenuClose);
});

onUnmounted(() => {
  window.removeEventListener('mobile-menu-close', handleMenuClose);
});

// Expose for external access
defineExpose({
  isOpen,
});
</script>

<style src="./MenuToggle.css" scoped></style>
<style src="./MenuToggle.responsive.css" scoped></style>
