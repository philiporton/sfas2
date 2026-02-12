"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type DatasetType = "05th" | "50th" | "95th";

function VectorGeoJSONLayer({ dataset }: { dataset: DatasetType }) {
  const map = useMap();
  const layerRef = useRef<L.GeoJSON | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    const fileMap: Record<DatasetType, string> = {
      "05th": "/data/flood_depth_bbaynorth_05th.geojson",
      "50th": "/data/flood_depth_bbaynorth_50th.geojson",
      "95th": "/data/flood_depth_bbaynorth_95th.geojson",
    };

    const loadGeoJSON = async () => {
      try {
        const res = await fetch(fileMap[dataset]);
        const data = await res.json();
        setGeoJsonData(data);
      } catch (err) {
        console.error("Error loading geojson:", err);
      }
    };

    loadGeoJSON();
  }, [dataset]);

  useEffect(() => {
    if (!geoJsonData || !map) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: {
        fillColor: "#6aaefc",
        weight: 1,
        opacity: 1,
        color: "#529dff",
        fillOpacity: 0.4,
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        if (props && Object.keys(props).length > 0) {
          let popupContent = "<div>";
          for (const key in props) {
            popupContent += `<p><strong>${key}:</strong> ${props[key]}</p>`;
          }
          popupContent += "</div>";
          layer.bindPopup(popupContent);
        }
      },
    });

    geoJsonLayer.addTo(map);
    layerRef.current = geoJsonLayer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [geoJsonData, map]);

  return null;
}

export default function OSMTestPage() {
  const center: [number, number] = [40.74399, -74.03236];
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>("50th");

  return (
    <main className="relative">
      <style>{`
        .leaflet-tile {
          outline: 1px solid rgba(200, 200, 200, 0.4);
        }
      `}</style>

      <div className="w-full text-center pt-4 mt-10">
        <h1 className="display-3 fw-bold text-body-emphasis">
          Bay Flood Depth Map
        </h1>
      </div>

      <div className="container font-sans mt-12 px-4">
        <div className="row">
          <div className="col-lg-8 col-md-12 order-lg-1 order-md-1 order-2">
            <h2 className="text-[#A32638]">FLOOD DEPTH MAP</h2>
            <div style={{ width: "100%", maxWidth: "100%", aspectRatio: "1", position: "relative" }}>
              <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }} minZoom={5} maxZoom={28}>
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={28}
                  maxNativeZoom={19}
                />
                <VectorGeoJSONLayer dataset={selectedDataset} />
              </MapContainer>
            </div>
          </div>

          <div className="col-lg-4 col-md-12 order-lg-2 order-md-2 order-1">
            <div className="text-center bg-[#e4e5e6] px-4 py-4 mb-4">
              <h3 className="text-[#A32638] mb-3">SELECT FLOOD DEPTH SCENARIO</h3>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value as DatasetType)}
                style={{
                  padding: "10px 12px",
                  fontSize: "14px",
                  cursor: "pointer",
                  width: "100%",
                  borderRadius: "4px",
                  border: "2px solid #A32638",
                }}
              >
                <option value="05th">5th Percentile</option>
                <option value="50th">50th Percentile (Median)</option>
                <option value="95th">95th Percentile</option>
              </select>
            </div>

            <div className="text-center bg-[#e4e5e6] px-4 py-2 mb-4">
              <h3 className="text-[#A32638]">FLOOD DEPTH LEGEND</h3>
              <div className="mt-3">
                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#6aaefc",
                      border: "1px solid #529dff",
                      marginRight: "10px",
                    }}
                  />
                  <p className="mb-0 text-left">Flood Depth Area</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Light blue shaded areas indicate regions where flooding is predicted at the selected scenario level. Darker boundaries delineate flood depth zones.
              </p>
            </div>

            <div className="text-center bg-[#e4e5e6] px-4 py-2 mb-4">
              <h3 className="text-[#A32638]">SCENARIO INFORMATION</h3>
              <div className="text-left text-sm">
                <p><strong>5th Percentile:</strong> Conservative estimate - flooding occurs in fewer locations</p>
                <p><strong>50th Percentile (Median):</strong> Most likely scenario - balanced estimate</p>
                <p><strong>95th Percentile:</strong> Extreme estimate - flooding occurs in more locations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
