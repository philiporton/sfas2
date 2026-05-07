
/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";
const apiBase = (
    process.env.SFIM_URL
).replace(/\/$/, "");

const nextConfig = {
    reactStrictMode: false,
    experimental: {
        taint: true
    },
    ...(isDev ? {} : { output: "export" }), // static build outside local dev
    distDir: "dist",
    images: {
        unoptimized: true
    },
    skipTrailingSlashRedirect: true,
    trailingSlash: true,
    ...(isDev ? {
            async rewrites() {
                return [
                    {
                        source: "/api/station-details",
                        destination: `${apiBase}/api/station-details`
                    },
                    {
                        source: "/api/station-list",
                        destination: `${apiBase}/api/station-list`
                    },
                    {
                        source: "/api/station-data/:stationId/:startDate/:endDate",
                        destination: `${apiBase}/api/station-data/:stationId/:startDate/:endDate`
                    },
                    {
                        source: "/api/flood-map/:level",
                        destination: `${apiBase}/api/flood-map/:level`
                    }
                ];
            }
        } : {})
};

//This will allow us to preventing sensitive data from being exposed to the client
//https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#preventing-sensitive-data-from-being-exposed-to-the-client

export default nextConfig;