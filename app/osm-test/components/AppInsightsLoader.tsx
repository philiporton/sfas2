"use client";

import { useEffect } from "react";
import { initializeAppInsights } from "../../lib/appInsight";

export default function AppInsightsLoader() {
    useEffect(() => {
        initializeAppInsights();
    }, []);

    return null;
}