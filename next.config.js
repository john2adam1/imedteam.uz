/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'dev.axadjonovsardorbek.uz',
      'prod.axadjonovsardorbek.uz',
      'minio.axadjonovsardorbek.uz',
      'prod.imedteam.uz',
      'via.placeholder.com'
    ],
  },
}

module.exports = nextConfig

