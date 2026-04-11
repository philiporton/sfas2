"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import OverviewSection from "./osm-test/components/OverviewSection";
import SidebarLegends from "./osm-test/components/SidebarLegends";
import DisclaimerModal from "./ui/DisclaimerModal";
import RefreshTimer from "./ui/RefreshTimer";
import { DatasetType } from "./osm-test/types";
import useSFASStations from "./hooks/useSFASStations";
import sponsorsImage from "./images/sponsorLogos/sponsor_logos.jpg";

// Dynamically import MapSection with SSR disabled to prevent leaflet window is not defined error
const MapSection = dynamic(() => import("./osm-test/components/MapSection"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 flex items-center justify-center">Loading map...</div>,
});

export default function OSMTestPage() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>("50th");
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    // Check if user has already agreed to disclaimer
    const hasAgreed = localStorage.getItem("disclaimerAgreed");
    if (!hasAgreed) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleDisclaimerAgree = () => {
    localStorage.setItem("disclaimerAgreed", "true");
    setShowDisclaimer(false);
  };

  const { state, triggerStationRefresh } = useSFASStations();
  const stations = state?.stations || [];
  const loading = state?.loading || false;

  // Auto-refresh stations data every 5 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      triggerStationRefresh();
      console.log("Auto-refreshing stations data...");
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [triggerStationRefresh]);

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
    <>
      <DisclaimerModal isOpen={showDisclaimer} onAgree={handleDisclaimerAgree} />
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
            stations={stations}
            selectedStationId={selectedStationId}
          />

          <RefreshTimer />
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-1">
          <SidebarLegends 
            selectedDataset={selectedDataset} 
            setSelectedDataset={setSelectedDataset} 
            stations={stations}
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
    </>
  );
}