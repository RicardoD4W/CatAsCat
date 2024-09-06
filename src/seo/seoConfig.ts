// Type imports
import type { ManifestOptions } from 'vite-plugin-pwa'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts'

/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
  baseURL: SITE_URL, // Production URL.
  description: SITE_DESCRIPTION,
  type: 'website',
  image: {
    url: '/favicon/android-chrome-512x512.png',
    alt: SITE_TITLE,
    width: 512,
    height: 512,
  },
  siteName: SITE_TITLE,
  twitter: {
    card: 'summary_large_image',
  },
}

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
  name: SITE_TITLE,
  short_name: SITE_TITLE,
  description: SITE_DESCRIPTION,
  theme_color: '#2C3E50',
  background_color: '#F8F8F0',
  display: 'standalone',
  lang: 'es',
  icons: [
    {
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
}
