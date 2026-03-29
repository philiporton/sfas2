import { type Station, calculateObservedText, calculateForcastText } from "@/app/lib/stations";

export default function StationHoverWindow({ station }: { station: Station }) {
    return (
        <div className="text-center p-1">
            <p className="font-bold text-sm mb-1">
                {station.title + " " + station.agency}
            </p>
            <p className="text-sm">
                <strong>Current:</strong> {calculateObservedText(station)}
            </p>
            <p className="text-sm">
                <strong>Forecast:</strong> {calculateForcastText(station)}
            </p>
        </div>
    );
}