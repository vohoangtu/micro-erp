/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/crm',
  assetPrefix: '/crm',
  transpilePackages: ['@erp/ui', '@erp/shared-types']
};

export default nextConfig;
