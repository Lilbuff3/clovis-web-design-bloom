import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://cloviswebdesign.com',
  trailingSlash: 'always',
  // Preview tooling assigns PORT when 4321 is taken (e.g. by another worktree's dev server).
  server: { port: Number(process.env.PORT) || 4321 },
  build: {
    format: 'directory',
    // One 13 KB stylesheet was the only render-blocking request (PageSpeed: ~1.5s on mobile).
    inlineStylesheets: 'always',
  },
  integrations: [
    react(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
});
