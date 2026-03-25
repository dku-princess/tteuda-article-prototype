/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "13.125.122.193",
        port: "8055",
        pathname: "/assets/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/directus-assets/:path*",
        destination: "http://13.125.122.193:8055/assets/:path*",
      },
    ];
  },
};

export default nextConfig;

