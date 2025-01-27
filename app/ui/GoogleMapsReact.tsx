"use client";

import { useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import stations from "@/stationData";
import { Station } from "@/app/lib/stations";
import {
    calculateColor,
    generateRandomObservedValue
} from "@/app/lib/glyphColorCalculator";
import StationMarker from "@/app/ui/StationMarker";

export default function GoogleMapsReact({
    mapsAPIKey
}: {
    mapsAPIKey: string;
}) {
    const stationMarkers = stations.map((elem: Station) => {
        elem.observed_val = generateRandomObservedValue(elem); // TESTING ONLY
        return <StationMarker key={elem.did} station={elem} />;
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            stations.filter((elem: Station) => elem.observed_found === 0) // blink markers with no observed data
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

    return (
        <APIProvider
            apiKey={mapsAPIKey}
            onLoad={() => console.log("React map loaded!")}
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
