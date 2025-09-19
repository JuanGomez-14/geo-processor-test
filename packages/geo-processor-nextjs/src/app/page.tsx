"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import L from "leaflet";
import HelpModal from './HelpModal';

const ClientOnlyMap = dynamic(() => import("./ClientOnlyMap"), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_NESTJS_API_URL;

export default function GeoprocessorPage() {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [result, setResult] = useState<any>(null);
  const [latInput, setLatInput] = useState<string>("");
  const [lngInput, setLngInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleProcessPoints = async () => {
    try {
      const response = await axios.post(`${API_URL}/process`, {
        points: points.map(([lat, lng]) => ({ lat, lng })),
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error processing points:", error);
      setResult(null);
      alert("Error processing points. Please make sure the backend services are running.");
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setPoints([...points, [lat, lng]]);
  };

  const handleAddPointFromInput = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPoints([...points, [lat, lng]]);
      setLatInput("");
      setLngInput("");
    } else {
      alert("Invalid latitude or longitude. Please enter valid numbers.");
    }
  };

  const handleRemovePoint = (indexToRemove: number) => {
    setPoints(points.filter((_, index) => index !== indexToRemove));
    setResult(null);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center">Geoprocessor App</h1>
        <button
          onClick={handleOpenModal}
          className="bg-gray-500 text-white font-bold py-1 px-3 rounded hover:bg-gray-700 transition-colors duration-200"
        >
          Help
        </button>
      </div>

      {isModalOpen && <HelpModal onClose={handleCloseModal} />}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Latitude"
          value={latInput}
          onChange={(e) => setLatInput(e.target.value)}
          className="p-2 border rounded w-1/4 text-white"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lngInput}
          onChange={(e) => setLngInput(e.target.value)}
          className="p-2 border rounded w-1/4 text-white"
        />
        <button
          onClick={handleAddPointFromInput}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200"
        >
          Add Point
        </button>
        <button
          onClick={handleProcessPoints}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 w-1/2"
        >
          Process Points
        </button>
      </div>

      <ClientOnlyMap points={points} result={result} onMapClick={handleMapClick} onRemovePoint={handleRemovePoint} />

      {result && (
        <div className="bg-gray-100 p-4 rounded-lg text-gray-800">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Processing Results</h3>
          <p>Centroid: Latitude {result.centroid.lat.toFixed(4)}, Longitude {result.centroid.lng.toFixed(4)}</p>
          <p>Bounding Box:</p>
          <ul className="list-disc list-inside">
            <li>North: {result.bounds.north.toFixed(4)}</li>
            <li>South: {result.bounds.south.toFixed(4)}</li>
            <li>East: {result.bounds.east.toFixed(4)}</li>
            <li>West: {result.bounds.west.toFixed(4)}</li>
          </ul>
        </div>
      )}
    </div>
  );
}