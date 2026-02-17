/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['dev.axadjonovsardorbek.uz', 'prod.axadjonovsardorbek.uz', 'minio.axadjonovsardorbek.uz'],
  },
}

module.exports = nextConfig

