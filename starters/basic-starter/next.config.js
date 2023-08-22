module.exports = {
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN ?? ''],
  },
  env: {
    imagePath: '/_next/image',
  },
};
