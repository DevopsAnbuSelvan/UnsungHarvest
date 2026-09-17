import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local IP images only needed in local/dev — avoid Vercel packaging quirks
    ...(process.env.VERCEL ? {} : { dangerouslyAllowLocalIP: true }),
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "http", hostname: "localhost", port: "3001" },
    ],
  },
};

export default nextConfig;
