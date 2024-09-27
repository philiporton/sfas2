import React from "react";

import { getCurrentEpoch, calculateForecastPeriod, timestampToString } from "./utils/date";

export default function App() {
    const timeAtRender = getCurrentEpoch();
    const [today, tomorrow] = calculateForecastPeriod(timeAtRender);

    return (
        <main>
            <div className="container px-4 py-5 text-center">
                <h1 className="display-3 fw-bold text-body-emphasis">
                    Stevens Flood Advisory System
                </h1>
                <p className="lead">Forecast Period: {timestampToString(today)} through {timestampToString(tomorrow)}</p>
            </div>
        </main>
    );
}
