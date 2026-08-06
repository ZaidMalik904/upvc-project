import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.142'],
  serverExternalPackages: ['pdfkit']
};

export default nextConfig;
