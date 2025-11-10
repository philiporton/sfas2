"use client";

import { useState, useEffect, useRef } from "react"
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Station } from "@/app/lib/stations";
import StationMarkerRegis from "@/app/ui/map/registration/StationMarkerRegis";
import useSFASStations from "@/app/hooks/useSFASStations";

export default function GoogleMapsReactRegis({
    mapsAPIKey
}: {
    mapsAPIKey: string
}) {

    //Below was added by me for geoJson data fetching - Samara Vassell
    const { state } = useSFASStations();
    const { stations, loading, error } = state;

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [stationMarkers, setStationMarkers] = useState<
        Array<React.JSX.Element>
    >([]);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

    const MARKER_REFRESH_TIMEOUT = 1000 * 60 * 5; // 1000ms/sec * 60sec/min * 5min
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

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const mapElement = mapContainerRef.current.querySelector("gmp-map") as any;
        if (!mapElement) return;

        const mapInstance: google.maps.Map = mapElement.innerMap;
        setMapInstance(mapInstance);


        // Load GeoJSON
        mapInstance.data.loadGeoJson("/data/flood_extent.geojson");

        // Style polygons
        mapInstance.data.setStyle({
        fillColor: "red",
        strokeColor: "darkred",
        strokeWeight: 2,
        fillOpacity: 0.3
        });
    }, [mapContainerRef.current]);




    return (
        <APIProvider apiKey={mapsAPIKey}>
            <div ref={mapContainerRef}>
                <Map
                mapId="32ff145d2770107c"
                style={{ maxWidth: "150vh", height: "50vh" }}
                defaultCenter={{ lat: 40.74449121740644, lng: -74.02479380346288 }}
                defaultZoom={6}
                gestureHandling="greedy"
                reuseMaps={true}
                mapTypeId="satellite"
                >
                {stationMarkers}
                </Map>
            </div>
        </APIProvider>
    );

    
    /*const { state } = useSFASStations();
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
    );*/

}
