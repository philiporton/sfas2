"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const [geoData, setGeoData] = useState<any>(null);
  const [depth, setDepth] = useState<number>(1);
  
  const dataCenter: [number, number] = [40.65, -73.84];

  useEffect(() => {
    fetch(`/data/flood_depth_${depth}ft.geojson`)
      .then((res) => {
        if (!res.ok) throw new Error("File not found");
        return res.json();
      })
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, [depth]);

  const getColor = (maxDepth: number) => {
    return maxDepth > 4 ? '#084594' : 
           maxDepth > 2 ? '#4881b3ff' :
           maxDepth > 1 ? '#a5cbe1ff' :
                          '#ffffffff';
  };

  const geojsonStyle = (feature: any) => {
    return {
      fillColor: getColor(feature.properties.depth_max_m),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.6,
    };
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* Small UI Overlay for Depth Selection */}
      <div style={{
        position: "absolute", top: 10, left: 50, zIndex: 1000, 
        background: "white", padding: "10px", borderRadius: "8px", border: "2px solid rgba(0,0,0,0.2)"
      }}>
        <label className="font-bold mr-2">Select Depth: </label>
        <select value={depth} onChange={(e) => setDepth(Number(e.target.value))}>
          <option value={1}>1ft Depth</option>
          <option value={2}>2ft Depth</option>
          <option value={3}>3ft Depth</option>
        </select>
      </div>

      <MapContainer center={dataCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Dark Map">
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          {geoData && (
            <LayersControl.Overlay checked name={`Flood Depth (${depth}ft)`}>
              <GeoJSON 
                key={depth} // This forces Leaflet to re-render when data changes
                data={geoData} 
                style={geojsonStyle}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    layer.bindPopup(`
                      <strong>Flood Info</strong><br/>
                      Max Depth: ${feature.properties.depth_max_m}m<br/>
                      Min Depth: ${feature.properties.depth_min_m}m<br/>
                      Area: ${feature.properties.area_sq_km?.toFixed(4)} sq km
                    `);
                  }
                }}
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>
      </MapContainer>
    </div>
  );
}