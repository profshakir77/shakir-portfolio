/** @type {import('next').NextConfig} */
const longCache = 'public, max-age=604800, stale-while-revalidate=86400';
const pageCache = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';

const nextConfig = {
  // Serve images as-is: no Image Optimization usage on Vercel.
  images: { unoptimized: true },
  poweredByHeader: false,

  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/work.html', destination: '/work', permanent: true },
      { source: '/prototyping.html', destination: '/prototyping', permanent: true },
      { source: '/full-stack.html', destination: '/full-stack', permanent: true },
      { source: '/mentorship.html', destination: '/mentorship', permanent: true },
      { source: '/leave-review.html', destination: '/leave-review', permanent: true },
    ];
  },

  async rewrites() {
    return [
      // Collection endpoints with an id in the path, kept from the old vercel.json.
      { source: '/api/reviews/:id', destination: '/api/reviews?id=:id' },
      { source: '/api/projects/:id', destination: '/api/projects?id=:id' },
      { source: '/api/students/:id', destination: '/api/students?id=:id' },
      { source: '/api/posts/:slug', destination: '/api/posts?slug=:slug' },
      // Clean URLs for the legacy static pages.
      { source: '/services', destination: '/services.html' },
      { source: '/about', destination: '/about.html' },
      { source: '/contact', destination: '/contact.html' },
      { source: '/testimonials', destination: '/testimonials.html' },
      { source: '/blog', destination: '/blog.html' },
      { source: '/student-portal', destination: '/student-portal.html' },
    ];
  },

  async headers() {
    return [
      { source: '/:all*(css|js|svg|png|jpg|jpeg|webp|ico|woff2)', headers: [{ key: 'Cache-Control', value: longCache }] },
      { source: '/:page*.html', headers: [{ key: 'Cache-Control', value: pageCache }] },
      { source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] },
    ];
  },
};

export default nextConfig;
