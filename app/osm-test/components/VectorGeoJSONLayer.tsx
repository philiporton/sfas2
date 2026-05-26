"use client";

import { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { DatasetType } from "../types";
import wellknown from "wellknown";

export default function VectorGeoJSONLayer({ dataset, onData }: { dataset: DatasetType; onData?: (d: any) => void }) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

    useEffect(() => {

        if (!dataset) {
            console.log("dataset missing");
            return;
        }
        const loadGeoJSONAzure = async () => {
            try {
                const level = dataset.replace("th", "");

                const res = await fetch(`https://floodmapdata.blob.core.windows.net/geojson/flood_depth_${level}pce.geojson.gz`, { next: { revalidate: 21600 } });
                
                if (!res.ok) { return console.error("Failed to fetch geojson data"); }

                const data = await res.json();

                setGeoJsonData(data);
                if (onData) onData(data);
            } catch (err) {
                console.error("Error loading geojson:", err);
            }
        };
        
        loadGeoJSONAzure();
    }, [dataset]);

    useEffect(() => {
        if (!geoJsonData || !map) return;

        if (layerRef.current) {
            map.removeLayer(layerRef.current);
        }

    const getColorForDepth = (depth_m: number | null) => {
      const ft1 = 0.3048; 
      const ft2 = 0.6096; 
      const ft3 = 0.9144; 
      if (depth_m === null || isNaN(depth_m)) return "#ffffff00";
      if (depth_m < ft1) return "#ddf5ff";
      if (depth_m < ft2) return "#7bc1e9";
      if (depth_m < ft3) return "#3389eb";
      return "#1a4ba5";
    };

    const styleFeature = (feature: any) => {
      const props = feature.properties || {};
      let depth_m: number | null = null;
      const hasMin = typeof props.depth_min_ft === "number";
      const hasMax = typeof props.depth_max_ft === "number";
      
      if (hasMin && hasMax) {
        const mean = (props.depth_min_ft + props.depth_max_ft) / 2;
        depth_m = mean > 0 ? mean : null;
      } else if (hasMin) {
        depth_m = props.depth_min_ft > 0 ? props.depth_min_ft : null;
      } else if (hasMax) {
        depth_m = props.depth_max_ft > 0 ? props.depth_max_ft : null;
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

        const ft1 = 0.3048;
        const ft2 = 0.6096;
        const ft3 = 0.9144;

        const buckets = [
            { key: "gte3", test: (d: number) => d >= ft3 },
            { key: "2to3", test: (d: number) => d >= ft2 && d < ft3 },
            { key: "1to2", test: (d: number) => d >= ft1 && d < ft2 },
            { key: "lt1", test: (d: number) => d < ft1 }
        ];

        const makeDepth = (props: any) => {
            const hasMin = typeof props.depth_min_ft === "number";
            const hasMax = typeof props.depth_max_ft === "number";
            if (hasMin && hasMax) {
                const mean = (props.depth_min_ft + props.depth_max_ft) / 2;
                return mean > 0 ? mean : null;
            }
            if (hasMin) return props.depth_min_ft > 0 ? props.depth_min_ft : null;
            if (hasMax) return props.depth_max_ft > 0 ? props.depth_max_ft : null;
            if (typeof props.depth_class === "number")
                return props.depth_class > 0 ? props.depth_class : null;
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
            const min_m = typeof props.depth_min_ft === "number" ? props.depth_min_ft : null; // already in feet
            const max_m = typeof props.depth_max_ft === "number" ? props.depth_max_ft : null; // already in feet
            const depth = min_m !== null && max_m !== null ? (min_m + max_m) / 2 : min_m ?? max_m;
            const depthLabel = depth === null ? null : depth >= 3 ? "3+ " : depth >= 2 ? "2 ft - 3 " : depth >= 1 ? "1 ft - 2  " : "< 1 ";
            let popupContent = "<div>";
            if (depthLabel !== null) {
              popupContent += `<p><strong>Depth:</strong> ${depthLabel} ft</p>`;
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
