import { AdvancedMarker, AdvancedMarkerAnchorPoint } from "@vis.gl/react-google-maps";
import { Station } from "@/app/lib/stations";

export default function StationInfoWindow({
    station
}: {
    station: Station | null;
}) {
    if (station) {
        return (
            <AdvancedMarker
                position={{ lat: station.lat, lng: station.lon }}
                anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
            >
                <div>
                    <p>Hello, world!</p>
                    <p>{station.title}</p>
                </div>
            </AdvancedMarker>
        );
    } else {
        return <></>;
    }
}
