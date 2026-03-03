/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'd8it4huxumps7.cloudfront.net',
      'images.unsplash.com',
      'cdn.filepicker.io',
    ],
  },
};

export default nextConfig;