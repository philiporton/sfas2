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
      `}</style>
      
      <div style={{ width: "100%", position: "relative", height: "700px" }}>
        <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }} minZoom={5} maxZoom={28}>
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