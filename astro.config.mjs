import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

// Site URL — update if a custom domain is set in CNAME (e.g. https://northumberlandrcc.org.uk)
export default defineConfig({
  site: 'https://northumberlandrcc.org.uk',
  trailingSlash: 'ignore',
  integrations: [sitemap()],

  build: {
    format: 'directory',
  },

  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },

  output: "hybrid",
  adapter: cloudflare()
});