import { Station } from "@/app/lib/stations";
import { AdvancedMarker, AdvancedMarkerAnchorPoint } from "@vis.gl/react-google-maps";
import { calculateColor } from "@/app/lib/glyphColorCalculator";

export default function StationMarker({
    station,
    onClick,
    onHover,
    onUnhover
}: {
    station: Station;
    onClick: () => void;
    onHover: () => void;
    onUnhover: () => void;
}) {
    const warningLevel = calculateColor(station);

    return (
        <>
            <AdvancedMarker
                position={{ lat: station.lat, lng: station.lon }}
                anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                title={station.title}
                key={station.title}
                onClick={onClick}
                onMouseEnter={onHover}
                onMouseLeave={onUnhover}
            >
                <div
                    className={`${warningLevel}mapglyph-base`}
                    id={station.did}
                />
            </AdvancedMarker>
        </>
    );
}
