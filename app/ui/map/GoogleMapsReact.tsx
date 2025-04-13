"use client";

import { useState, useEffect, useRef } from "react";
import { APIProvider, Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { type Station, calculateForcastText, calculateObservedText, isFloodingPredicted } from "@/app/lib/stations";
import StationMarker from "@/app/ui/map/StationMarker";
import StationInfoWindow from "@/app/ui/map/StationInfoWindow";
import StationHoverWindow from "@/app/ui/map/StationHoverWindow";
import useSFASStations from "@/app/hooks/useSFASStations";
import { timeDeltaToMinutesSeconds } from "@/app/lib/date";

export default function GoogleMapsReact({
    mapsAPIKey
}: {
    mapsAPIKey: string;
}) {
    const MARKER_REFRESH_TIMEOUT = 1000 * 60 * 5; // 1000ms/sec * 60sec/min * 5min
    // const MARKER_REFRESH_TIMEOUT = 1000 * 10; // 1000ms/sec * 10sec

    const [mapCenter, setMapCenter] = useState({
        lat: 40.74449121740644,
        lng: -74.02479380346288
    });

    const [selectedMarker, setSelectedMarker] = useState<Station | null>(null);
    const onMarkerClick = (station: Station) => {
        setSelectedMarker(station);
        setMapCenter({ lat: station.lat, lng: station.lon });
    };
    const onMarkerDismiss = () => setSelectedMarker(null);

    const [hoveredMarker, setHoveredMarker] = useState<Station | null>(null);
    const onMarkerHover = (station: Station) => setHoveredMarker(station);
    const onMarkerUnhover = () => setHoveredMarker(null);

    const { state, triggerStationRefresh } = useSFASStations();
    const { stations, loading, error } = state;

    const [stationMarkers, setStationMarkers] = useState<
        Array<React.JSX.Element>
    >([]);

    useEffect(() => {
        if (stations && !loading && error === null) {
            setStationMarkers(
                stations.map((elem: Station) => (
                    <StationMarker
                        key={elem.did}
                        station={elem}
                        onClick={() => onMarkerClick(elem)}
                        onHover={() => onMarkerHover(elem)}
                        onUnhover={onMarkerUnhover}
                    />
                ))
            );

            // blinking markers for which the model predicts flooding
            const intervalId = setInterval(() => {
                stations
                    .filter((elem: Station) => isFloodingPredicted(elem)) // only get stations with flooding predicted
                    .forEach((elem: Station) => {
                        const elemNode = document.getElementById(elem.did); // get the marker element
                        if (elemNode) {
                            if (elemNode.classList.contains("mapglyph-blink")) { // alternate between blinking and not-blinking
                                elemNode.classList.remove("mapglyph-blink");
                            } else {
                                elemNode.classList.add("mapglyph-blink");
                            }
                        }
                    });
            }, 1000);

            // return cleanup function to clear intervals
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [loading, error, stations]); // on change of loading and on initial render

    const [startTime, setStartTime] = useState(Date.now()); // time in ms since last refresh
    const [currTime, setCurrTime] = useState(Date.now());
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * timer function which will initialize on map load, and update a timer every 10ms
     */
    const resetTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        const start = Date.now(); // to be captured by the closure in setInterval
        setStartTime(start); // to be used by the UI (async updates, so we need a separate value)
        console.log("Timer cleared & start time set.");

        const intervalId = setInterval(() => {
            const curr = Date.now();
            setCurrTime(curr); // same as above, for UI updates
            const elapsed = curr - start;
            // console.log(`Elapsed time: ${elapsed}`);
            if (elapsed >= MARKER_REFRESH_TIMEOUT) {
                // refresh markers once elapsed time >= marker timeout
                triggerStationRefresh();
                resetTimer();
            }
        }, 10);

        timerRef.current = intervalId;
    };

    return (
        <APIProvider
            apiKey={mapsAPIKey}
            onLoad={() => {
                console.log("React map loaded! Starting marker refresh timer");
                resetTimer();
            }}
        >
            <Map
                mapId="3e89d0a2025a0ab1"
                style={{ maxWidth: "100vh", height: "100vh" }}
                defaultCenter={{
                    lat: 40.74449121740644,
                    lng: -74.02479380346288
                }}
                center={mapCenter}
                cameraControl={false}
                streetViewControl={false}
                onCameraChanged={(e: MapCameraChangedEvent) => setMapCenter(e.detail.center)}
                gestureHandling={"greedy"}
                reuseMaps={true}
                mapTypeId={"satellite"}
                isFractionalZoomEnabled={true}
                defaultZoom={7}
                minZoom={5}
                onClick={onMarkerDismiss}
            >
                {stationMarkers}
                <StationInfoWindow
                    station={selectedMarker}
                    onClose={onMarkerDismiss}
                />
                <StationHoverWindow
                    station={hoveredMarker}
                />
            </Map>
            <div>
                <p>
                    Stations will refresh in:{" "}
                    <strong>
                        {timeDeltaToMinutesSeconds(MARKER_REFRESH_TIMEOUT - (currTime - startTime))}
                    </strong>
                </p>
            </div>
        </APIProvider>
    );
}
