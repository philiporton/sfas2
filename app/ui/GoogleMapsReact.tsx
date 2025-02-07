"use client";

import { useState, useEffect, useRef } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import stations from "@/stationData";
import { Station } from "@/app/lib/stations";
import {
    generateRandomObservedValue
} from "@/app/lib/glyphColorCalculator";
import StationMarker from "@/app/ui/StationMarker";

export default function GoogleMapsReact({
    mapsAPIKey
}: {
    mapsAPIKey: string
}) {
    const MARKER_REFRESH_TIMEOUT = 1000 * 60 * 5; // 1000ms/sec * 60sec/min * 5min
    // const MARKER_REFRESH_TIMEOUT = 1000 * 10; // 1000ms/sec * 10sec

    const initialMarkers = stations.map((elem: Station) => {
        elem.observed_val = generateRandomObservedValue(elem); // TESTING ONLY
        return <StationMarker key={elem.did} station={elem} />;
    });
    const [stationMarkers, setStationMarkers] = useState<Array<React.JSX.Element>>(initialMarkers);

    const [startTime, setStartTime] = useState(Date.now()); // time in ms since last refresh
    const [currTime, setCurrTime] = useState(Date.now());
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // blink markers with no observed data
    useEffect(() => {
        const intervalId = setInterval(() => {
            stations.filter((elem: Station) => elem.observed_found === 0) 
                .forEach((elem: Station) => {
                    const elemNode = document.getElementById(elem.did);
                    if (elemNode) {
                        if (elemNode.classList.contains("mapglyph-blink")) {
                            elemNode.classList.remove("mapglyph-blink");
                        } else {
                            elemNode.classList.add("mapglyph-blink");
                        }
                    }
                });
        }, 700);

        return () => clearInterval(intervalId);
    }, [stationMarkers]);



    const refreshMarkers = () => {
        const newMarkers = stations.map((elem: Station) => {
            elem.observed_val = generateRandomObservedValue(elem); // TESTING ONLY
            return <StationMarker key={elem.did} station={elem} />;
        });
        setStationMarkers(newMarkers);
        console.log("Initiating timer reset!");
        resetTimer();
    };

    /**
     * timer function which will initialize on map load, and update a timer every 10ms
     */
    const resetTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        const start = Date.now(); // to be captured by the closure in setInterval
        setStartTime(start); // to be used by the UI (async updates, so we need a separate value)
        console.log("Timer cleared & start time set.")

        const intervalId = setInterval(() => {
            const curr = Date.now();
            setCurrTime(curr); // same as above, for UI updates
            const elapsed = curr - start;
            console.log(`Elapsed time: ${elapsed}`);
            if (elapsed >= MARKER_REFRESH_TIMEOUT) { // refresh markers once elapsed time >= marker timeout 
                refreshMarkers();
            }
        }, 10);

        timerRef.current = intervalId;
    };


    return (
        <APIProvider
            apiKey={mapsAPIKey}
            onLoad={() => {
                console.log("React map loaded! Starting marker refresh timer");
                // resetTimer();
            }}
        >
            <Map
                mapId="3e89d0a2025a0ab1"
                style={{ maxWidth: "150vh", height: "50vh" }}
                defaultCenter={{
                    lat: 40.74449121740644,
                    lng: -74.02479380346288
                }}
                defaultZoom={6}
                gestureHandling={"greedy"}
                reuseMaps={true}
                mapTypeId={"satellite"}
            >
                {stationMarkers}
            </Map>
            <div>
                <p>Stations will refresh in: <strong>{(MARKER_REFRESH_TIMEOUT - (currTime - startTime)) / 1000}</strong></p>
            </div>
        </APIProvider>
    );
}
