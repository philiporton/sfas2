"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import VectorGeoJSONLayer from "./VectorGeoJSONLayer";
import { DatasetType } from "../types";

export default function MapSection({ dataset }: { dataset: DatasetType }) {
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
        </MapContainer>
      </div>
    </div>
  );
}