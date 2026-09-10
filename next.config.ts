import type {NextConfig} from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  ...(isGithubPages
    ? {
        output: 'export',
        basePath: basePath || undefined,
        assetPrefix: basePath ? `${basePath}/` : undefined,
      }
    : {}),
  transpilePackages: ['motion'],
};

export default nextConfig;
