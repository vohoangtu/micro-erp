const BI_URL = process.env.BI_ZONE_URL ?? 'http://localhost:3006';
const CRM_URL = process.env.CRM_ZONE_URL ?? 'http://localhost:3002';
const BOOKING_URL = process.env.BOOKING_ZONE_URL ?? 'http://localhost:3003';
const POS_URL = process.env.POS_ZONE_URL ?? 'http://localhost:3004';
const HR_URL = process.env.HR_ZONE_URL ?? 'http://localhost:3005';
const AI_URL = process.env.AI_ZONE_URL ?? 'http://localhost:3007';
const SYSTEM_URL = process.env.SYSTEM_ZONE_URL ?? 'http://localhost:3008';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@erp/ui', '@erp/shared-types'],
  async rewrites() {
    return [
      { source: '/bi', destination: `${BI_URL}/bi` },
      { source: '/bi/:path*', destination: `${BI_URL}/bi/:path*` },
      { source: '/crm', destination: `${CRM_URL}/crm` },
      { source: '/crm/:path*', destination: `${CRM_URL}/crm/:path*` },
      { source: '/booking', destination: `${BOOKING_URL}/booking` },
      { source: '/booking/:path*', destination: `${BOOKING_URL}/booking/:path*` },
      { source: '/pos', destination: `${POS_URL}/pos` },
      { source: '/pos/:path*', destination: `${POS_URL}/pos/:path*` },
      { source: '/hr', destination: `${HR_URL}/hr` },
      { source: '/hr/:path*', destination: `${HR_URL}/hr/:path*` },
      { source: '/ai', destination: `${AI_URL}/ai` },
      { source: '/ai/:path*', destination: `${AI_URL}/ai/:path*` },
      { source: '/system', destination: `${SYSTEM_URL}/system` },
      { source: '/system/:path*', destination: `${SYSTEM_URL}/system/:path*` }
    ];
  }
};

export default nextConfig;
