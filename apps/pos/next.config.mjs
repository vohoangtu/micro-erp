/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/pos',
  assetPrefix: '/pos',
  transpilePackages: ['@erp/ui', '@erp/shared-types']
};

export default nextConfig;
