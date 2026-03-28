module.exports = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: {
      target: "18",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.tasteofhome.com",
      },
      {
        protocol: "https",
        hostname: "beyondfrosting.com",
      },
      {
        protocol: "https",
        hostname: "therecipecritic.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};
