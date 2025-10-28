<template>
  <button
    class="menu-toggle"
    type="button"
    :aria-label="isOpen ? 'Close menu' : 'Open menu'"
    :aria-expanded="isOpen"
    @click="toggle"
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
 * Uses useMenuToggle composable for business logic.
 *
 * @component MenuToggle
 */
import { useMenuToggle } from '../../composables/useMenuToggle';
import type { MenuToggleProps } from './MenuToggle.types';

const props = withDefaults(defineProps<MenuToggleProps>(), {
  isOpen: false,
});

// Use composable for all business logic
const { isOpen, toggle } = useMenuToggle({
  initialOpen: props.isOpen,
});

// Expose for external access
defineExpose({
  isOpen,
  toggle,
});
</script>

<style src="./MenuToggle.css" scoped></style>
<style src="./MenuToggle.responsive.css" scoped></style>
