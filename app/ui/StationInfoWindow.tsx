import {
    AdvancedMarker,
    AdvancedMarkerAnchorPoint
} from "@vis.gl/react-google-maps";
import { Station } from "@/app/lib/stations";

export default function StationInfoWindow({
    station,
    onClose
}: {
    station: Station | null;
    onClose: () => void;
}) {
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
                <div className="infowindow">
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                        {station.title}
                    </p>
                    <a href={`/stations/${station.did}`}>View Station</a>
                    <button onClick={onClose}>Close</button>
                    <div className="infowindow-chevron" />
                </div>
            </AdvancedMarker>
        );
    } else {
        return <></>;
    }
}
