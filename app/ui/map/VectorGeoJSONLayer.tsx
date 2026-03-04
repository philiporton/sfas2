"use client";

import { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import type {GeoJSON as GeoJSONType} from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FloodFeature, FloodFeatureCollection, isFloodFeatureCollection } from "../../lib/flood";

type DatasetType = "05th" | "50th" | "95th";

export default function VectorGeoJSONLayer({ dataset, onData }: { dataset: DatasetType; onData?: (d: GeoJSONType) => void }) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONType | null>(null);

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
  }, [dataset, onData]);

  useEffect(() => {
    if (!geoJsonData || !map) return;

    // Check if it's a FeatureCollection before accessing features
    if (!isFloodFeatureCollection(geoJsonData)) {
      console.error('Expected FloodFeatureCollection with depth properties, got:', geoJsonData.type);
      return;
    }

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

    const styleFeature = (feature: GeoJSON.Feature | undefined) => {
      // Handle case when feature is undefined
      if (!feature) {
        return {
          fillColor: "#ffffff00",
          weight: 1,
          opacity: 1,
          color: "#ffffff00",
          fillOpacity: 0,
        } as L.PathOptions;
      }
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

    const makeDepth = (props: FloodFeature["properties"]) => {
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
    const featureCollection = geoJsonData as FloodFeatureCollection;

    for (const bucket of buckets) {
      const feats = (featureCollection.features || []).filter((feat: FloodFeature) => {
        const depth_m = makeDepth(feat.properties || {});
        if (depth_m === null || isNaN(depth_m)) return false;
        return bucket.test(depth_m);
      });

      if (feats.length === 0) continue;

      const coll: FloodFeatureCollection = {
        type: "FeatureCollection",
        features: feats
      };
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

