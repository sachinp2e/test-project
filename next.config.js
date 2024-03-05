/** @type {import('next').NextConfig} */
const nextConfig = {
  compilerOptions: {
    baseUrl: '.',
  },
  images: {
    domains: [
      'dev-p2enft-images.s3.ap-south-1.amazonaws.com',
      'dev-p2enft-images-resized.s3.ap-south-1.amazonaws.com',
      'dev-nftm-images.s3.ap-south-1.amazonaws.com',
      'dev-nftm-images-resized.s3.ap-south-1.amazonaws.com',
      'stg-p2enft-images.s3.ap-south-1.amazonaws.com',
      'picsum.photos',
      'qa-nftm-images-resized.s3.ap-south-1.amazonaws.com',
      'qa-nftm-images.s3.ap-south-1.amazonaws.com',
    ],
    // deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
