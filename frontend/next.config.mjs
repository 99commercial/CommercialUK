/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nextScriptWorkers: false,
    serverActions: true,
    // 🚀 This disables Next.js DevTools (removes the circle)
    turbo: {
      devTools: false,
    },
  },
};

export default nextConfig;
