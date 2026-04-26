/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath:'/cpu-schedular-lab',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
