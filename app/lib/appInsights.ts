import { ApplicationInsights } from "@microsoft/applicationinsights-web";

let appInsights: ApplicationInsights | null = null;

export function initializeAppInsights() {
    if (typeof window === "undefined") return;

    if (appInsights) return;

    const connectionString =
        process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING;

    if (!connectionString) {
        console.warn("Application Insights connection string is missing.");
        return;
    }

    console.log("Connection string:", connectionString);

    appInsights = new ApplicationInsights({
        config: {
            connectionString: connectionString,
            enableAutoRouteTracking: true,
        },
    });

    appInsights.loadAppInsights();
}

export function getAppInsights() {
    return appInsights;
}