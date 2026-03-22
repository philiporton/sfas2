"use client";

import React from "react";
import { DatasetType } from "../types";

interface SidebarLegendsProps {
  selectedDataset: DatasetType;
  setSelectedDataset: (dataset: DatasetType) => void;
}

export default function SidebarLegends({ selectedDataset, setSelectedDataset }: SidebarLegendsProps) {
  // Common styling for the red titles
  const titleClass = "text-[#A32638] font-bold text-center leading-tight";

  return (
    // Outer container: centered, with adjusted vertical space between boxes
    <div className="flex flex-col items-center space-y-8 w-full">
      
      {/* Box 1: Stations */}
      <div className="bg-[#e4e5e6] px-4 py-6 w-full">
        <h2 className={`${titleClass} text-2xl mb-4`}>
          Stevens Flood Inundation<br />Mapper Stations
        </h2>
        
        <select className="w-full p-2 border border-gray-400 bg-white text-[#A32638] font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-[#A32638]">
          <option>Select a Station to Display on Map</option>
          <option>Portland ME</option>
          <option>Hudson River at Albany NY</option>
          <option>Schodock Island NY</option>
          <option>Boston MA</option>
          <option>Tivoli Bays south NY</option>
          <option>Norrie Point NY</option>
          <option>Providence RI</option>
          <option>Hudson River below Poughkeepsie NY</option>
          <option>Woods Hole MA</option>
          <option>Newport RI</option>
          <option>Hudson River at South Dock at West Point NY</option>
          <option>New London CT</option>
          <option>Nantucket MA</option>
        </select>
      </div>

      {/* Box 2: Observed Water Level */}
      <div className="bg-[#e4e5e6] px-4 py-6 w-full text-center">
        <h2 className={`${titleClass} text-2xl mb-4`}>Observed Water Level</h2>
        <div className="space-y-2">
          <div className="w-full text-black font-bold py-1 bg-[#b53ef5]">MAJOR FLOOD</div>
          <div className="w-full text-black font-bold py-1 bg-[#f44336]">MODERATE FLOOD</div>
          <div className="w-full text-black font-bold py-1 bg-[#ffb74d]">MINOR FLOOD</div>
          <div className="w-full text-black font-bold py-1 bg-[#ffff66]">NEAR FLOOD</div>
          <div className="w-full text-black font-bold py-1 bg-[#69f0ae]">NORMAL LEVELS</div>
          <div className="w-full text-black font-bold py-1 bg-[#9e9e9e]">BLOWOUT</div>
          <div className="w-full text-black font-bold py-1 bg-white">MODEL PREDICTIONS ONLY</div>
        </div>
        <p className="text-xs mt-4 text-gray-700 leading-tight">
          Marker color indicates current water level. Blinking markers indicate predicted flooding.
        </p>
      </div>

      {/* Box 3: Flood Inundation Legend */}
      <div className="bg-[#e4e5e6] px-4 py-6 w-full text-center">
        <h2 className={`${titleClass} text-2xl mb-4`}>Flood Inundation</h2>
        
      <select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value as DatasetType)}
          className="w-full p-2 border border-gray-400 bg-white text-[#A32638] font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-[#A32638] mb-6"
        >
          {/* Removed the placeholder text and restored the proper 5%, 50%, 90% options */}
          <option value="05th">5% Chance Exceedance</option>
          <option value="50th">50% Chance Exceedance</option>
          <option value="95th">95% Chance Exceedance</option>
        </select>

        <h3 className={`${titleClass} text-xl mb-3`}>Flood Depth Legend</h3>
        
        <div className="space-y-2">
          <div className="w-full text-black font-bold py-1 bg-[#b3e5fc]">&lt; 1 FOOT</div>
          <div className="w-full text-black font-bold py-1 bg-[#4fc3f7]">1-2 FEET</div>
          <div className="w-full text-black font-bold py-1 bg-[#039be5]">2-3 FEET</div>
          
          <div className="w-full text-black font-bold py-1 bg-[#01579b]">3 &lt; FEET</div>
        </div>
      </div>

    </div>
  );
}