import { Station } from "@/app/lib/stations";
import { AdvancedMarker, AdvancedMarkerAnchorPoint } from "@vis.gl/react-google-maps";
import { calculateColor } from "@/app/lib/glyphColorCalculator";

export default function StationMarker({
    station,
    onClick
}: {
    station: Station;
    onClick: () => void;
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
            >
                <div
                    className={`${warningLevel}mapglyph-base`}
                    id={station.did}
                />
            </AdvancedMarker>
        </>
    );
}
