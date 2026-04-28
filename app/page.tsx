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

const MapSection = dynamic(() => import("./osm-test/components/MapSection"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 flex items-center justify-center">Loading map...</div>,
});

export default function OSMTestPage() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>("50th");
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const [printStartDate, setPrintStartDate] = useState<string>("...");
  const [printEndDate, setPrintEndDate] = useState<string>("...");

  useEffect(() => {
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

  useEffect(() => {
    fetch('/data/sfas_stations.txt') 
      .then((res) => {
        if (!res.ok) throw new Error("Could not find the file");
        return res.text();
      })
      .then((text) => {
        const startMatch = text.match(/var\s+print_start_date\s*=\s*'([^']+)';/);
        const endMatch = text.match(/var\s+print_end_date\s*=\s*'([^']+)';/);
        
        if (startMatch && startMatch[1]) {
          setPrintStartDate(startMatch[1]);
        }
        if (endMatch && endMatch[1]) {
          setPrintEndDate(endMatch[1]);
        }
      })
      .catch((err) => {
        console.error("Error fetching forecast dates:", err);
      });
  }, []);

  const handleDisclaimerAgree = () => {
    const estDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
      .toISOString()
      .split('T')[0];
    localStorage.setItem("disclaimerAgreed", JSON.stringify({ date: estDate, agreed: true }));
    setShowDisclaimer(false);
  };

  const { state, triggerStationRefresh } = useSFASStations();
  const stations = state?.stations || [];
  const loading = state?.loading || false;

  useEffect(() => {
    const intervalId = setInterval(() => {
      triggerStationRefresh();
      console.log("Auto-refreshing stations data...");
    }, 5 * 60 * 1000); 

    return () => clearInterval(intervalId); 
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
            <p className="text-[#A32638] text-sm mt-0.5">
              Forecast Period: {printStartDate} through {printEndDate}
            </p>
          </div>
          
          <MapSection 
            dataset={selectedDataset} 
            stations={stations}
            selectedStationId={selectedStationId}
          />

          {/* DEDICATED MOBILE DROPDOWNS (Hidden on Desktop) */}
          <div className="md:hidden mt-4 space-y-4">
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
                {stations?.map((station: any) => (
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