"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Este es el fix definitivo para los íconos de Leaflet.
// Se crea un ícono por defecto que soluciona los problemas de rutas en Next.js.
const defaultIcon = new L.Icon({
  iconUrl:
    "https://leafletjs.com/examples/quick-start/marker-icon.png",
  iconRetinaUrl:
    "https://leafletjs.com/examples/quick-start/marker-icon-2x.png",
  shadowUrl:
    "https://leafletjs.com/examples/quick-start/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const API_URL = process.env.NEXT_PUBLIC_NESTJS_API_URL;

export default function GeoprocessorPage() {
  const [points, setPoints] = useState<[number, number][]>([
    [40.7128, -74.006],
    [34.0522, -118.2437],
    [33.749, -84.388],
  ]);
  const [result, setResult] = useState<any>(null);

  const handleProcessPoints = async () => {
    try {
      const response = await axios.post(`${API_URL}/process`, {
        points: points.map(([lat, lng]) => ({ lat, lng })),
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error processing points:", error);
      setResult(null);
      alert(
        "Error al procesar los puntos. Por favor, asegúrate de que los servicios backend estén en ejecución."
      );
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setPoints([...points, [lat, lng]]);
  };

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <h1 className="text-3xl font-bold text-center">
        Geoprocessor App
      </h1>
      <button
        onClick={handleProcessPoints}
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
      >
        Procesar Puntos
      </button>
      <div className="flex-1 relative">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          scrollWheelZoom={false}
          className="w-full h-full"
          eventHandlers={{ click: handleMapClick }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((pos, index) => (
            <Marker key={index} position={pos} icon={defaultIcon}>
              <Popup>
                Punto {index + 1}: Lat {pos[0]}, Lng {pos[1]}
              </Popup>
            </Marker>
          ))}
          {result && (
            <>
              <Marker
                position={[result.centroid.lat, result.centroid.lng]}
                icon={defaultIcon}
              >
                <Popup>
                  Centroide: Lat {result.centroid.lat.toFixed(4)}, Lng{" "}
                  {result.centroid.lng.toFixed(4)}
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
      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            Resultados del Procesamiento
          </h3>
          <p>
            Centroide: Latitud {result.centroid.lat.toFixed(4)}, Longitud{" "}
            {result.centroid.lng.toFixed(4)}
          </p>
          <p>Límites (Bounding Box):</p>
          <ul className="list-disc list-inside">
            <li>Norte: {result.bounds.north.toFixed(4)}</li>
            <li>Sur: {result.bounds.south.toFixed(4)}</li>
            <li>Este: {result.bounds.east.toFixed(4)}</li>
            <li>Oeste: {result.bounds.west.toFixed(4)}</li>
          </ul>
        </div>
      )}
    </div>
  );
}