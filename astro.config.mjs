// @ts-check
import { defineConfig } from 'astro/config';

// Plugins
import tailwindcss from '@tailwindcss/vite';

// Integrations
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';

// Adapters SSR and Deployments
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), mdx(), markdoc(), sitemap()],
  adapter: cloudflare()
});