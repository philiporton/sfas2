//for flood data types
import type { Feature, FeatureCollection, GeoJSON as GeoJSONType } from "geojson";

export interface FloodFeatureProperties {
    depth_min_m: number;
    depth_max_m: number;
    depth_class: number;
    area_sq_km: number;
    flooded: number;
    [key: string]: unknown;//for other potential properties
}

export type FloodFeature = Feature & {
    properties: FloodFeatureProperties;
};

export type FloodFeatureCollection = FeatureCollection & {
    features: FloodFeature[];
};

// Type guard to check if a GeoJSON object is a FloodFeatureCollection
export function isFloodFeatureCollection(data: GeoJSONType): data is FloodFeatureCollection {
  if (data.type !== 'FeatureCollection') {
    return false;
  }
  
  // Check if features array exists and has at least one feature
  if (!data.features || data.features.length === 0) {
    return false;
  }
  
  // Check the first feature to verify it has the required properties
  const firstFeature = data.features[0];
  if (!firstFeature.properties) {
    return false;
  }
  
  const props = firstFeature.properties;
  
  // Verify required properties exist and are numbers
  return (
    typeof props.depth_min_m === 'number' &&
    typeof props.depth_max_m === 'number' &&
    typeof props.depth_class === 'number' &&
    typeof props.area_sq_km === 'number' &&
    typeof props.flooded === 'number'
  );
}