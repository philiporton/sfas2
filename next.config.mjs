
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        taint: true
    },
    output: "export", // static build outside local dev
    distDir: "dist",
    images: {
        unoptimized: true
    },
    skipTrailingSlashRedirect: true,
    trailingSlash: true,
};

//This will allow us to preventing sensitive data from being exposed to the client
//https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#preventing-sensitive-data-from-being-exposed-to-the-client

export default nextConfig;