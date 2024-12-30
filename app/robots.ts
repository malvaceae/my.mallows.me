// Next.js
import type { MetadataRoute } from 'next';

// robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
