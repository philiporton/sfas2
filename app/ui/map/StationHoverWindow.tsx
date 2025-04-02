import { type Station, calculateObservedText} from "@/app/lib/stations";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

export default function StationHoverWindow({ station }: { station: Station | null }) {
    if (station) {
        return (
            <AdvancedMarker
                position={{ lat: station.lat + 0.2, lng: station.lon }}
                clickable
                onClick={() => {
                    /* required to make the content of this div actually clickable for some reason */
                }}
            >
                <div className="infowindow text-center">
                    <p className="fw-medium fs-6">
                        {station.title + station.agency}
                    </p>
                    <p className="fw-medium fs-6">
                        Current: {calculateObservedText(station)}
                    </p>
                    <p className="fw-medium fs-6">
                        Forecast: TODO
                    </p>
                </div>
            </AdvancedMarker>
        );
    } else {
        return <></>;
    }
}