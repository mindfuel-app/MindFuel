// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
await import("./src/env.mjs");

import withPWA from 'next-pwa'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
}

const buildConfig = _phase => {
  const plugins = [withPWA]
  const config = plugins.reduce((acc, next) => next(acc), {
    ...nextConfig,
  })
  return config
}

export default buildConfig