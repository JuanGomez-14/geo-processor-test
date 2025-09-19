"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapEvents from "./MapEvents";
import { renderToStaticMarkup } from 'react-dom/server';
import { FaMapMarkerAlt } from 'react-icons/fa';

const markerHtml = renderToStaticMarkup(
  <FaMapMarkerAlt size={30} color="#0d6efd" />
);
const customIcon = new L.DivIcon({
  html: markerHtml,
  className: '',
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42]
});

interface MapProps {
  points: [number, number][];
  result: any;
  onMapClick: (e: L.LeafletMouseEvent) => void;
  onRemovePoint: (index: number) => void;
}

export default function ClientOnlyMap({ points, result, onMapClick, onRemovePoint }: MapProps) {
  return (
    <div className="flex-1 relative z-10">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <MapEvents onMapClick={onMapClick} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((pos, index) => (
          <Marker
            key={index}
            position={pos}
            icon={customIcon}
            eventHandlers={{
              click: () => onRemovePoint(index),
            }}
          >
            <Popup>
              Point {index + 1}: Lat {pos[0]}, Lng {pos[1]}
              <br />
              Click here to remove
            </Popup>
          </Marker>
        ))}
        {result && (
          <>
            <Marker position={[result.centroid.lat, result.centroid.lng]} icon={customIcon}>
              <Popup>
                Centroid: Lat {result.centroid.lat.toFixed(4)}, Lng {result.centroid.lng.toFixed(4)}
              </Popup>
            </Marker>
            <Polyline
              positions={[
                [result.bounds.south, result.bounds.west],
                [result.bounds.south, result.bounds.east],
                [result.bounds.north, result.bounds.east],
                [result.bounds.north, result.bounds.west],
                [result.bounds.south, result.bounds.west],
              ]}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}