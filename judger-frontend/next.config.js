/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { nextRuntime }) {
    if (nextRuntime === 'nodejs') {
      config.resolve.alias.canvas = false;
    }

    return config;
  },
};

module.exports = nextConfig;
