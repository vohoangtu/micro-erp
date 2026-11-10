/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/system',
  assetPrefix: '/system',
  transpilePackages: ['@erp/ui', '@erp/shared-types']
};

export default nextConfig;
