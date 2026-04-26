/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/cpu-scheduler-lab',
  assetPrefix: '/cpu-scheduler-lab', 
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
