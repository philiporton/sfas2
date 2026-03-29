"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import VectorGeoJSONLayer from "./VectorGeoJSONLayer";
import { DatasetType } from "../types";
import { Station } from "@/app/lib/stations";
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

          {/* Render your custom StationMarkers! */}
          {stations?.map((station) => (
            <StationMarker key={station.did} station={station} />
          ))}

          {/* Connects the dropdown to the camera movement */}
          <MapController selectedStationId={selectedStationId} stations={stations} />

        </MapContainer>
      </div>
    </div>
  );
}