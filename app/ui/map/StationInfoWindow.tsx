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
                position={{ lat: station.lat + 0.1, lng: station.lon }}
                anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
                clickable
                onClick={() => {
                    /* required to make the content of this div actually clickable for some reason */
                }}
            >
                <div className="infowindow text-center">
                    <p className="fw-medium fs-4">
                        {station.title + station.agency}
                    </p>
                    
                    <p className="fw-bold fs-5">Forecast</p>
                    <a href={`/stations?stationId=${station.did}`}>View Station</a>

                    <button onClick={onClose}>Close</button>
                    <div className="infowindow-chevron" />
                </div>
            </AdvancedMarker>
        );
    } else {
        return <></>;
    }
}
