"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type DatasetType = "05th" | "50th" | "95th";

function VectorGeoJSONLayer({ dataset, onData }: { dataset: DatasetType; onData?: (d: any) => void }) {
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
        if (onData) onData(data);
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

    const getColorForDepth = (depth_m: number | null) => {
      const ft1 = 0.3048; // <1 ft
      const ft2 = 0.6096; // 1-2 ft
      const ft3 = 0.9144; // 2-3 ft
      if (depth_m === null || isNaN(depth_m)) return "#ffffff00";
      if (depth_m < ft1) return "#f2fbff"; // very close to white
      if (depth_m < ft2) return "#bfe8ff"; // slightly darker
      if (depth_m < ft3) return "#6aaefc"; // medium blue
      return "#2a67d9"; // darkest
    };

    const styleFeature = (feature: any) => {
      const props = feature.properties || {};
      // use mean depth when min and max are available; treat zero/negative as no-data
      let depth_m: number | null = null;
      const hasMin = typeof props.depth_min_m === "number";
      const hasMax = typeof props.depth_max_m === "number";
      if (hasMin && hasMax) {
        const mean = (props.depth_min_m + props.depth_max_m) / 2;
        depth_m = mean > 0 ? mean : null;
      } else if (hasMin) {
        depth_m = props.depth_min_m > 0 ? props.depth_min_m : null;
      } else if (hasMax) {
        depth_m = props.depth_max_m > 0 ? props.depth_max_m : null;
      } else if (typeof props.depth_class === "number") {
        depth_m = props.depth_class > 0 ? props.depth_class : null;
      }
      const fillColor = getColorForDepth(depth_m);
      return {
        fillColor,
        weight: 1,
        opacity: 1,
        color: fillColor,
        fillOpacity: depth_m === null ? 0 : 0.6,
      } as L.PathOptions;
    };

    // Create separate GeoJSON layers for each depth bucket and add from darkest -> lightest
    const ft1 = 0.3048;
    const ft2 = 0.6096;
    const ft3 = 0.9144;

    const buckets = [
      { key: "gte3", test: (d: number) => d >= ft3 },
      { key: "2to3", test: (d: number) => d >= ft2 && d < ft3 },
      { key: "1to2", test: (d: number) => d >= ft1 && d < ft2 },
      { key: "lt1", test: (d: number) => d < ft1 },
    ];

    const makeDepth = (props: any) => {
      const hasMin = typeof props.depth_min_m === "number";
      const hasMax = typeof props.depth_max_m === "number";
      if (hasMin && hasMax) {
        const mean = (props.depth_min_m + props.depth_max_m) / 2;
        return mean > 0 ? mean : null;
      }
      if (hasMin) return props.depth_min_m > 0 ? props.depth_min_m : null;
      if (hasMax) return props.depth_max_m > 0 ? props.depth_max_m : null;
      if (typeof props.depth_class === "number") return props.depth_class > 0 ? props.depth_class : null;
      return null;
    };

    const group = L.layerGroup();

    for (const bucket of buckets) {
      const feats = (geoJsonData.features || []).filter((feat: any) => {
        const depth_m = makeDepth(feat.properties || {});
        if (depth_m === null || isNaN(depth_m)) return false;
        return bucket.test(depth_m);
      });

      if (feats.length === 0) continue;

      const coll = { type: "FeatureCollection", features: feats } as any;
      const layer = L.geoJSON(coll, {
        style: styleFeature,
        onEachFeature: (feature, layer) => {
          const props = feature.properties || {};
          if (props && Object.keys(props).length > 0) {
            const min_m = typeof props.depth_min_m === "number" ? props.depth_min_m : null;
            const max_m = typeof props.depth_max_m === "number" ? props.depth_max_m : null;
            const min_ft = min_m !== null ? (min_m * 3.28084).toFixed(2) : null;
            const max_ft = max_m !== null ? (max_m * 3.28084).toFixed(2) : null;
            let popupContent = "<div>";
            if (min_ft !== null || max_ft !== null) {
              popupContent += `<p><strong>Depth:</strong> ${min_ft ?? "-"} ft to ${max_ft ?? "-"} ft</p>`;
            }
            for (const key in props) {
              if (key === "depth_min_m" || key === "depth_max_m") continue;
              popupContent += `<p><strong>${key}:</strong> ${props[key]}</p>`;
            }
            popupContent += "</div>";
            layer.bindPopup(popupContent);
          }
        },
      });

      layer.addTo(group);
    }

    group.addTo(map);
    layerRef.current = group;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [geoJsonData, map]);

  return null;
}

export default function OSMTestPage() {
  const center: [number, number] = [39.76, -74.09];
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>("50th");
  const [currentGeoJson, setCurrentGeoJson] = useState<any>(null);

  const getTitleAndSubtitle = (dataset: DatasetType) => {
    const scenarios = {
      "05th": { percentile: "5th Percentile", subtitle: "Worst-Case Scenario" },
      "50th": { percentile: "50th Percentile", subtitle: "Most Likely Scenario" },
      "95th": { percentile: "95th Percentile", subtitle: "Best Case Scenario" },
    };
    return scenarios[dataset];
  };

  const { percentile, subtitle } = getTitleAndSubtitle(selectedDataset);

  return (
    <main>
      <style>{`
        .leaflet-tile {
          outline: 1px solid rgba(200, 200, 200, 0.4);
        }
      `}</style>

      <div className="container mx-auto mt-5 mb-5">
        
        {/* Title shifted outside of the grid to allow map and legends to align at the top perfectly */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-[#A32638] mb-1">
            Current Flood Map: {percentile}
          </h1>
          <p className="text-[#A32638] font-semibold text-sm">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 auto-cols-max md:grid-cols-5 gap-4">
          {/* Left Sidebar - Controls */}
          <div className="col-span-2 order-2">
            {/* Stevens Flood Advisory System Stations Section */}
            <div className="text-center bg-[#e4e5e6] px-4 py-2 mb-4">
              <h3 className="text-[#A32638]">STEVENS FLOOD ADVISORY SYSTEM STATIONS</h3>
              <h4 className="text-[#A32638] mt-2">OBSERVED WATER LEVEL</h4>
              <div>
                <p className="col text-lg text-black font-bold bg-[#bc40f6]">MAJOR FLOOD</p>
              </div>
              <div>
                <p className="col text-lg text-black font-bold bg-[#ea334b]">MODERATE FLOOD</p>
              </div>
              <div>
                <p className="col text-lg text-black font-bold bg-[#f19e4b]">MINOR FLOOD</p>
              </div>
              <div>
                <p className="col text-lg text-black font-bold bg-[#ffff54]">NEAR FLOOD</p>
              </div>
              <div>
                <p className="col text-lg text-black font-bold bg-[#75fb75]">NORMAL LEVELS</p>
              </div>
              <div>
                <p className="col text-lg text-black font-bold bg-[#999999]">BLOWOUT</p>
              </div>
              <div>
                <p className="text-lg text-black font-bold bg-white">MODEL PREDICTIONS ONLY</p>
              </div>
              <p className="text-sm mt-3">Marker color indicates current water level. Blinking markers indicate predicted flooding.</p>
            </div>

            {/* Flood Inundation and Depth Legend Section */}
            <div className="text-center bg-[#e4e5e6] px-4 py-2 mb-4">
              <h3 className="text-[#A32638]">Flood Inundation</h3>
              <p className="text-xs text-gray-700 text-center mb-3">Default is set to 50th Percentile</p>
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
                  backgroundColor: "white",
                  marginTop: "8px",
                  marginBottom: "20px"
                }}
              >
                <option value="05th">5% Chance Exceedance: Worst-Case Scenario</option>
                <option value="50th">50% Chance Exceedance: Most Likely Scenario</option>
                <option value="95th">95% Chance Exceedance: Best-Case Scenario</option>
              </select>

              <h3 className="text-[#A32638]">Flood Depth Legend</h3>
              <div>
                <p className="col text-lg text-black font-bold bg-[#E8F4F8]">{'< 1 FOOT'}</p>
              </div>
              <div>
                <p className="col text-lg text-black font-bold bg-[#8DD4E8]">1 - 2 FEET</p>
              </div>
              <div>
                <p className="col text-lg text-black font-bold bg-[#3EB5E6]">2 - 3 FEET</p>
              </div>
              <div>
                <p className="col text-lg text-black font-bold bg-[#0570B0]">{'>'}3 FEET</p>
              </div>
            </div>
          </div>

          {/* Right Main Content - Map */}
          <div className="col-span-3 flex flex-col items-left order-1">
            <div style={{ width: "100%", flexGrow: 1, position: "relative", minHeight: "600px" }}>
              <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }} minZoom={5} maxZoom={28}>
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={28}
                  maxNativeZoom={19}
                />
                <VectorGeoJSONLayer dataset={selectedDataset} onData={(d) => setCurrentGeoJson(d)} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}