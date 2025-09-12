import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/'],
    },
    sitemap: 'https://name0x0.github.io/sitemap.xml',
    host: 'https://name0x0.github.io',
  };
}