"use client";

import { useState, useEffect } from "react"
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { Station } from "@/app/lib/stations";
import StationMarkerRegis from "@/app/ui/map/registration/StationMarkerRegis";
import useSFASStations from "@/app/hooks/useSFASStations";

function GeoJsonLayer() {
  const map = useMap(); // grabs the map instance from context
  console.log("Map instance in GeoJsonLayer:", map);

  useEffect(() => {
    if (!map) return;

    // Load GeoJSON
    map.data.loadGeoJson("/data/flood_extent.geojson");

    // Style polygons
    map.data.setStyle({
      fillColor: "red",
      strokeColor: "darkred",
      strokeWeight: 2,
      fillOpacity: 0.3,
    });
  }, [map]);

  return null; // This component just adds the layer, no visual element itself
}

export default function GoogleMapsReactRegis({
    mapsAPIKey
}: {
    mapsAPIKey: string
}) {

    //Below was added by me for geoJson data fetching - Samara Vassell
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
                <GeoJsonLayer />
                {stationMarkers}
            </Map>

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
