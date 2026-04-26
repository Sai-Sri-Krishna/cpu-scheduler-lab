/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/cpu-scheduler-lab',
  assetPrefix: '/cpu-scheduler-lab',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
