/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/booking',
  assetPrefix: '/booking',
  transpilePackages: ['@erp/ui', '@erp/shared-types']
};

export default nextConfig;
