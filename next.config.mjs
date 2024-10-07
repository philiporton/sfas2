/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        taint: true
    }
};

//This will allow us to preventing sensitive data from being exposed to the client
//https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#preventing-sensitive-data-from-being-exposed-to-the-client

export default nextConfig;
