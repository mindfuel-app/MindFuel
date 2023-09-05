const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization.splitChunks = false;
    }
    return config;
  },
});
