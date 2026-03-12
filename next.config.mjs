/** @type {import('next').NextConfig} */

// On Vercel: VERCEL=1 is set automatically → no basePath needed (app is at root domain)
// On dev server: NEXT_PUBLIC_BASE_PATH=/miniapp → nginx proxies /miniapp → port 3002
const basePath = process.env.VERCEL ? '' : (process.env.NEXT_PUBLIC_BASE_PATH || '');

const nextConfig = {
  basePath,
  // Override NEXT_PUBLIC_BASE_PATH baked into client code so image paths are correct
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
