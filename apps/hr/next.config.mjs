/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/hr',
  assetPrefix: '/hr',
  transpilePackages: ['@erp/ui', '@erp/shared-types']
};

export default nextConfig;
