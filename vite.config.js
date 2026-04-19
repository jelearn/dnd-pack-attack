import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  // base './' produces relative asset paths so the app works when served from
  // a subdirectory (e.g. GitHub Pages at /dnd-pack-attack/) as well as root.
  base: './',
  build: {
    outDir: 'dist'
  }
});
