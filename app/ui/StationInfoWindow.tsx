import { Station } from "@/app/lib/stations";

export default function StationInfoWindow({
    station
}: {
    station: Station | null;
}) {
    return station ? (
        <div>
            <h3>{station.title}</h3>
            <p>{station.did}</p>
            <a href={`/stations/${station.did}`}>View Station</a>
        </div>
    ) : (
        <div>
            <h3>Select a station to get started.</h3>
        </div>
    );
}
