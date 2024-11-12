"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import stations from "@/stationData";
import {
    calculateColor,
    generateRandomObservedValue
} from "../lib/glyphColorCalculator";

export default function GoogleMapsReact({
    mapsAPIKey
}: {
    mapsAPIKey: string;
}) {
    const stationMarkers = stations.map((elem) => {
        elem.observed_val = generateRandomObservedValue(elem); // TESTING ONLY
        const warningLevel = calculateColor(elem);

        return (
            <AdvancedMarker
                position={{ lat: elem.lat, lng: elem.lon }}
                title={elem.title}
                key={elem.title}
            >
                <div className={`${warningLevel}mapglyph-base`} />
            </AdvancedMarker>
        );
    });

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
