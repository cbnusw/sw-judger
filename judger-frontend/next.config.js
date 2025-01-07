/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  webpack(config, { nextRuntime }) {
    if (nextRuntime === 'nodejs') {
      config.resolve.alias.canvas = false;
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
