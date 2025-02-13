import { useState, useCallback, useEffect } from "react";
import { Station } from "@/app/lib/stations";
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { calculateColor } from "@/app/lib/glyphColorCalculator";

export default function StationMarkerRegis({ station }: { station: Station }) {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [isShowingInfoWindow, setIsShowingInfoWindow] = useState(false);
    const [markerd, reloadMarker] = useState("mapglyph-selected");
    let warningLevel = calculateColor(station);
    const onStationClick = useCallback(() => {
       
        setIsShowingInfoWindow((isShowing) => !isShowing);
    }, []);

    useEffect(() => {
        reloadMarker(markerd === "mapglyph-unselected"? "mapglyph-selected" : "mapglyph-unselected");
    }, [isShowingInfoWindow]);

    useEffect(() => {
        console.log(markerd);

    }, [markerd]);

    const onStationClose = useCallback(() => {
        setIsShowingInfoWindow(false);
    }, []);

    return (
        <>
            <AdvancedMarker
                ref={markerRef}
                position={{ lat: station.lat, lng: station.lon }}
                title={station.title}
                key={station.title}
                onClick={onStationClick}
            >
                <div className={`${markerd} mapglyph-base`} id={station.did} />
            </AdvancedMarker>

            { isShowingInfoWindow && 
                <InfoWindow anchor={marker} onClose={onStationClose}>
                    <div>
                        <h3>{station.title}</h3>
                        <p>{station.did}</p>
                        <a href={`/stations/${station.did}`}>View Station</a>
                    </div>
                </InfoWindow>
            }
        </>
    );
}
