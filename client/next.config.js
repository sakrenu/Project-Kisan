const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'pa'],
    defaultLocale: 'en',
  },
  eslint: {
    ignoreDuringBuilds: true, // Optionally disable ESLint during builds
  },
});