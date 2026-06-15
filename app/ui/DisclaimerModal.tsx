"use client";

import React from "react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onAgree: () => void;
}

export default function DisclaimerModal({ isOpen, onAgree }: DisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#A32638] text-white px-6 py-4 md:px-8 md:py-5 flex-shrink-0">
          <h2 className="text-2xl md:text-3xl font-bold">Disclaimer</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-gray-700 space-y-4 overflow-y-auto flex-1">
          <p>
            This webpage presents data on water levels and flood depths based on computational model-based forecasts. The Stevens models capture water levels and flooding due to storm surge, tides and river flows. The forecast data may underestimate flooding due to processes like local rainfall and wave runup that are not represented in the Stevens model.
          </p>

          <p>
            Please always check with the National Weather Service for the official water level forecast - we share our forecast data which they use alongside forecasts from NOAA to create the best possible combined forecast, including human interpretation of the weather and the strengths and weaknesses of each forecast system.
          </p>
        </div>

        {/* Footer with Button */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end sticky bottom-0">
          <button
            onClick={onAgree}
            className="px-6 py-2 bg-[#A32638] text-white font-semibold rounded-md hover:bg-[#8B1F2E] transition-colors"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
