"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import VectorGeoJSONLayer from "./VectorGeoJSONLayer";
import { DatasetType } from "../types";
import { Station, isFloodingPredicted } from "@/app/lib/stations";
import StationMarker from "./StationMarker"; 

function MapController({ selectedStationId, stations }: { selectedStationId: string, stations: Station[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedStationId && stations.length > 0) {
      const target = stations.find(s => s.did === selectedStationId);
      if (target) {
        map.flyTo([target.lat, target.lon], 12, { duration: 1.5 });
      }
    }
  }, [selectedStationId, stations, map]);

  return null;
}

export default function MapSection({
  dataset,
  stations,
  selectedStationId
}: {
  dataset: DatasetType,
  stations: Station[],
  selectedStationId: string
}) {
  const center: [number, number] = [39.76, -74.09];
  const [currentGeoJson, setCurrentGeoJson] = useState<any>(null);
  
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"water" | "depth">("water");

  const TEST_MODE = false;

  const testStations = TEST_MODE
    ? stations.map((station) => {
        if (station.title.includes("Manasquan") || station.title.includes("Little Egg")) {
          return {
            ...station,
            model_alert: 1,
            flag_model_alert: 3, 
          };
        }
        return station;
      })
    : stations;

  useEffect(() => {
    const intervalId = setInterval(() => {
      testStations
        .filter((elem: Station) => isFloodingPredicted(elem))
        .forEach((elem: Station) => {
          const elemNode = document.getElementById(elem.did);
          if (elemNode) {
            if (elemNode.classList.contains("mapglyph-blink")) {
              elemNode.classList.remove("mapglyph-blink");
            } else {
              elemNode.classList.add("mapglyph-blink");
            }
          }
        });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [testStations]);

  return (
    <div className="flex flex-col border-2 border-gray-300 rounded overflow-hidden w-full">
      <style>{`
        .leaflet-tile {
          outline: 1px solid rgba(200, 200, 200, 0.4);
        }
        @media (max-width: 767px) {
          .map-container {
            height: 300px !important;
          }
        }
        @media (max-width: 480px) {
          .map-container {
            height: 250px !important;
          }
        }
      `}</style>

      <div className="map-container" style={{ width: "100%", position: "relative", height: "700px" }}>
        
        {/* Toggle Button for Mobile Legends */}
        <div className="min-[768px]:hidden absolute top-3 right-3 z-[1200] flex gap-2">
          <button
            type="button"
            onClick={() => setIsLegendOpen((prev) => !prev)}
            className="px-1.5 py-1 bg-white text-[#A32638] border border-[#A32638] font-semibold text-[10px] rounded shadow"
          >
            {isLegendOpen ? "Hide Legends" : "Show Legends"}
          </button>
        </div>

        {/* The Mobile Legend Box with Tabs */}
        {isLegendOpen && (
          <aside className="min-[768px]:hidden absolute top-12 right-3 z-[1200] w-[140px] rounded border border-gray-300 bg-white shadow-lg flex flex-col overflow-hidden">
            
            {/* TABS HEADER */}
            <div className="flex w-full border-b border-gray-300">
              <button
                onClick={() => setActiveTab("water")}
                className={`flex-1 py-1 text-[9px] font-bold ${
                  activeTab === "water" 
                    ? "bg-[#A32638] text-white" 
                    : "bg-gray-100 text-[#A32638] hover:bg-gray-200"
                }`}
              >
                Water Level
              </button>
              <button
                onClick={() => setActiveTab("depth")}
                className={`flex-1 py-1 text-[9px] font-bold border-l border-gray-300 ${
                  activeTab === "depth" 
                    ? "bg-[#A32638] text-white" 
                    : "bg-gray-100 text-[#A32638] hover:bg-gray-200"
                }`}
              >
                Flood Depth
              </button>
            </div>

            {/* TAB CONTENT - Changed max-h to 160px so it never hits the bottom */}
            <div className="p-1 max-h-[160px] overflow-y-auto">
              
              {/* WATER LEVEL CONTENT */}
              {activeTab === "water" && (
                <div className="animate-fade-in">
                  {/* Changed space-y-0.5 to space-y-px to make the list tighter vertically */}
                  <div className="space-y-px text-[8px] font-bold text-center">
                    <div className="py-[1px] bg-[#b53ef5] text-black">MAJOR FLOOD</div>
                    <div className="py-[1px] bg-[#f44336] text-black">MODERATE FLOOD</div>
                    <div className="py-[1px] bg-[#ffb74d] text-black">MINOR FLOOD</div>
                    <div className="py-[1px] bg-[#ffff66] text-black">NEAR FLOOD</div>
                    <div className="py-[1px] bg-[#69f0ae] text-black">NORMAL LEVELS</div>
                    <div className="py-[1px] bg-[#9e9e9e] text-black">BLOWOUT</div>
                    <div className="py-[1px] bg-white text-black border border-gray-300">MODEL PRED ONLY</div>
                  </div>
                  <p className="mt-1 text-[7px] leading-tight text-gray-700 text-center">
                    Marker indicates current level. Blinking indicates predicted flooding.
                  </p>
                </div>
              )}

              {/* FLOOD DEPTH CONTENT */}
              {activeTab === "depth" && (
                <div className="animate-fade-in">
                  <div className="space-y-px text-[8px] font-bold text-center">
                    <div className="py-[1px] bg-[#b3e5fc] text-black">&lt; 1 FOOT</div>
                    <div className="py-[1px] bg-[#4fc3f7] text-black">1-2 FEET</div>
                    <div className="py-[1px] bg-[#039be5] text-black">2-3 FEET</div>
                    <div className="py-[1px] bg-[#01579b] text-black">3 &lt; FEET</div> 
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}

        <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%", zIndex: 10 }} minZoom={5} maxZoom={28}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={28}
            maxNativeZoom={19}
          />
          <VectorGeoJSONLayer dataset={dataset} onData={(d) => setCurrentGeoJson(d)} />

          {testStations?.map((station) => (
            <StationMarker key={station.did} station={station} />
          ))}

          <MapController selectedStationId={selectedStationId} stations={stations} />

        </MapContainer>
      </div>
    </div>
  );
}