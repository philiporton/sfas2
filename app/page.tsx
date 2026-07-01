"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import OverviewSection from "./osm-test/components/OverviewSection";
import SidebarLegends, { SectionHeading } from "./osm-test/components/SidebarLegends";
import DisclaimerModal from "./ui/DisclaimerModal";
import RefreshTimer from "./ui/RefreshTimer";
import { DatasetType } from "./osm-test/types";
import useSFASStations from "./hooks/useSFASStations";
import sponsorsImage from "./images/sponsorLogos/sponsor_logos.jpg";
import { ForecastRange } from './lib/date';

const MapSection = dynamic(() => import("./osm-test/components/MapSection"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 flex items-center justify-center">Loading map...</div>,
});

export default function OSMTestPage() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>("50th");
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const [ForecastRange, setForecastRange] = useState<ForecastRange | null>(null);

  useEffect(() => {
    setHasMounted(true);

    const estDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
      .toISOString()
      .split('T')[0];
    
    const stored = localStorage.getItem("disclaimerAgreed");
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date !== estDate) {
          setShowDisclaimer(true);
        }
      } catch {
        setShowDisclaimer(true);
      }
    } else {
      setShowDisclaimer(true);
    }
  }, []);

  const handleDisclaimerAgree = () => {
    const estDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
      .toISOString()
      .split('T')[0];
    localStorage.setItem("disclaimerAgreed", JSON.stringify({ date: estDate, agreed: true }));
    setShowDisclaimer(false);
  };

  const { state, triggerStationRefresh } = useSFASStations(setForecastRange);
  const stations = state?.stations || [];
  const loading = state?.loading || false;

  useEffect(() => {
    const intervalId = setInterval(() => {
      triggerStationRefresh();
      console.log("Auto-refreshing stations data...");
    }, 5 * 60 * 1000); 

    return () => clearInterval(intervalId); 
  }, [triggerStationRefresh]);

  useEffect(() => {
    document.title = "Stevens Flood Inundation Mapper";
  }, []);

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
          
          <div className="mt-8 mb-4">
            <h1 className="text-2xl font-bold text-[#A32638] mb-1">
              Current Flood Map: {percentile}
            </h1>
            <p className="text-[#A32638] text-sm">{subtitle}</p>
            { ForecastRange && (
            <p className="text-[#A32638] text-sm mt-0.5">
              Forecast Period: {ForecastRange[0]} through {ForecastRange[1]}
            </p>
            )}
          </div>
          
          <MapSection 
            dataset={selectedDataset} 
            stations={stations}
            selectedStationId={selectedStationId}
          />

          {/* DEDICATED MOBILE DROPDOWNS (Hidden on Desktop) */}
          <div className="md:hidden mt-4 space-y-4">
            <div className="bg-[#e4e5e6] p-3 rounded">
              <SectionHeading
                title="Forecast Flooding"
                description="The Stevens Flood Inundation Mapper displays flood depth estimates in blue shades for three forecast options across coastal New Jersey."
                className="mb-3"
              />
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value as DatasetType)}
                className="w-full p-2 border border-gray-400 bg-white text-[#A32638] font-semibold text-sm focus:outline-none"
                aria-label="Select various forecast flooding scenarios"
              >
                <option value="05th">Worst Case Scenario</option>
                <option value="50th">Most Likely Scenario</option>
                <option value="95th">Best Case Scenario</option>
              </select>
            </div>
            <div className="bg-[#e4e5e6] p-3 rounded">
              <SectionHeading
                title="Detailed Data"
                description="Select a station to open detailed forecast and gauge information in a new tab."
                className="mb-3"
              />
              <select
                value={selectedStationId}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedStationId(value);
                  if (value) {
                    window.open(`/stations?stationId=${value}`, '_blank');
                  }
                }}
                disabled={hasMounted ? loading : false}
                className="w-full p-2 border border-gray-400 bg-white text-[#A32638] font-semibold text-sm focus:outline-none"
                aria-label="Select a station to open detailed forecast and gauge information in a new tab."
              >
                <option value="">
                  {loading ? "Loading Stations..." : "View detailed station data"}
                </option>
                {stations?.map((station: any) => (
                  <option key={station.did} value={station.did}>
                    {station.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <RefreshTimer />
        </div>

        {/* RIGHT COLUMN (Hidden on Mobile) */}
        <div className="hidden md:block md:col-span-1">
          <SidebarLegends 
            selectedDataset={selectedDataset} 
            setSelectedDataset={setSelectedDataset} 
            stations={stations}
            selectedStationId={selectedStationId}
            setSelectedStationId={setSelectedStationId}
            isLoadingStations={hasMounted ? loading : false}
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