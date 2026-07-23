"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, LayersControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import VectorGeoJSONLayer from "./VectorGeoJSONLayer";
import { DatasetType } from "../types";
import { Station, isFloodingPredicted } from "@/app/lib/stations";
import StationMarker from "./StationMarker"; 
import Image from "next/image";
import StevensLogo from "../../public/Stevens.png";

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
  const center: [number, number] = [39.55, -74.28];
  const initialZoom = 9;

  const [currentGeoJson, setCurrentGeoJson] = useState<any>(null);
  
  // THESE ARE THE LINES THAT WENT MISSING!
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"water" | "depth">("depth");

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
    <div className="flex flex-col border-2 border-gray-300 rounded overflow-hidden w-full relative z-0">

      <div 
        className="map-container w-full relative h-[250px] max-[480px]:h-[250px] md:h-[645px]" 
      >
        
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
                onClick={() => setActiveTab("depth")}
                className={`flex-1 py-1 text-[9px] font-bold ${
                  activeTab === "depth" 
                    ? "bg-[#A32638] text-white" 
                    : "bg-gray-100 text-[#A32638] hover:bg-gray-200"
                }`}
              >
                Flood Depth
              </button>
              <button
                onClick={() => setActiveTab("water")}
                className={`flex-1 py-1 text-[9px] font-bold border-l border-gray-300 ${
                  activeTab === "water" 
                    ? "bg-[#A32638] text-white" 
                    : "bg-gray-100 text-[#A32638] hover:bg-gray-200"
                }`}
              >
                Water Level
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-1 max-h-[140px] overflow-y-auto">
              
              {activeTab === "depth" && (
                <div className="animate-fade-in">
                  <div className="space-y-px text-[8px] font-bold text-center">
                    <div className="py-[1px] bg-[#b3e5fc] text-black">&lt; 1 FOOT</div>
                    <div className="py-[1px] bg-[#4fc3f7] text-black">1-2 FEET</div>
                    <div className="py-[1px] bg-[#039be5] text-black">2-3 FEET</div>
                    <div className="py-[1px] bg-[#01579b] text-white">&gt; 3 FEET</div>
                    <div className="py-[1px] bg-[#828282] text-white">Limit of forecast coverage</div>
                  </div>
                </div>
              )}

              {/* UPDATED UI: Square boxes with text to the right and black borders */}
              {activeTab === "water" && (
                <div className="animate-fade-in">
                  <div className="flex flex-col gap-[3px] w-fit mx-auto mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-[#b53ef5] border border-black flex-shrink-0"></div>
                      <span className="text-[8px] font-bold text-gray-800">MAJOR FLOOD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-[#f44336] border border-black flex-shrink-0"></div>
                      <span className="text-[8px] font-bold text-gray-800">MODERATE FLOOD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-[#ffb74d] border border-black flex-shrink-0"></div>
                      <span className="text-[8px] font-bold text-gray-800">MINOR FLOOD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-[#ffff66] border border-black flex-shrink-0"></div>
                      <span className="text-[8px] font-bold text-gray-800">NEAR FLOOD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-[#69f0ae] border border-black flex-shrink-0"></div>
                      <span className="text-[8px] font-bold text-gray-800">NORMAL LEVELS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-[#9e9e9e] border border-black flex-shrink-0"></div>
                      <span className="text-[8px] font-bold text-gray-800">BLOWOUT</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-white border border-black flex-shrink-0"></div>
                      <span className="text-[8px] font-bold text-gray-800">NO OBSERVATIONS</span>
                    </div>
                  </div>
                  <p className="mt-2 text-[7px] leading-tight text-gray-700 text-center px-1">
                    Marker indicates current level. Blinking indicates predicted flooding.
                  </p>
                </div>
              )}

            </div>
          </aside>
        )}

        <MapContainer center={center} zoom={initialZoom} style={{ height: "100%", width: "100%", zIndex: 10 }} minZoom={5} maxZoom={16} preferCanvas={true}>
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Satellite">
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Map">
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={28}
                  maxNativeZoom={19}
                  referrerPolicy="strict-origin-when-cross-origin"
                />
            </LayersControl.BaseLayer>
          </LayersControl>
          
          <VectorGeoJSONLayer dataset={dataset} onData={setCurrentGeoJson} />

          {testStations?.map((station) => (
            <StationMarker key={station.did} station={station} />
          ))}

          <MapController selectedStationId={selectedStationId} stations={stations} />

        </MapContainer>
        <div
          className="
              absolute
              bottom-3
              left-3
              z-[1000]
              bg-white/60
              rounded-md
              p-1
              pointer-events-none
          "
      >
        <Image 
              src={StevensLogo}
              alt="Stevens Logo"
              width={44}
              height={50}
              className="opacity-100"
              loading="eager"
              style={{
                width: "44px",
                height: "50px",
              }}
        />
      </div>
      </div>
    </div>
  );
}