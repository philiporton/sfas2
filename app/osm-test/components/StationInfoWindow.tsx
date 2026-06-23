import { Station, determineModel, calculateObservedText, calculateForcastText } from "@/app/lib/stations";

export default function StationInfoWindow({ station }: { station: Station }) {
    return (
        <>
            {/* OVERRIDE LEAFLET'S DEFAULT BULKY CSS ON MOBILE */}
            <style>{`
                /* Target all mobile screens up to tablets */
                @media (max-width: 768px) {
                    /* Strip padding from the outer bubble wrapper */
                    .leaflet-popup-content-wrapper {
                        padding: 0 !important;
                        border-radius: 6px !important;
                    }
                    /* Tightly pack the inner content */
                    .leaflet-popup-content {
                        margin: 6px 8px !important;
                        width: 170px !important; /* Forces the bubble to be very narrow */
                        line-height: 1.1 !important;
                    }
                    /* Remove all default paragraph margins Leaflet injects */
                    .leaflet-popup-content p {
                        margin: 0 0 2px 0 !important; 
                    }
                    /* Shrink the close button */
                    .leaflet-popup-close-button {
                        width: 12px !important;
                        height: 12px !important;
                        top: 2px !important;
                        right: 2px !important;
                    }
                }
            `}</style>

            {/* Container: Tiny padding on mobile, normal padding on desktop (md:) */}
            <div className="text-center px-1 py-1 md:px-2 md:py-2">
                
                {/* Title */}
                <p className="font-bold text-[#A32638] text-[12px] md:text-lg leading-tight mb-1 md:mb-2">
                    {station.title} {station.agency}
                </p>

                {/* Current Section */}
                <p className="font-bold text-[10px] md:text-base mb-0">Current</p>
                <p className="text-gray-700 text-[10px] md:text-sm mb-0">
                    {calculateObservedText(station)}
                </p>
                <p className="text-gray-700 text-[10px] md:text-sm mb-0">
                    {(station.observed_val * 3.28084).toFixed(1)} feet ({determineModel(station)})
                </p>
                <p className="text-gray-500 text-[9px] md:text-xs mb-2 md:mb-3">
                    {station.observed_dt}
                </p>

                {/* Forecast Section */}
                <p className="font-bold text-[10px] md:text-base mb-0">Forecast</p>
                <p className="text-gray-700 text-[10px] md:text-sm mb-2 md:mb-4">
                    {calculateForcastText(station)}
                </p>

                {/* Button */}
                <a 
                    href={`/stations?stationId=${station.did}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block px-2 py-1 md:px-4 md:py-1.5 bg-[#A32638] text-white font-bold rounded hover:bg-[#821e2d] transition-colors text-[10px] md:text-sm"
                >
                    View Station Data
                </a>
            </div>
        </>
    );
}