"use client";

import { useMapEvents } from "react-leaflet";
import L from "leaflet";

interface MapEventsProps {
  onMapClick: (e: L.LeafletMouseEvent) => void;
}

export default function MapEvents({ onMapClick }: MapEventsProps) {
  useMapEvents({
    click: onMapClick,
  });

  return null;
}