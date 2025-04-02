import { useState } from "react";
import { Station } from "@/app/lib/stations";
import { AdvancedMarker, AdvancedMarkerAnchorPoint } from "@vis.gl/react-google-maps";

export default function StationMarkerRegis({ station }: { station: Station }) {
    const [markerd, reloadMarker] = useState("mapglyph-selected");

    const onStationClick = () => {
        reloadMarker((curr) => 
            curr === "mapglyph-selected" ? "mapglyph-unselected" : "mapglyph-selected"
        );
    };

    return (
        <>
            <AdvancedMarker
                position={{ lat: station.lat, lng: station.lon }}
                anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                title={station.title}
                key={station.title}
                onClick={onStationClick}
            >
                <div className={`${markerd} mapglyph-base`} id={station.did} />
            </AdvancedMarker>
        </>
    );
}
