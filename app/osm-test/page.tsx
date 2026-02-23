"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
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
  const center: [number, number] = [40.74399, -74.03236];
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>("50th");
  const [currentGeoJson, setCurrentGeoJson] = useState<any>(null);

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
                <VectorGeoJSONLayer dataset={selectedDataset} onData={(d) => setCurrentGeoJson(d)} />
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
              <div className="mt-3 text-left">
                {(() => {
                  // thresholds in meters
                  const ft1 = 0.3048;
                  const ft2 = 0.6096;
                  const ft3 = 0.9144;

                  const ranges = [
                    { key: "lt1", label: "< 1 ft", color: "#f2fbff", test: (d: number) => d < ft1 },
                    { key: "1to2", label: "1 - 2 ft", color: "#bfe8ff", test: (d: number) => d >= ft1 && d < ft2 },
                    { key: "2to3", label: "2 - 3 ft", color: "#6aaefc", test: (d: number) => d >= ft2 && d < ft3 },
                    { key: "gte3", label: ">= 3 ft", color: "#2a67d9", test: (d: number) => d >= ft3 },
                  ];

                  // Always show the four depth ranges in ascending order
                  return ranges.map((r) => (
                    <div key={r.key} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                      <div style={{ width: "30px", height: "30px", backgroundColor: r.color, border: "1px solid rgba(0,0,0,0.12)", marginRight: "10px" }} />
                      <p className="mb-0">{r.label}</p>
                    </div>
                  ));
                })()}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Colors show flood depth ranges at the selected percentile. Lighter blues = less depth; darker = more depth.
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
