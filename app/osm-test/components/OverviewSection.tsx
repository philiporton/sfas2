"use client";

import React, { useState } from "react";

export default function OverviewSection() {
  // Changed state name to reflect the modal behavior
  const [isModalOpen, setIsModalOpen] = useState(false);

  const overviewTextBody = [
    `The Stevens Flood Inundation Mapper (SFIM) displays flood depth estimates (blue shades) for three forecast options across coastal New Jersey, as well as observed and forecast water levels at several stations in comparison to water level thresholds for flooding or low-water events (see first color legend).  Each station is displayed as a square marker on the map.`,
    `The color of a square marker indicates the current water level, as observed by a measurement gauge.  If a location is currently lacking measurements, or if for any reason no observations have been received over the past two hours, that location's marker is white, indicating that only model forecasts are currently available.  Any blinking of the marker indicates future flooding or a blowout tide (extremely low water level) is predicted within the "forecast period" shown above the map.`,
    `If you click on the blue shading, an "info window" will appear that notes the peak water depth at that location over the forecast period. If you click on a square station marker, an info window will appear that notes the current observed water level and any forecast warnings (e.g. "normal" or "minor flood") for that station.`,
    `To display more detailed information for stations including time-dependent water levels, click on the 'Show Time Series Plot' in the station info window, or use the SFIM Stations drop down in the control panel to select a station.  The Stevens forecast for the selected location will be displayed first.  Where available, you may select to display a different forecast time series from other forecast systems, such as those from NOAA.`
  ];

  return (
    <div>
      <style>{`
        @media (max-width: 768px) {
          .overview-heading {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
          }
          .overview-text {
            font-size: 0.8rem;
            margin-bottom: 0.75rem;
          }
          .modal-heading {
            font-size: 1.25rem;
          }
          .overview-button {
            padding: 0.4rem 0.8rem;
            font-size: 0.85rem;
          }
        }
        @media (max-width: 480px) {
          .overview-heading {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
          }
          .overview-text {
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
          }
          .modal-box {
            padding: 0.75rem;
          }
          .overview-button {
            padding: 0.3rem 0.6rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
      <h2 className="overview-heading text-[#A32638] font-bold text-2xl mb-4">
        Stevens Flood Inundation Mapper Overview
      </h2>
      
      {/* Main page only shows the first paragraph */}
      <div className="overview-text text-gray-800 leading-relaxed text-sm mb-4">
        <p>{overviewTextBody[0]}</p>
      </div>
      
      <button 
        onClick={() => setIsModalOpen(true)}
        className="overview-button px-4 py-1 bg-white text-[#A32638] font-bold border border-[#A32638] rounded hover:bg-gray-50 transition-colors"
      >
        More
      </button>

      {/* The Popout (Modal) Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity">
          
          {/* The Popout Box */}
          <div className="modal-box bg-white rounded shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative p-4 md:p-8">
            
            {/* 'X' Close Button in top right */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#A32638] focus:outline-none"
              aria-label="Close popup"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="modal-heading text-[#A32638] font-bold text-2xl mb-3 md:mb-6 border-b pb-2">
              Overview Details
            </h2>
            
            {/* Full text inside the popout */}
            <div className="text-gray-800 leading-relaxed space-y-2 md:space-y-4">
              {overviewTextBody.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Bottom Close Button */}
            <div className="mt-6 md:mt-8 flex justify-end border-t pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="overview-button px-6 py-2 bg-white text-[#A32638] font-bold border border-[#A32638] rounded hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}