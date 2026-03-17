/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 usa "experimental.serverComponentsExternalPackages"
  // Next.js 15+ usa "serverExternalPackages"
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

module.exports = nextConfig;