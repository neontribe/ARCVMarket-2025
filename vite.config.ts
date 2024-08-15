import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'child_process';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),
    VitePWA({ registerType: 'autoUpdate' })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    BRANCH: JSON.stringify(execSync('git rev-parse --abbrev-ref HEAD').toString().trim()),
    VERSION: JSON.stringify(execSync('git rev-parse HEAD').toString().trim()),
    BUILD_DATE: JSON.stringify(new Date().toISOString())
  }
});
