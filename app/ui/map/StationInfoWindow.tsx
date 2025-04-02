import {
    AdvancedMarker
} from "@vis.gl/react-google-maps";
import { Station, determineModel } from "@/app/lib/stations";

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
                clickable
                onClick={() => {
                    /* required to make the content of this div actually clickable for some reason */
                }}
            >
                <div className="infowindow text-center">
                    <p className="fw-medium fs-5">
                        {station.title + station.agency}
                    </p>
                    
                    <p className="fw-bold fs-6">Current</p>    
                    <p className="fs-6">
                        {station.observed_val} m ({determineModel(station)})
                    </p>
                    <p className="fs-6">
                        {station.observed_dt}
                    </p>

                    <p className="fw-bold fs-6">Forecast</p>
                    <p className="fs-6">
                        TODO
                    </p>

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
