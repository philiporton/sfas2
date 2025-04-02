"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Station } from "@/app/lib/stations";
import StationMarkerRegis from "@/app/ui/StationMarkerRegis";

export default function GoogleMapsReactRegis({
    mapsAPIKey
}: {
    mapsAPIKey: string
}) {
    const initialMarkers: Array<JSX.Element> = []
    // stations.map((elem: Station) => {
    //     elem.observed_val = 10000; // TESTING ONLY
    //     return <StationMarkerRegis key={elem.did} station={elem} />;
    // });

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
                {initialMarkers}
            </Map>

        </APIProvider>
    );
}
