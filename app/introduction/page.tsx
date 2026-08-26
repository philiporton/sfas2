"use client";

import { Suspense } from "react";

export default function About() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AboutComponent />
        </Suspense>
    );
}

function AboutComponent() {
    return (
        <main className="container mx-auto px-4 mt-8 mb-10 flex-1">
            <div className="items-center">
                
                    <h1 className="text-2xl font-bold text-[#A32638] mb-1">Overview & Control Panel Usage</h1>
                    <br></br>
                    <p className="text-[#A32638] text-sm">
                    The Stevens Flood Inundation Mapper (SFIM) displays forecast water levels and flood depths over the coming 4 days. It presents data on water levels and flood depths based on Stevens Institute's computational model-based forecasts. The Stevens model captures water levels and flooding due to storm surge, tides and river flows. The forecast data may underestimate flooding due to processes like local rainfall and wave runup that are not represented in the Stevens model.
                    </p>
                    <p className="text-[#A32638] text-sm">
                        Coastal flood depth estimates are shown on the map (blue shades) for three forecast options across coastal New Jersey - a most likely scenario, as well as high-end and low-end scenarios that capture the range of possible flooding that could occur.  This range represents a 90% confidence interval, meaning that about 5% of the time the flooding will be worse than the high-end scenario and about 5% of the time it will be milder than the low-end scenario.
                    </p>
                    <p className="text-[#A32638] text-sm">
                    SFIM also shows observed and forecast water levels at several locations displayed as small colored squares on the map. The color of the square markers indicates the <u>current</u> water level, as observed by water level measurement stations at these locations.  If a location lacks such an instrument, or if for any reason no observations have been received over the past two hours, that location's marker is white indicating that only model forecasts are currently available.  If flooding or a blowout tide (an unusually low water level) is predicted within the next 4 days, then the marker will <u>blink</u>.
                    </p>
                    <p className="text-[#A32638] text-sm">
                    If you click on one of the squares, an info window will appear which notes the current observed water level and any forecast warnings (e.g. “normal” or “minor flood”) for that station.  To display time-dependent predictions of water level over the coming four days, along with observed data when available, click on the 'View Station Data' in the info window, or use the Stations drop down in the control panel at right to select a station.
                    </p>
            </div>
        </main>
    )
}