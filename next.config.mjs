/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/zdjecia/**',
      },
    ],
  },
};

export default nextConfig;