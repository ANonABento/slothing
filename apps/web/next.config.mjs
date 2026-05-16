import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const bentoRouterDistSrc = fileURLToPath(
  new URL('./node_modules/@anonabento/bento-router/dist/src/', import.meta.url),
);

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
    serverComponentsExternalPackages: [
      '@anonabento/bento-router',
      'better-sqlite3',
    ],
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
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@anonabento/bento-router/admin/BentoRouterAdminPage': path.join(
        bentoRouterDistSrc,
        'admin/BentoRouterAdminPage.js',
      ),
      '@anonabento/bento-router/admin/BentoRouterUsageTable': path.join(
        bentoRouterDistSrc,
        'admin/BentoRouterUsageTable.js',
      ),
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
