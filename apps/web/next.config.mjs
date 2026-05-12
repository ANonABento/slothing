import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const isCloudBuild = process.env.SLOTHING_CLOUD === '1';
const baseExtensions = ['tsx', 'ts', 'jsx', 'js'];
const cloudExtensions = ['cloud.tsx', 'cloud.ts'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  pageExtensions: isCloudBuild
    ? [...cloudExtensions, ...baseExtensions]
    : baseExtensions,
  async redirects() {
    return [
      {
        source: '/:locale/jobs',
        destination: '/:locale/opportunities',
        permanent: true,
      },
      {
        source: '/:locale/jobs/research/:id',
        destination: '/:locale/opportunities/:id/research',
        permanent: true,
      },
      {
        source: '/:locale/jobs/:id',
        destination: '/:locale/opportunities/:id',
        permanent: true,
      },
    ];
  },
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
