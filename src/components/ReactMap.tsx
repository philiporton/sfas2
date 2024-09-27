import React from "react";
import { APIProvider, Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";

export default function ReactMap() {
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "";

    return (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} onLoad={() => console.log("Maps API loaded.")}>
            <Map defaultZoom={13} defaultCenter={{lat: -33.860664, lng: 151.208138}} onCameraChanged={(ev: MapCameraChangedEvent) => console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)} />
        </APIProvider>
    );
}