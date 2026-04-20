import type { NextConfig } from "next"

const ASTRO_APP_URL = process.env.ASTRO_APP_URL ?? "http://localhost:4321"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/api/clients/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: ASTRO_APP_URL },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,PATCH,DELETE,OPTIONS"
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization"
          }
        ]
      }
    ]
  }
}

export default nextConfig
