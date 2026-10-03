// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';
import vue from '@astrojs/vue';

// STATIC_BUILD=1 -> salida 100% estática (GitHub Pages), sin adapter Cloudflare
const isStaticBuild = process.env.STATIC_BUILD === '1';

// https://astro.build/config
export default defineConfig({
  base: process.env.ASTRO_BASE ?? '/numplate/',
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [tailwindcss()],
  },
  ...(isStaticBuild ? {} : { adapter: cloudflare() }),
  integrations: [vue()],
});
