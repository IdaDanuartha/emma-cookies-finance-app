const withPWA = require('next-pwa')({
  dest: 'public', // Output directory for service worker
  register: true, // Automatically register service worker
  skipWaiting: true, // Activate service worker immediately
  scope: '/src/app',
  sw: 'sw.js',
  // disable: process.env.NODE_ENV === 'development', // Disable in development mode
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["zatxazslypyvobuhblvj.supabase.co"], // Tambahkan domain supabase
  },
    /**
   * @param {Configuration} config
   * @returns {Configuration}
   */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});