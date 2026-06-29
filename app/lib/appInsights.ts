import { ApplicationInsights } from "@microsoft/applicationinsights-web";

export const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING,
    enableAutoRouteTracking: true,
  },
});