"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import OverviewSection from "./components/OverviewSection";
import SidebarLegends from "./components/SidebarLegends";
import { DatasetType } from "./types";
import useSFASStations from "../hooks/useSFASStations";
import sponsorsImage from "../images/sponsorLogos/sponsor_logos.jpg";

// Dynamically import MapSection with SSR disabled to prevent leaflet window is not defined error
const MapSection = dynamic(() => import("./components/MapSection"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 flex items-center justify-center">Loading map...</div>,
}); 

export default function OSMTestPage() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>("50th");
  const [selectedStationId, setSelectedStationId] = useState<string>("");

  // Fetch live stations from your Python script via the hook
  const { state } = useSFASStations();
  const { stations, loading } = state;

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
          </div>
          
          <MapSection 
            dataset={selectedDataset} 
            stations={stations || []} // Provide empty array fallback while loading
            selectedStationId={selectedStationId}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="hidden min-[768px]:block col-span-1 min-[768px]:col-span-1">
          <SidebarLegends 
            selectedDataset={selectedDataset} 
            setSelectedDataset={setSelectedDataset} 
            stations={stations || []} // Provide empty array fallback while loading
            selectedStationId={selectedStationId}
            setSelectedStationId={setSelectedStationId}
            isLoadingStations={loading} // Pass loading state to disable dropdown
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