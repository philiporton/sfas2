"use client";

import { useEffect } from "react";
import { initializeAppInsights } from "../../lib/appInsights";

export default function AppInsightsLoader() {
    useEffect(() => {
        initializeAppInsights();
    }, []);

    return null;
}