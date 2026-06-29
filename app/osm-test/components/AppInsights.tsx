"use client";

import { useEffect } from "react";
import { appInsights } from "../../lib/appInsights";

export default function AppInsightsLoader() {
  useEffect(() => {
    appInsights.loadAppInsights();
  }, []);

  return null;
}