import { Station } from "@/app/lib/stations";
import { AdvancedMarker, AdvancedMarkerAnchorPoint } from "@vis.gl/react-google-maps";

export default function StationHoverWindow({ station }: { station: Station | null }) {
    if (station) {
        return (
            <AdvancedMarker
                position={{ lat: station.lat, lng: station.lon }}
                anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
                clickable
                onClick={() => {
                    /* required to make the content of this div actually clickable for some reason */
                }}
            >
                <div className="infowindow text-center">
                    <p className="fw-medium fs-4">
                        Hello!
                        {station.title + station.agency}
                    </p>
                </div>
            </AdvancedMarker>
        );
    } else {
        return <></>;
    }
}