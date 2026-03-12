/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev server (nginx): NEXT_PUBLIC_BASE_PATH=/miniapp
  // Vercel: NEXT_PUBLIC_BASE_PATH not set → no basePath
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

export default nextConfig;
