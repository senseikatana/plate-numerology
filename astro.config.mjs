// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  base: '/numplate/',
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [tailwindcss()],
  },
  adapter: cloudflare(),
  integrations: [vue()],
});
