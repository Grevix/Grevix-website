import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/projects',
          '/events',
          '/community',
          '/blog',
          '/privacy',
          '/terms',
          '/styles.css',
          '/main.js',
          '/favicon.jpg',
          '/favicon.svg',
        ],
        disallow: ['/api/', '/private_data/'],
      },
    ],
    sitemap: 'https://grevix.online/sitemap.xml',
  }
}
