"use client";

import dynamic from 'next/dynamic';

// Dynamically import the actual map component with SSR disabled
const OSMMap = dynamic(
  () => import('./OSMMap'),
  { ssr: false }
);

export default function OSMTestPage() {
  return <OSMMap />;
}