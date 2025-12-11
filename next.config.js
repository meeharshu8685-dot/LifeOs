/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    productionBrowserSourceMaps: false,
    swcMinify: true,
    poweredByHeader: false,
};

module.exports = nextConfig;
