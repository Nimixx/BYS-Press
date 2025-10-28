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

<style scoped>
.menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: var(--z-sticky);
}

.menu-toggle:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* Hamburger bars */
.menu-toggle__bar {
  width: 100%;
  height: 2px;
  background-color: var(--color-text);
  border-radius: 2px;
  transition:
    all var(--transition-base) ease-in-out,
    transform var(--transition-base) ease-in-out,
    opacity var(--transition-base) ease-in-out;
  transform-origin: center;
}

/* Animate to X when active */
.menu-toggle[aria-expanded='true'] .menu-toggle__bar:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-toggle[aria-expanded='true'] .menu-toggle__bar:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.menu-toggle[aria-expanded='true'] .menu-toggle__bar:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Hide on desktop */
@media (min-width: 769px) {
  .menu-toggle {
    display: none;
  }
}
</style>
