const Package = require('./package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    version: Package.version
  }
}

module.exports = nextConfig