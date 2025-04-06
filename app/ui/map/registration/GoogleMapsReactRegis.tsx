"use client";

import { useState, useEffect } from "react"
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Station } from "@/app/lib/stations";
import StationMarkerRegis from "@/app/ui/map/registration/StationMarkerRegis";
import useSFASStations from "@/app/hooks/useSFASStations";

export default function GoogleMapsReactRegis({
    mapsAPIKey
}: {
    mapsAPIKey: string
}) {
    const { state } = useSFASStations();
    const { stations, loading, error } = state;

    const [stationMarkers, setStationMarkers] = useState<
        Array<React.JSX.Element>
    >([]);

    useEffect(() => {
        if (stations && !loading && error === null) {
            setStationMarkers(
                stations.map((elem: Station) => (
                    <StationMarkerRegis
                        key={elem.did}
                        station={elem}
                    />
                ))
            );
        }
    }, [loading, error, stations]);

    return (
        <APIProvider
            apiKey={mapsAPIKey}
            onLoad={() => {
                console.log("React map loaded!");
            }}
        >
            <Map
                mapId="32ff145d2770107c"
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
