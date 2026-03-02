/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nextScriptWorkers: false,
  },
    typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
