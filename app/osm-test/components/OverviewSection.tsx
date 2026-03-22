"use client";

import React, { useState } from "react";

export default function OverviewSection() {
  // Changed state name to reflect the modal behavior
  const [isModalOpen, setIsModalOpen] = useState(false);

  const overviewTextBody = [
    `The Stevens Flood Inundation Mapper (SFIM) displays both current and forecast water levels at several locations, and compares them to "action" levels for flooding or blowout-tide, as available. Each location is displayed as a marker on the map below. The marker will be either a square to indicate tidal stations, or a circle to indicate hydrological, non-tidal stations. The Action Level Key box displays a color legend for "action" levels.`,
    `The color of the markers indicates the current water level, as observed by real-time field instruments at these locations. If a location lacks such an instrument, or if for any reason no observations have been received over the past two hours, that location's marker is white with "M" indicating that only model forecasts are currently available.`,
    `If you click on a location marker, an "info window" will appear which notes the current observed water level and the most severe forecast level in the forecast period, along with the date/time when that event is expected.`
  ];

  return (
    <div>
      <h2 className="text-[#A32638] font-bold text-2xl mb-4">
        Stevens Flood Inundation Mapper Overview
      </h2>
      
      {/* Main page only shows the first paragraph */}
      <div className="text-gray-800 leading-relaxed text-sm mb-4">
        <p>{overviewTextBody[0]}</p>
      </div>
      
      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-1 bg-white text-[#A32638] font-bold border border-[#A32638] rounded hover:bg-gray-50 transition-colors"
      >
        More
      </button>

      {/* The Popout (Modal) Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity">
          
          {/* The Popout Box */}
          <div className="bg-white rounded shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative p-8">
            
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

            <h2 className="text-[#A32638] font-bold text-2xl mb-6 border-b pb-2">
              Overview Details
            </h2>
            
            {/* Full text inside the popout */}
            <div className="text-gray-800 leading-relaxed space-y-4">
              {overviewTextBody.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Bottom Close Button */}
            <div className="mt-8 flex justify-end border-t pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-white text-[#A32638] font-bold border border-[#A32638] rounded hover:bg-gray-50 transition-colors"
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