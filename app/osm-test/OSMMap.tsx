"use client";

import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function OSMMap() {
    //Hoboken, NJ
  const center: [number, number] = [40.74399, -74.03236];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={center} radius={10} pathOptions={{ color: "red" }}>
          <Popup>Hoboken, NJ</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}