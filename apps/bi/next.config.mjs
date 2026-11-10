/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/bi',
  assetPrefix: '/bi',
  transpilePackages: ['@erp/ui', '@erp/shared-types']
};

export default nextConfig;
