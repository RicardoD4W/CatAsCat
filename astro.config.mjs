import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import netlify from '@astrojs/netlify'
import preact from '@astrojs/preact'

import { manifest, seoConfig } from './src/seo/seoConfig'
import { VitePWA } from 'vite-plugin-pwa'

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  prefetch: true,
  devToolbar: {
    enabled: false,
  },
  integrations: [mdx(), sitemap(), preact()],
  adapter: netlify(),
  output: 'hybrid',
  site: seoConfig.baseURL,
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
    ssr: {
      noExternal: ['path-to-regexp'],
    },
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest,
        workbox: {
          globDirectory: 'dist/',
          globPatterns: ['**/*.{html,js,css,woff,woff2,ttf,eot,ico}'],
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
            {
              urlPattern: /\.(?:woff|woff2|ttf|eot|ico)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'fonts',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
          ],
          navigateFallback: null,
        },
      }),
    ],
  },
})
