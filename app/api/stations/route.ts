/**
 * API route to proxy the station data from hudson.dl.stevens-tech.edu
 * This avoids CORS issues and eliminates the need for a separate CGI server
 */

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const response = await fetch(
            "https://hudson.dl.stevens-tech.edu/sfas/sfas_stations2.js",
            {
                headers: {
                    "User-Agent": "SFAS2-Client"
                }
            }
        );

        if (!response.ok) {
            return Response.json(
                { error: `Failed to fetch stations: ${response.status} ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.text();
        return new Response(data, {
            headers: {
                "Content-Type": "application/javascript",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        return Response.json(
            { error: `Failed to fetch stations: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}
