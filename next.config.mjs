/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

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
    ...(isDev
        ? {
            async rewrites() {
                const functionBase = "https://sfas-obs-b2fuf7ajagbzhkb4.canadacentral-01.azurewebsites.net";

                return [
                    {
                        source: "/api/station-details",
                        destination: `${functionBase}/api/station-details`
                    },
                    {
                        source: "/api/stations",
                        destination: `${functionBase}/api/stations`
                    },
                    {
                        source: "/api/station-data/:stationId/:startDate/:endDate",
                        destination: `${functionBase}/api/station-data/:stationId/:startDate/:endDate`
                    }
                ];
            }
        }
        : {})
};

//This will allow us to preventing sensitive data from being exposed to the client
//https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#preventing-sensitive-data-from-being-exposed-to-the-client

export default nextConfig;
