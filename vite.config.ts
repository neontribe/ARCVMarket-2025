import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'child_process';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    esbuild: {
        target: 'es2017'
    },
    plugins: [
        vue(),
        vueJsx(),
        legacy({
            targets: ['defaults', 'since 2017'],
            renderModernChunks: false,
        }),
        VueDevTools(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                // TODO: consider 'id' property
                // App title
                name: 'Alexandra Rose Charities Voucher Records & Reimbursement',
                // Icon name
                short_name: 'Rosie',
                description:
                    'Record your Rose Vouchers, check, submit and request reimbursement',
                lang: 'en',
                dir: 'ltr',
                // be app-like, don't show browser window
                display: 'standalone',
                // nudge to portrait for phones and landscape for devices
                orientation: 'natural',
                theme_color: '#a74e94',
                background_color: '#fff',
                icons: [
                    {
                        "src": "/icons/pwa-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png",
                        "purpose": "any"
                    },
                    {
                        "src": "/icons/pwa-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "any"
                    },
                    {
                        "src": "/icons/pwa-maskable-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png",
                        "purpose": "maskable"
                    },
                    {
                        "src": "/icons/pwa-maskable-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable"
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                // don't warn about css dependencies we can't control
                quietDeps: true,
            }
        }
    },
    define: {
        BRANCH: JSON.stringify(
            execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
        ),
        VERSION: JSON.stringify(
            execSync('git rev-parse HEAD').toString().trim()
        ),
        BUILD_DATE: JSON.stringify(new Date().toISOString())
    }
});
