"use client";

import dynamic from 'next/dynamic';
type DatasetType = "05th" | "50th" | "95th";


export default function MapWrapper({ dataset }: { dataset: DatasetType }) {
  const MapContent = dynamic(
    () => import('./MapContent'),
    { 
      ssr: false,
      loading: () => (
        <div className="flex items-center justify-center min-h-[600px] bg-gray-100">
          <p className="text-gray-600">Loading map...</p>
        </div>
      )
    }
  );

  return <MapContent dataset={dataset} />;
}