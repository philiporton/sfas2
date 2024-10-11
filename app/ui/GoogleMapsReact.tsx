"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function GoogleMapsReact({
    mapsAPIKey
}: {
    mapsAPIKey: string;
}) {
    console.log(`key = ${mapsAPIKey}`);
    return (
        <APIProvider
            apiKey={mapsAPIKey}
            onLoad={() => console.log("React map loaded!")}
        >
            <Map
                style={{ width: "50vw", height: "50vh" }}
                defaultCenter={{ lat: 22.54992, lng: 0 }}
                defaultZoom={3}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
            />
        </APIProvider>
    );
}
