"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import stations from "@/stationData";

export default function GoogleMapsReact({
    mapsAPIKey
}: {
    mapsAPIKey: string;
}) {
    const stationMarkers = stations.map((elem) => (
        <AdvancedMarker
            position={{ lat: elem.lat, lng: elem.lon }}
            title={elem.title}
        />
    ));

    return (
        <APIProvider
            apiKey={mapsAPIKey}
            onLoad={() => console.log("React map loaded!")}
        >
            <Map
                mapId="3e89d0a2025a0ab1"
                style={{ width: "50vw", height: "50vh" }}
                defaultCenter={{
                    lat: 40.74449121740644,
                    lng: -74.02479380346288
                }}
                defaultZoom={3}
                gestureHandling={"greedy"}
                reuseMaps={true}
                mapTypeId={"satellite"}
            >
                {stationMarkers}
            </Map>
        </APIProvider>
    );
}
