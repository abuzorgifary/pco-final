/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "randomuser.me"],
  },
  experimental: {
    reactRoot: true,
    suppressHydrationWarning: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Add .mjs support
    config.resolve.extensions.push(".mjs");
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
};

module.exports = nextConfig;

