"use client";

import { useEffect } from "react";
import { getAppInsights } from "../../lib/appInsights";

export default function AppInsightsLoader() {
  useEffect(() => {
    try {
      console.log(getAppInsights);
      getAppInsights;
    } catch (e) {
      console.error("Application Insights failed:", e);
    }
  }, []);

  return null;
}