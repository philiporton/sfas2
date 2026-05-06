"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import OverviewSection from "./components/OverviewSection";
import SidebarLegends from "./components/SidebarLegends";
import { DatasetType } from "./types";
import useSFASStations from "../hooks/useSFASStations";
import sponsorsImage from "../images/sponsorLogos/sponsor_logos.jpg";
import { type Station } from "@/app/lib/stations";

// Dynamically import MapSection with SSR disabled to prevent leaflet window is not defined error
const MapSection = dynamic(() => import("./components/MapSection"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 flex items-center justify-center">Loading map...</div>,
}); 

export default function OSMTestPage() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>("50th");
  const [selectedStationId, setSelectedStationId] = useState<string>("");

  // Fetch live stations AND the print dates from your Python/txt file via the hook
  const { state } = useSFASStations();
  
  // Pulling the variables directly from your state object
  const { 
    stations, 
    loading, 
    print_start_date, 
    print_end_date 
  } = state as any; // Using 'any' here just in case your types aren't updated yet

  const getTitleAndSubtitle = (dataset: DatasetType) => {
    const scenarios = {
      "05th": { percentile: "Worst Case Forecast", subtitle: "5% Chance to be Exceeded" },
      "50th": { percentile: "Most Likely Forecast", subtitle: "50% Chance to be Exceeded" },
      "95th": { percentile: "Best Case Forecast", subtitle: "95% Chance to be Exceeded" },
    };
    return scenarios[dataset];
  };

  const { percentile, subtitle } = getTitleAndSubtitle(selectedDataset);

  return (
    <main className="container mx-auto px-2 md:px-4 mt-4 md:mt-8 mb-10">
      <style>{`
        @media (max-width: 767px) {
          .overview-title {
            font-size: 1.5rem;
          }
          .map-title {
            font-size: 1rem;
          }
          .map-subtitle {
            font-size: 0.75rem;
          }
          main {
            padding-left: 8px;
            padding-right: 8px;
          }
        }
        @media (max-width: 480px) {
          .overview-title {
            font-size: 1.25rem;
          }
          .map-title {
            font-size: 0.95rem;
          }
          .map-subtitle {
            font-size: 0.7rem;
          }
          .gap-4 {
            gap: 0.75rem;
          }
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
        
        {/* LEFT COLUMN */}
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <OverviewSection />
          
          <div className="mt-2 md:mt-6 mb-2 md:mb-4">
            <h2 className="map-title text-2xl font-bold text-[#A32638] mb-1">
              Current Flood Map: {percentile}
            </h2>
            <p className="map-subtitle text-[#A32638] text-sm">{subtitle}</p>
            
            {/* FORECAST PERIOD LINE */}
            <p className="map-subtitle text-gray-700 text-sm font-semibold mt-1">
              Forecast Period: {print_start_date} through {print_end_date}
            </p>
          </div>
          
          <MapSection 
            dataset={selectedDataset} 
            stations={stations || []} // Provide empty array fallback while loading
            selectedStationId={selectedStationId}
          />

          <div className="min-[768px]:hidden mt-3 space-y-3">
            <div className="bg-[#e4e5e6] p-3 rounded">
              <h3 className="text-[#A32638] font-bold text-sm mb-2 text-center">Stations</h3>
              <select
                value={selectedStationId}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedStationId(value);
                  if (value) {
                    window.open(`/stations?stationId=${value}`, '_blank');
                  }
                }}
                disabled={loading}
                className="w-full p-2 border border-gray-400 bg-white text-[#A32638] font-semibold text-sm focus:outline-none"
              >
                <option value="">
                  {loading ? "Loading Stations..." : "Select a Station to Display on Map"}
                </option>
                {stations?.map((station: Station) => (
                  <option key={station.did} value={station.did}>
                    {station.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#e4e5e6] p-3 rounded">
              <h3 className="text-[#A32638] font-bold text-sm mb-2 text-center">Flood Inundation</h3>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value as DatasetType)}
                className="w-full p-2 border border-gray-400 bg-white text-[#A32638] font-semibold text-sm focus:outline-none"
              >
                <option value="05th">Worst Case Scenario</option>
                <option value="50th">Most Likely Scenario</option>
                <option value="95th">Best Case Scenario</option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hidden min-[768px]:block col-span-1 min-[768px]:col-span-1">
          <SidebarLegends 
            selectedDataset={selectedDataset} 
            setSelectedDataset={setSelectedDataset} 
            stations={stations || []} 
            selectedStationId={selectedStationId}
            setSelectedStationId={setSelectedStationId}
            isLoadingStations={loading}
          />
        </div>

      </div>

      <section className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-[#A32638] mb-3">Our Sponsors</h2>
        <p className="text-gray-700 mb-6 max-w-5xl">
          The development of the Stevens Flood Inundation Mapper webpage has been made possible by the following sponsors and partners:
        </p>
        <Image
          src={sponsorsImage}
          alt="Logos of sponsors and partners supporting the Stevens Flood Inundation Mapper"
          className="w-full h-auto"
          priority
        />
      </section>
    </main>
  );
}