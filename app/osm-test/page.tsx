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
    <main className="container mx-auto px-4 mt-8 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 flex flex-col">
          <OverviewSection />
          
          <div className="mt-8 mb-4">
            <h2 className="text-2xl font-bold text-[#A32638] mb-1">
              Current Flood Map: {percentile}
            </h2>
            <p className="text-[#A32638] text-sm">{subtitle}</p>
          </div>
          
          <MapSection 
            dataset={selectedDataset} 
            stations={stations || []} // Provide empty array fallback while loading
            selectedStationId={selectedStationId}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-1">
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