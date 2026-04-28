import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Station, calculateColor } from "@/app/lib/stations";
import StationInfoWindow from "./StationInfoWindow";

export default function StationMarker({
    station,
    onClick,
    onHover,
    onUnhover
}: {
    station: Station;
    onClick?: () => void;
    onHover?: () => void;
    onUnhover?: () => void;
}) {
    const warningLevel = calculateColor(station);

    // Create the custom HTML marker using Leaflet's divIcon
    const customIcon = useMemo(() => {
        return L.divIcon({
            // Setting className to empty string removes Leaflet's default white square styling
            className: "", 
            html: `<div class="${warningLevel}mapglyph-base" id="${station.did}"></div>`,
            iconSize: [24, 24], // Adjust these numbers to match the width/height of your CSS class
            iconAnchor: [12, 12], // Centers the icon perfectly on the coordinate
        });
    }, [warningLevel, station.did]);

    return (
        <Marker 
            position={[station.lat, station.lon]} 
            icon={customIcon}
            eventHandlers={{
                click: () => onClick && onClick(),
                mouseover: () => onHover && onHover(),
                mouseout: () => onUnhover && onUnhover()
            }}
        >
            {/* The Popup automatically shows on click and handles its own close button */}
            <Popup offset={[0, -15]}>
                <StationInfoWindow station={station} />
            </Popup>
        </Marker>
    );
}