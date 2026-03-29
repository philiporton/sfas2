import { Station, determineModel, calculateObservedText, calculateForcastText } from "@/app/lib/stations";

export default function StationInfoWindow({ station }: { station: Station }) {
    return (
        <div className="text-center px-2 py-1">
            <p className="fw-medium fs-5 text-[#A32638] mb-2">
                {station.title + " " + station.agency}
            </p>

            <p className="fw-bold fs-6">Current</p>
            <p className="fs-6 text-gray-700">
                {calculateObservedText(station)}
            </p>
            <p className="fs-6 text-gray-700">
                {station.observed_val} m ({determineModel(station)})
            </p>
            <p className="fs-6 text-gray-500 text-sm mb-3">
                {station.observed_dt}
            </p>

            <p className="fw-bold fs-6">Forecast</p>
            <p className="fs-6 text-gray-700 mb-4">
                {calculateForcastText(station)}
            </p>

            <a 
                href={`/stations?stationId=${station.did}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-4 py-1 bg-[#A32638] text-white font-bold rounded hover:bg-[#821e2d] transition-colors"
            >
                View Station
            </a>
        </div>
    );
}