"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import VectorGeoJSONLayer from "./VectorGeoJSONLayer";
import { DatasetType } from "../types";
import { Station, isFloodingPredicted } from "@/app/lib/stations";
import StationMarker from "./StationMarker"; // Import the custom marker component!

// MapController watches the selected station and moves the camera
function MapController({ selectedStationId, stations }: { selectedStationId: string, stations: Station[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedStationId && stations.length > 0) {
      // Look for station.did instead of station.id
      const target = stations.find(s => s.did === selectedStationId);
      if (target) {
        // Fly to the coordinates and zoom in to level 12
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

  // Test mode: set to true to enable fake flooding data for testing the blink effect
  const TEST_MODE = false;

  // Create test stations with flooding predicted if TEST_MODE is enabled
  const testStations = TEST_MODE
    ? stations.map((station) => {
        // Make Manasquan and Little Egg blink for testing
        if (station.title.includes("Manasquan") || station.title.includes("Little Egg")) {
          return {
            ...station,
            model_alert: 1,
            flag_model_alert: 3, // Minor flood level to trigger blinking
          };
        }
        return station;
      })
    : stations;

  // Flashing markers for which the model predicts flooding
  useEffect(() => {
    const intervalId = setInterval(() => {
      testStations
        .filter((elem: Station) => isFloodingPredicted(elem)) // only get stations with flooding predicted
        .forEach((elem: Station) => {
          const elemNode = document.getElementById(elem.did); // get the marker element
          if (elemNode) {
            if (elemNode.classList.contains("mapglyph-blink")) {
              // alternate between blinking and not-blinking
              elemNode.classList.remove("mapglyph-blink");
            } else {
              elemNode.classList.add("mapglyph-blink");
            }
          }
        });
    }, 1000);

    // return cleanup function to clear intervals
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
        <div className="min-[768px]:hidden absolute top-3 right-3 z-[1200] flex gap-2">
          <button
            type="button"
            onClick={() => setIsLegendOpen((prev) => !prev)}
            className="px-1.5 py-1 bg-white text-[#A32638] border border-[#A32638] font-semibold text-[10px] rounded shadow"
          >
            {isLegendOpen ? "Hide Legends" : "Show Legends"}
          </button>
        </div>

        {isLegendOpen && (
          <aside className="min-[768px]:hidden absolute top-12 right-3 z-[1200] w-[165px] max-h-[66%] overflow-y-auto rounded border border-gray-300 bg-white shadow-lg p-2">
            <div className="mb-2">
              <h3 className="text-[11px] font-bold text-[#A32638]">Color Legends</h3>
            </div>

            <div className="mb-2">
              <h4 className="text-[10px] font-bold text-[#A32638] mb-1 text-center">Observed Water Level</h4>
              <div className="space-y-0.5 text-[9px] font-bold text-center">
                <div className="py-0.5 bg-[#b53ef5] text-black">MAJOR FLOOD</div>
                <div className="py-0.5 bg-[#f44336] text-black">MODERATE FLOOD</div>
                <div className="py-0.5 bg-[#ffb74d] text-black">MINOR FLOOD</div>
                <div className="py-0.5 bg-[#ffff66] text-black">NEAR FLOOD</div>
                <div className="py-0.5 bg-[#69f0ae] text-black">NORMAL LEVELS</div>
                <div className="py-0.5 bg-[#9e9e9e] text-black">BLOWOUT</div>
                <div className="py-0.5 bg-white text-black border border-gray-300">MODEL PRED ONLY</div>
              </div>
              <p className="mt-1 text-[8px] leading-tight text-gray-700 text-center">
                Marker color indicates current water level. Blinking markers indicate predicted flooding.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-[#A32638] mb-1 text-center">Flood Depth Legend</h4>
              <div className="space-y-0.5 text-[9px] font-bold text-center">
                <div className="py-0.5 bg-[#b3e5fc] text-black">&lt; 1 FOOT</div>
                <div className="py-0.5 bg-[#4fc3f7] text-black">1-2 FEET</div>
                <div className="py-0.5 bg-[#039be5] text-black">2-3 FEET</div>
                <div className="py-0.5 bg-[#01579b] text-black">3 &lt; FEET</div>
              </div>
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

          {/* Render custom StationMarkers! */}
          {testStations?.map((station) => (
            <StationMarker key={station.did} station={station} />
          ))}

          <MapController selectedStationId={selectedStationId} stations={stations} />

        </MapContainer>
      </div>
    </div>
  );
}