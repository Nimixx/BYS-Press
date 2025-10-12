// Main TypeScript Entry Point
import '../css/main.css';
import { mount } from 'svelte';
import Counter from '../components/Counter.svelte';

console.log('Core Theme loaded!');

// Mount Svelte Counter component
const counterElement = document.getElementById('svelte-counter');
if (counterElement) {
  mount(Counter, { target: counterElement });
}

