/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/ai',
  assetPrefix: '/ai',
  transpilePackages: ['@erp/ui', '@erp/shared-types']
};

export default nextConfig;
