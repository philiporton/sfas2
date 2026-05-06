"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ============================================================
// TYPES
// ============================================================

// DatasetType represents the three flood probability scenarios:
// "05th" = 5th percentile (least severe)
// "50th" = 50th percentile (median)
// "95th" = 95th percentile (most severe)
type DatasetType = "05th" | "50th" | "95th";

// ============================================================
// CONSTANTS
// ============================================================

// ZOOM_THRESHOLD: the zoom level at which we switch from
// showing the lightweight overview file to showing detailed tiles.
// Below this zoom = main file. At or above = tiles.
const ZOOM_THRESHOLD = 15;

// PCE_FILE_MAP: maps each dataset to its overview GeoJSON file.
// These are lower-detail files used when zoomed out.
const PCE_FILE_MAP: Record<DatasetType, string> = {
  "05th": "/new_tiled_data/tiled_data/flood_depth_05pce.geojson",
  "50th": "/new_tiled_data/tiled_data/flood_depth_50pce.geojson",
  "95th": "/new_tiled_data/tiled_data/flood_depth_95pce.geojson",
};

// ============================================================
// TILING SYSTEM (currently disabled — see bottom of file)
// ============================================================
// The tiling system was built to improve performance at high zoom
// levels by splitting the full dataset into smaller geographic
// chunks (tiles). Instead of loading one huge GeoJSON file,
// only tiles visible in the current viewport are loaded.
//
// TILE STRUCTURE:
// - The full dataset is split into a grid of tiles, e.g. tile01x01, tile01x02...
// - Each tile is a GeoJSON FeatureCollection covering a small area
// - Tiles are named with their dataset key: _05pce_, _50pce_, _95pce_
// - A tile-manifest.json lists all tile filenames for dynamic loading
//
// DATASET_KEY: maps each DatasetType to the substring used in tile filenames
// so we can filter the manifest to only load tiles for the active dataset.
//
// const DATASET_KEY: Record<DatasetType, string> = {
//   "05th": "_05pce_",
//   "50th": "_50pce_",
//   "95th": "_95pce_",
// };
//
// TileRecord: the shape of each entry stored in the tile registry.
// - path: the URL to fetch the tile
// - dataset: which scenario this tile belongs to
// - bounds: the geographic bounding box of the tile (used for viewport matching)
// - data: the raw GeoJSON data of the tile
//
// type TileRecord = {
//   path: string;
//   dataset: DatasetType;
//   bounds: L.LatLngBounds;
//   data: any;
// };
//
// tileRegistry: stores all preloaded tiles, organized by dataset.
// This allows instant switching between datasets at high zoom
// without re-fetching anything.
//
// const tileRegistry: Record<DatasetType, TileRecord[]> = {
//   "05th": [],
//   "50th": [],
//   "95th": [],
// };
//
// registryReady: true once all tiles have finished preloading.
// registryLoading: true while preloading is in progress (prevents duplicate loads).
// registryCallbacks: functions queued to run once the registry is ready.
// Used so that if the user zooms in before preloading finishes,
// the render waits and fires immediately when ready.
//
// let registryReady = false;
// let registryLoading = false;
// const registryCallbacks: (() => void)[] = [];
//
// preloadAllTiles(): called once on component mount.
// Fetches tile-manifest.json to get the full list of tile filenames,
// then fetches ALL tiles in parallel using Promise.all.
// Each tile's bounding box is computed and stored alongside its data.
//
// const preloadAllTiles = async () => {
//   if (registryReady || registryLoading) return;
//   registryLoading = true;
//   console.log("Preloading all tiles...");
//   const files: string[] = await fetch("/new_tiled_data/tile-manifest.json").then((r) => r.json());
//   await Promise.all(
//     files.map(async (filename) => {
//       const path = `/new_tiled_data/tiled_data/${filename}`;
//       let tileDataset: DatasetType | null = null;
//       for (const [ds, key] of Object.entries(DATASET_KEY)) {
//         if (filename.includes(key)) {
//           tileDataset = ds as DatasetType;
//           break;
//         }
//       }
//       if (!tileDataset) return;
//       try {
//         const geojson = await fetch(path).then((r) => r.json());
//         const layer = L.geoJSON(geojson);
//         const bounds = layer.getBounds();
//         if (!bounds.isValid()) return;
//         tileRegistry[tileDataset!].push({ path, dataset: tileDataset!, bounds, data: geojson });
//       } catch (err) {
//         console.log("Failed tile:", filename);
//       }
//     })
//   );
//   registryReady = true;
//   registryLoading = false;
//   console.log("All tiles preloaded:", Object.entries(tileRegistry).map(([k, v]) => `${k}: ${v.length}`).join(", "));
//   registryCallbacks.forEach((cb) => cb());
//   registryCallbacks.length = 0;
// };
//
// waitForRegistry(): returns a Promise that resolves immediately
// if tiles are already loaded, or waits in the callback queue
// until preloadAllTiles() finishes.
//
// const waitForRegistry = (): Promise<void> => {
//   if (registryReady) return Promise.resolve();
//   return new Promise((resolve) => registryCallbacks.push(resolve));
// };
//
// VIEWPORT MATCHING (used inside loadVisibleData when tiling is active):
// After waiting for the registry, get the current map viewport bounds
// and filter the registry to only tiles that intersect with it.
// This means only tiles the user can actually see are rendered.
//
// await waitForRegistry();
// activeKeyRef.current = ""; // reset after registry resolves
// const viewBounds = map.getBounds();
// const matchingTiles = tileRegistry[dataset].filter(
//   (tile) =>
//     tile.bounds &&
//     tile.bounds.isValid() &&
//     tile.bounds.intersects(viewBounds)
// );
// const key = matchingTiles.map((t) => t.path).sort().join("|");
// if (activeKeyRef.current === key) return;
// activeKeyRef.current = key;
// const combined = {
//   type: "FeatureCollection",
//   features: matchingTiles.flatMap((tile) => tile.data.features || []),
// };
// drawGeoJSON(combined);
//
// To re-enable tiling:
// 1. Uncomment all the blocks above
// 2. Call preloadAllTiles() in the mount useEffect
// 3. Replace the zoom >= ZOOM_THRESHOLD block in loadVisibleData
//    with the viewport matching block above
// ============================================================

export default function VectorGeoJSONLayer({
  dataset,
}: {
  dataset: DatasetType;
}) {
  const map = useMap();

  // layerRef: holds a reference to the currently rendered Leaflet GeoJSON layer
  // so we can remove it before drawing a new one (prevents layer stacking).
  const layerRef = useRef<L.GeoJSON | null>(null);

  // activeKeyRef: tracks what is currently displayed.
  // If the key hasn't changed (same dataset, same zoom, same tiles),
  // we skip re-rendering to avoid unnecessary redraws.
  const activeKeyRef = useRef("");

  // Removes the current layer from the map and clears the ref.
  const clearLayer = () => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
  };

  // Renders a GeoJSON object onto the map with a consistent style.
  // Always clears the previous layer first.
  const drawGeoJSON = (geojson: any) => {
    clearLayer();

    const layer = L.geoJSON(geojson, {
      style: {
        color: "#0055ff",
        weight: 1,
        fillColor: "#3388ff",
        fillOpacity: 0.45,
      },
    });

    layer.addTo(map);
    layerRef.current = layer;
  };

  // loadVisibleData: the main render decision function.
  // Called on mount, on dataset change, and on map zoom/move events.
  // Currently only uses the overview main file regardless of zoom.
  // Tiling logic would slot in below the zoom threshold check.
  const loadVisibleData = useCallback(async () => {
    const zoom = map.getZoom();

    // Always load the main overview file for the selected dataset.
    // This is a single GeoJSON file covering the full area at lower detail.
    // FUTURE: when zoom >= ZOOM_THRESHOLD, switch to tiled rendering instead.
    const key = `main-${dataset}`;
    if (activeKeyRef.current === key) return;
    activeKeyRef.current = key;

    const file = PCE_FILE_MAP[dataset];
    console.log("Viewing Main File:", file);
    const geojson = await fetch(file).then((r) => r.json());
    drawGeoJSON(geojson);

    // FUTURE TILING SLOT:
    // if (zoom >= ZOOM_THRESHOLD) {
    //   -- viewport matching + tile rendering goes here --
    // }
  }, [dataset, map]);

  // Reset the active key and reload whenever the dataset changes.
  useEffect(() => {
    activeKeyRef.current = "";
    loadVisibleData();
  }, [dataset, loadVisibleData]);

  // Re-run loadVisibleData whenever the user zooms or pans the map.
  // zoomend fires after zoom animation completes.
  // moveend fires after panning stops.
  useMapEvents({
    zoomend: loadVisibleData,
    moveend: loadVisibleData,
  });

  // Cleanup: remove the layer from the map when the component unmounts.
  useEffect(() => {
    return () => clearLayer();
  }, []);

  return null;
}