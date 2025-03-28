import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Adaugă Google User Content
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
