import { Station } from "@/app/lib/stations";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { calculateColor } from "@/app/lib/glyphColorCalculator";

export default function StationMarker({ station }: { station: Station }) {
    const warningLevel = calculateColor(station);
    return (
        <AdvancedMarker
            position={{ lat: station.lat, lng: station.lon }}
            title={station.title}
            key={station.title}
        >
            <div className={`${warningLevel}mapglyph-base`} id={station.did} />
        </AdvancedMarker>
    );
}
