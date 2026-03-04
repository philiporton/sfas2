"use client";

import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import VectorGeoJSONLayer from "@/app/ui/map/VectorGeoJSONLayer";

type DatasetType = "05th" | "50th" | "95th";

export default function MapContent({ dataset }: { dataset: DatasetType }) {
  const center: [number, number] = [39.76, -74.09];

  const getTitleAndSubtitle = (dataset: DatasetType) => {
    const scenarios = {
      "05th": { percentile: "5th Percentile", subtitle: "Worst-Case Scenario" },
      "50th": { percentile: "50th Percentile", subtitle: "Most Likely Scenario" },
      "95th": { percentile: "95th Percentile", subtitle: "Best Case Scenario" },
    };
    return scenarios[dataset];
  };

  const { percentile, subtitle } = getTitleAndSubtitle(dataset);

    return (
    <>
      <style>{`
        .leaflet-tile {
          outline: 1px solid rgba(200, 200, 200, 0.4);
        }
      `}</style>

      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#A32638] mb-1">
          Current Flood Map: {percentile}
        </h1>
        <p className="text-[#A32638] font-semibold text-sm">{subtitle}</p>
      </div>
      
      <div style={{ width: "100%", height: "600px", position: "relative" }}>
        <MapContainer 
          center={center} 
          zoom={10} 
          style={{ height: "100%", width: "100%" }} 
          minZoom={5} 
          maxZoom={28}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={28}
            maxNativeZoom={19}
          />
          <VectorGeoJSONLayer dataset={dataset}/>
        </MapContainer>
      </div>
    </>
  );
}