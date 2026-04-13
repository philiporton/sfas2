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
          .color-legend-item {
            font-size: 0.7rem;
            padding: 0.4rem !important;
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
          .color-legend-item {
            font-size: 0.65rem;
            padding: 0.3rem !important;
          }
          .space-y-2 {
            gap: 0.25rem;
          }
        }
      `}
      </style>
      
      {/* Box 1: Stations */}
      <div className="sidebar-box bg-[#e4e5e6] px-4 py-6 md:px-4 md:py-6 w-full">
        <h2 className={`${titleClass} sidebar-title-main text-2xl mb-4`}>
          Stevens Flood Inundation<br />Mapper Stations
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

      {/* Box 2: Observed Water Level */}
      <div className="sidebar-box hidden min-[768px]:block bg-[#e4e5e6] px-4 py-6 md:px-4 md:py-6 w-full text-center">
        <h2 className={`${titleClass} sidebar-title-main text-2xl mb-4`}>Observed Water Level</h2>
        <div className="space-y-2">
          <div className="color-legend-item w-full text-black font-bold py-1 bg-[#b53ef5]">MAJOR FLOOD</div>
          <div className="color-legend-item w-full text-black font-bold py-1 bg-[#f44336]">MODERATE FLOOD</div>
          <div className="color-legend-item w-full text-black font-bold py-1 bg-[#ffb74d]">MINOR FLOOD</div>
          <div className="color-legend-item w-full text-black font-bold py-1 bg-[#ffff66]">NEAR FLOOD</div>
          <div className="color-legend-item w-full text-black font-bold py-1 bg-[#69f0ae]">NORMAL LEVELS</div>
          <div className="color-legend-item w-full text-black font-bold py-1 bg-[#9e9e9e]">BLOWOUT</div>
          <div className="color-legend-item w-full text-black font-bold py-1 bg-white">MODEL PREDICTIONS ONLY</div>
        </div>
        <p className="text-xs mt-4 text-gray-700 leading-tight">
          Marker color indicates current water level. Blinking markers indicate predicted flooding.
        </p>
      </div>

      {/* Box 3: Flood Inundation */}
      <div className="sidebar-box bg-[#e4e5e6] px-4 py-6 md:px-4 md:py-6 w-full text-center">
        <h2 className={`${titleClass} sidebar-title-main text-2xl mb-4`}>Flood Inundation</h2>
        
        <select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value as DatasetType)}
          className="sidebar-select w-full p-2 border border-gray-400 bg-white text-[#A32638] font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-[#A32638] mb-6"
        >
          <option value="05th">5% Chance Exceedance</option>
          <option value="50th">50% Chance Exceedance</option>
          <option value="95th">95% Chance Exceedance</option>
        </select>

        <h3 className={`${titleClass} sidebar-title-sub text-xl mb-3 hidden min-[768px]:block`}>Flood Depth Legend</h3>
        
        <div className="space-y-2 hidden min-[768px]:block">
          <div className="color-legend-item w-full text-black font-bold py-1 bg-[#b3e5fc]">&lt; 1 FOOT</div>
          <div className="color-legend-item w-full text-black font-bold py-1 bg-[#4fc3f7]">1-2 FEET</div>
          <div className="color-legend-item w-full text-black font-bold py-1 bg-[#039be5]">2-3 FEET</div>
          <div className="color-legend-item w-full text-black font-bold py-1 bg-[#01579b]">3 &lt; FEET</div>
        </div>
      </div>

    </div>
  );
}