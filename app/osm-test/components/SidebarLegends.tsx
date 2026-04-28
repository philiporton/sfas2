"use client";

import React from "react";
import { DatasetType } from "../types";
import { Station } from "@/app/lib/stations";

interface SidebarLegendsProps {
  selectedDataset: DatasetType;
  setSelectedDataset: (dataset: DatasetType) => void;
  stations: Station[];
  selectedStationId: string;
  setSelectedStationId: (id: string) => void;
  isLoadingStations?: boolean;
}

function SectionHeading({
  title,
  description,
  className = ""
}: {
  title: React.ReactNode;
  description: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div>{title}</div>
      <div className="legend-tooltip group relative flex items-center">
        <button
          type="button"
          className="flex h-5 w-5 items-center justify-center rounded-full border border-[#A32638] bg-white text-xs font-bold text-[#A32638] hover:bg-[#f6ebed] focus:outline-none focus:ring-2 focus:ring-[#A32638] focus:ring-offset-1"
          aria-label="Section description"
        >
          ?
        </button>
        <div className="pointer-events-none absolute right-0 top-7 z-10 hidden w-56 rounded bg-[#1f2937] px-3 py-2 text-left text-xs font-normal leading-snug text-white shadow-lg group-hover:block group-focus-within:block">
          {description}
        </div>
      </div>
    </div>
  );
}

export default function SidebarLegends({
  selectedDataset, setSelectedDataset,
  stations, selectedStationId, setSelectedStationId, isLoadingStations
}: SidebarLegendsProps) {

  const titleClass = "text-[#A32638] font-bold text-center leading-tight";

  return (
    <div className="flex flex-col items-center space-y-3 md:space-y-8 w-full">
      <style>{`
        @media (max-width: 768px) {
          .sidebar-box {
            padding: 0.75rem;
          }
          .sidebar-title-main {
            font-size: 1rem;
            line-height: 1.1;
          }
          .sidebar-title-sub {
            font-size: 0.9rem;
          }
          .sidebar-select {
            font-size: 0.8rem;
            padding: 0.4rem;
          }
          .legend-tooltip > div {
            width: 12rem;
            right: -0.5rem;
          }
        }
        @media (max-width: 480px) {
          .sidebar-box {
            padding: 0.6rem;
          }
          .sidebar-title-main {
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }
          .sidebar-title-sub {
            font-size: 0.8rem;
          }
          .sidebar-select {
            font-size: 0.75rem;
            padding: 0.3rem;
          }
          .legend-tooltip > div {
            width: 10rem;
          }
          .space-y-2 {
            gap: 0.25rem;
          }
        }
      `}
      </style>

      {/* ------------------------------------------------ */}
      {/* Flood Inundation Section             */}
      {/* ------------------------------------------------ */}
      <div className="sidebar-box bg-[#e4e5e6] px-4 py-6 md:px-4 md:py-6 w-full text-center">
        <h2 className={`${titleClass} sidebar-title-main text-2xl mb-4`}>
          <SectionHeading
            title="Flood Inundation"
            description="The Stevens Flood Inundation Mapper displays flood depth estimates in blue shades for three forecast options across coastal New Jersey."
          />
        </h2>

        <select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value as DatasetType)}
          className="sidebar-select w-full p-2 border border-gray-400 bg-white text-[#A32638] font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-[#A32638] mb-6"
        >
          <option value="05th">Worst Case Scenario</option>
          <option value="50th">Most Likely Scenario</option>
          <option value="95th">Best Case Scenario</option>
        </select>

        <h3 className={`${titleClass} sidebar-title-sub text-xl mb-3 hidden min-[768px]:block`}>
          <SectionHeading
            title="Flood Depth Legend"
            description="If you click on the blue shading, an info window will appear that notes the peak water depth at that location over the forecast period."
          />
        </h3>

        <div className="space-y-2 hidden min-[768px]:block">
          <div className="w-full text-black font-bold py-1 bg-[#b3e5fc] text-xs">&lt; 1 FOOT</div>
          <div className="w-full text-black font-bold py-1 bg-[#4fc3f7] text-xs">1-2 FEET</div>
          <div className="w-full text-black font-bold py-1 bg-[#039be5] text-xs">2-3 FEET</div>
          <div className="w-full text-black font-bold py-1 bg-[#01579b] text-xs">3 &lt; FEET</div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* Observed Water Level & Stations   */}
      {/* ------------------------------------------------ */}
      <div className="sidebar-box hidden min-[768px]:block bg-[#e4e5e6] px-4 py-6 md:px-4 md:py-6 w-full text-center">
        
        {/* Part A: Observed Water Level */}
        <h2 className={`${titleClass} sidebar-title-main text-2xl mb-4`}>
          <SectionHeading
            title="Observed Water Level"
            description="The color of a square marker indicates the current water level, as observed by a measurement gauge. Any blinking of the marker indicates future flooding or a blowout tide (extremely low water level) is predicted within the forecast period shown above the map."
          />
        </h2>
        
        {/* LARGER Square boxes with text to the right for Desktop */}
        <div className="flex flex-col gap-3 w-fit mx-auto mt-4">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-[#b53ef5] border border-black flex-shrink-0"></div>
            <span className="text-sm font-bold text-gray-800">MAJOR FLOOD</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-[#f44336] border border-black flex-shrink-0"></div>
            <span className="text-sm font-bold text-gray-800">MODERATE FLOOD</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-[#ffb74d] border border-black flex-shrink-0"></div>
            <span className="text-sm font-bold text-gray-800">MINOR FLOOD</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-[#ffff66] border border-black flex-shrink-0"></div>
            <span className="text-sm font-bold text-gray-800">NEAR FLOOD</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-[#69f0ae] border border-black flex-shrink-0"></div>
            <span className="text-sm font-bold text-gray-800">NORMAL LEVELS</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-[#9e9e9e] border border-black flex-shrink-0"></div>
            <span className="text-sm font-bold text-gray-800">BLOWOUT</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-white border border-black flex-shrink-0"></div>
            <span className="text-sm font-bold text-gray-800">MODEL PREDICTIONS ONLY</span>
          </div>
        </div>

        <p className="text-xs mt-6 text-gray-700 leading-tight px-2">
          Marker color indicates current water level. Blinking markers indicate predicted flooding.
        </p>

        {/* Part B: Stations Dropdown */}
        <div className="border-t border-gray-300 pt-6 mt-6">
          <h2 className={`${titleClass} sidebar-title-main text-2xl mb-4`}>
            <SectionHeading
              title={
                <>
                  Stevens Flood Inundation<br />Mapper Stations
                </>
              }
              description={"To display more detailed information for stations including time-dependent water levels, use the SFIM Stations drop down in the control panel to select a station. The Stevens forecast for the selected location will be displayed first."}
            />
          </h2>

          <select
            value={selectedStationId}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedStationId(value);
              if (value) {
                window.open(`/stations?stationId=${value}`, '_blank');
              }
            }}
            disabled={isLoadingStations}
            className="sidebar-select w-full p-2 border border-gray-400 bg-white text-[#A32638] font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-[#A32638]"
          >
            <option value="">
              {isLoadingStations ? "Loading Stations..." : "Select a Station to Display on Map"}
            </option>
            {stations.map((station) => (
              <option key={station.did} value={station.did}>
                {station.title}
              </option>
            ))}
          </select>
        </div>

      </div>

    </div>
  );
}