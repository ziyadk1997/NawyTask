/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/apartments",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
