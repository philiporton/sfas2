"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { DatasetType } from "../types";

export default function VectorGeoJSONLayer({
  dataset,
  onData,
}: {
  dataset: DatasetType;
  onData?: (d: any) => void;
}) {
  const map = useMap();
  const staticGroupRef = useRef<L.LayerGroup | null>(null);
  const floodGroupRef = useRef<L.LayerGroup | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  const ft1 = 0.3048;
  const ft2 = 0.6096;
  const ft3 = 0.9144;

  const getColorForDepth = (depth_m: number | null) => {
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

  const makeDepth = (props: any) => {
    const hasMin = typeof props.depth_min_ft === "number";
    const hasMax = typeof props.depth_max_ft === "number";
    if (hasMin && hasMax) {
      const mean = (props.depth_min_ft + props.depth_max_ft) / 2;
      return mean > 0 ? mean : null;
    }
    if (hasMin) return props.depth_min_ft > 0 ? props.depth_min_ft : null;
    if (hasMax) return props.depth_max_ft > 0 ? props.depth_max_ft : null;
    if (typeof props.depth_class === "number") return props.depth_class > 0 ? props.depth_class : null;
    return null;
  };

  const createFloodGroup = (geoJsonData: any) => {
    const buckets = [
      { key: "gte3", test: (d: number) => d >= ft3 },
      { key: "2to3", test: (d: number) => d >= ft2 && d < ft3 },
      { key: "1to2", test: (d: number) => d >= ft1 && d < ft2 },
      { key: "lt1", test: (d: number) => d < ft1 },
    ];

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
          if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
            const props = feature.properties || {};
            if (props && Object.keys(props).length > 0) {
              const min_m = typeof props.depth_min_ft === "number" ? props.depth_min_ft : null;
              const max_m = typeof props.depth_max_ft === "number" ? props.depth_max_ft : null;
              const depth = min_m !== null && max_m !== null ? (min_m + max_m) / 2 : min_m ?? max_m;
              const depthLabel = depth === null ? null : depth >= 3 ? "3+ " : depth >= 2 ? "2 ft - 3 " : depth >= 1 ? "1 ft - 2  " : "< 1 ";
              let popupContent = "<div>";
              if (depthLabel !== null) {
                popupContent += `<p><strong>Depth:</strong> ${depthLabel} ft</p>`;
              }
              popupContent += "</div>";
              layer.bindPopup(popupContent);
            }
          }
        },
      });
      layer.addTo(group);
    }

    return group;
  };

  const createAreaGroup = (geoJsonData: any) => {
    const group = L.layerGroup();
    const layer = L.geoJSON(geoJsonData, {
      style: () => ({
        color: "#828282",
        weight: 3,
        opacity: 0.9,
        fillOpacity: 0,
      }),
      onEachFeature: (feature, layer) => {
        if (feature.geometry?.type === "LineString" || feature.geometry?.type === "MultiLineString") {
          layer.bindPopup("Limit of forecast coverage");
        }
      },
    });
    layer.addTo(group);
    return group;
  };

  useEffect(() => {
    if (!map) return;
    let cancelled = false;

    const loadBoundary = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FLOOD_DATA_URL}/geojson/forecast_boundary.geojson`);
        if (!res.ok) {
          console.error("Failed to fetch boundary geojson", res.status);
          return;
        }

        const boundaryData = await res.json();
        if (cancelled) return;

        const newStaticGroup = createAreaGroup(boundaryData);
        map.whenReady(() => {
          newStaticGroup.addTo(map);
          if (staticGroupRef.current) {
            map.removeLayer(staticGroupRef.current);
          }
          staticGroupRef.current = newStaticGroup;
        });
      } catch (err) {
        console.error("Error loading boundary geojson:", err);
      }
    };

    loadBoundary();

    return () => {
      cancelled = true;
      if (staticGroupRef.current && map.hasLayer(staticGroupRef.current)) {
        map.removeLayer(staticGroupRef.current);
        staticGroupRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    if (!dataset || !map) return;
    let cancelled = false;

    const loadFloodData = async () => {
      try {
        const level = dataset.replace("th", "");
        const res = await fetch(`${process.env.NEXT_PUBLIC_FLOOD_DATA_URL}/geojson/flood_depth_${level}pce.geojson.gz`);

        if (!res.ok) {
          console.error("Failed to fetch flood geojson data");
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        setGeoJsonData(data);
        if (onData) onData(data);
      } catch (err) {
        console.error("Error loading flood geojson:", err);
      }
    };

    loadFloodData();

    return () => {
      cancelled = true;
    };
  }, [dataset, map, onData]);

  useEffect(() => {
    if (!geoJsonData || !map) return;

    const newFloodGroup = createFloodGroup(geoJsonData);
    const previousFloodGroup = floodGroupRef.current;

    newFloodGroup.addTo(map);
    if (previousFloodGroup) {
      map.removeLayer(previousFloodGroup);
    }
    floodGroupRef.current = newFloodGroup;

    return () => {
      if (floodGroupRef.current) {
        map.removeLayer(floodGroupRef.current);
        floodGroupRef.current = null;
      }
    };
  }, [geoJsonData, map]);

  return null;
}
