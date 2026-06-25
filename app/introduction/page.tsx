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
                
                    <h2 className="text-2xl font-bold text-[#A32638] mb-1">Overview & Control Panel Usage</h2>
                    <br></br>
                
                    <p className="text-[#A32638] text-sm">
                    The Stevens Flood Inundation Mapper (SFIM) displays predicted water levels and flood depths over the coming 4 days from the Stevens Flood Advisory System. Flood depth estimates are shown on the map (blue shades) for three forecast options across coastal New Jersey - a most likely scenario, as well as worst-case and best-case scenarios that capture the range of possible flooding that could occur.  
                    </p>
                
                
                    <p className="text-[#A32638] text-sm">
                    SFIM also shows observed and forecast water levels at several locations displayed as small colored squares on the map. The color of the square markers indicates the current water level, as observed by water level measurement stations at these locations.  If a location lacks such an instrument, or if for any reason no observations have been received over the past two hours, that location's marker is white indicating that only model forecasts are currently available.  If flooding or a blowout tide (an unusually low water level) is predicted within the next 4 days, then the marker will blink.
                    </p>
                
                
                    <p className="text-[#A32638] text-sm">
                    If you click on a location marker, an info window will appear which notes the current observed water level and any forecast warnings (e.g. “normal” or “minor flood”) for that station.  To display time-dependent predictions of water level over the coming four days, along with observed data when available, click on the 'View Station Data' in the info window, or use the Stations drop down in the control panel at right to select a station.
                    </p>
                
                
                    <p className="text-[#A32638] text-sm">
                    The mapper reports a (near) “worst-case” and (near) “best-case” scenario. In actuality, the range of forecast water levels and flood depths represents a 90% confidence interval, meaning that about 5% of the time the flooding will be worse than the worst-case scenario and about 5% of the time it will be milder than the best-case scenario.
                    </p>
                
            </div>
        </main>
    )
}