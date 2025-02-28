"use client";

import { useState, useEffect, useRef } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import stations from "@/stationData";
import { Station } from "@/app/lib/stations";
import {
    generateRandomObservedValue
} from "@/app/lib/glyphColorCalculator";
import StationMarkerRegis from "@/app/ui/StationMarkerRegis";

export default function GoogleMapsReactRegis({
    mapsAPIKey
}: {
    mapsAPIKey: string
}) {
    const MARKER_REFRESH_TIMEOUT = 1000 * 60 * 5; // 1000ms/sec * 60sec/min * 5min
    // const MARKER_REFRESH_TIMEOUT = 1000 * 10; // 1000ms/sec * 10sec

    const initialMarkers = stations.map((elem: Station) => {
        elem.observed_val = 10000; // TESTING ONLY
        return <StationMarkerRegis key={elem.did} station={elem} />;
    });
    const [stationMarkers, setStationMarkers] = useState<Array<React.JSX.Element>>(initialMarkers);

    // blink markers with no observed data
    useEffect(() => {
        const intervalId = setInterval(() => {
            stations.filter((elem: Station) => elem.observed_found === 0) 
                .forEach((elem: Station) => {
                    if (document.getElementById(elem.did)?.classList.contains("mapglyph-blink")) {
                        document.getElementById(elem.did)!.classList.remove("mapglyph-blink");
                    } else {
                        document.getElementById(elem.did)!.classList.add("mapglyph-blink");
                    }
                });
        }, 700);

        return () => clearInterval(intervalId);
    }, [stationMarkers]);



    /*const refreshMarkers = () => {
        const newMarkers = stations.map((elem: Station) => {
            elem.observed_val = generateRandomObservedValue(elem); // TESTING ONLY
            return <StationMarkerRegis key={elem.did} station={elem} />;
        });
        setStationMarkers(newMarkers);
        console.log("Initiating timer reset!");
    };*/



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

        </APIProvider>
    );
}
